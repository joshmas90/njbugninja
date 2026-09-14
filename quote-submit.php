<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_field(mixed $value, int $max): string {
    $value = trim((string)$value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    if (mb_strlen($value) > $max) {
        $value = mb_substr($value, 0, $max);
    }
    return $value;
}

function read_smtp_response($socket): array {
    $lines = [];
    $code = 0;

    while (($line = fgets($socket, 2048)) !== false) {
        $lines[] = rtrim($line, "\r\n");
        if (preg_match('/^(\d{3})([ -])/', $line, $matches)) {
            $code = (int)$matches[1];
            if ($matches[2] === ' ') {
                break;
            }
        }
    }

    return [$code, implode("\n", $lines)];
}

function smtp_command($socket, string $command, array $expectedCodes): void {
    if ($command !== '') {
        if (fwrite($socket, $command . "\r\n") === false) {
            throw new RuntimeException('Unable to write to SMTP server.');
        }
    }

    [$code, $response] = read_smtp_response($socket);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('Unexpected SMTP response: ' . $response);
    }
}

function load_smtp_config(): array {
    $configPath = dirname(__DIR__) . '/mosquito-ninja-private.php';
    $config = [];

    if (is_file($configPath)) {
        $loaded = require $configPath;
        if (is_array($loaded)) {
            $config = $loaded;
        }
    }

    $host = trim((string)($config['smtp_host'] ?? getenv('MOSQUITO_NINJA_SMTP_HOST') ?: 'smtp.hostinger.com'));
    $port = (int)($config['smtp_port'] ?? getenv('MOSQUITO_NINJA_SMTP_PORT') ?: 465);
    $user = trim((string)($config['smtp_user'] ?? getenv('MOSQUITO_NINJA_SMTP_USER') ?: 'service@njbugninja.com'));
    $pass = (string)($config['smtp_pass'] ?? getenv('MOSQUITO_NINJA_SMTP_PASS') ?: '');

    if ($host === '' || $port < 1 || $port > 65535 || $user === '' || $pass === '') {
        throw new RuntimeException('SMTP configuration is incomplete.');
    }

    return [
        'host' => $host,
        'port' => $port,
        'user' => $user,
        'pass' => $pass,
    ];
}

function send_smtp_mail(string $recipient, string $subject, string $body): void {
    $smtp = load_smtp_config();
    $remote = 'ssl://' . $smtp['host'] . ':' . $smtp['port'];

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $smtp['host'],
            'SNI_enabled' => true,
        ],
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        $remote,
        $errno,
        $errstr,
        12,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!is_resource($socket)) {
        throw new RuntimeException('Unable to connect to SMTP server.');
    }

    stream_set_timeout($socket, 12);

    try {
        smtp_command($socket, '', [220]);
        smtp_command($socket, 'EHLO njbugninja.com', [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($smtp['user']), [334]);
        smtp_command($socket, base64_encode($smtp['pass']), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $smtp['user'] . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $safeSubject = str_replace(["\r", "\n"], ' ', $subject);
        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: Mosquito Ninja Website <' . $smtp['user'] . '>',
            'To: <' . $recipient . '>',
            'Reply-To: ' . $smtp['user'],
            'Subject: ' . $safeSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: Mosquito Ninja Website',
        ];

        $normalizedBody = preg_replace("/\r\n|\r|\n/", "\r\n", $body) ?? $body;
        $normalizedBody = preg_replace('/^\./m', '..', $normalizedBody) ?? $normalizedBody;
        $message = implode("\r\n", $headers) . "\r\n\r\n" . $normalizedBody . "\r\n.\r\n";

        if (fwrite($socket, $message) === false) {
            throw new RuntimeException('Unable to send message data.');
        }

        [$code, $response] = read_smtp_response($socket);
        if ($code !== 250) {
            throw new RuntimeException('SMTP delivery was rejected: ' . $response);
        }

        @fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$allowedOrigins = [
    'https://njbugninja.com',
    'https://www.njbugninja.com',
];
$origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'message' => 'Request origin not allowed.']);
}

$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
$data = $_POST;
if (str_contains($contentType, 'application/json')) {
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 16384) {
        respond(413, ['ok' => false, 'message' => 'Request is too large.']);
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, ['ok' => false, 'message' => 'Invalid request.']);
    }
    $data = $decoded;
}

// Honeypot: real visitors never see or fill this field.
if (trim((string)($data['website'] ?? '')) !== '') {
    respond(200, ['ok' => true, 'message' => 'Request received.']);
}

$name = clean_field($data['name'] ?? '', 120);
$phone = clean_field($data['phone'] ?? '', 30);
$location = clean_field($data['location'] ?? '', 120);
$serviceKey = clean_field($data['service'] ?? 'mosquito', 30);
$message = clean_field($data['message'] ?? '', 3000);

$services = [
    'mosquito' => 'Mosquito control',
    'tick' => 'Tick control',
    'both' => 'Mosquito & tick control',
    'commercial' => 'Commercial / government property',
];

$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if ($name === '' || $location === '' || strlen($phoneDigits) < 10 || !array_key_exists($serviceKey, $services)) {
    respond(422, ['ok' => false, 'message' => 'Please complete your name, phone number, town/ZIP and service.']);
}

$recipient = 'service@njbugninja.com';
$service = $services[$serviceKey];
$subjectLocation = preg_replace('/[\r\n]+/', ' ', $location) ?? $location;
$subject = 'New Website Quote - ' . $service . ' - ' . $subjectLocation;
if (mb_strlen($subject) > 180) {
    $subject = mb_substr($subject, 0, 180);
}

$body = "New Mosquito Ninja website quote request\n\n"
    . "Name: {$name}\n"
    . "Phone: {$phone}\n"
    . "Town / ZIP: {$location}\n"
    . "Service: {$service}\n\n"
    . "Property details:\n" . ($message !== '' ? $message : '(none provided)') . "\n\n"
    . "Submitted: " . gmdate('Y-m-d H:i:s') . " UTC\n"
    . "Source: https://njbugninja.com/\n";

try {
    send_smtp_mail($recipient, $subject, $body);
} catch (Throwable $error) {
    error_log('Mosquito Ninja quote SMTP error: ' . $error->getMessage());
    respond(503, [
        'ok' => false,
        'message' => 'Email delivery is temporarily unavailable. Please call or text 609-313-6317.',
    ]);
}

respond(200, [
    'ok' => true,
    'message' => 'Request sent. Mosquito Ninja will follow up using the phone number you provided.',
]);

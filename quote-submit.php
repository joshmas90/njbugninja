<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
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

function clean_field(mixed $value, int $max): string {
    $value = trim((string)$value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    if (mb_strlen($value) > $max) {
        $value = mb_substr($value, 0, $max);
    }
    return $value;
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

$headers = [
    'From: Mosquito Ninja Website <service@njbugninja.com>',
    'Reply-To: service@njbugninja.com',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: Mosquito Ninja Website',
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond(503, [
        'ok' => false,
        'message' => 'Email delivery is temporarily unavailable. Please call or text 609-313-6317.',
    ]);
}

respond(200, [
    'ok' => true,
    'message' => 'Request sent. Mosquito Ninja will follow up using the phone number you provided.',
]);

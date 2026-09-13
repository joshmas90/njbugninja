#!/usr/bin/env python3
"""Check the static site's crawlable pages and metadata using only Python's stdlib."""
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://njbugninja.com'
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.tags, self.title, self.json_blocks = path, [], '', []
        self.in_title = self.in_json = False
        self.ids = []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        self.tags.append((tag, data))
        if 'id' in data:
            self.ids.append(data['id'])
        if tag == 'title':
            self.in_title = True
        if tag == 'script' and data.get('type') == 'application/ld+json':
            self.in_json = True
            self.json_blocks.append('')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script':
            self.in_json = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_json:
            self.json_blocks[-1] += data

    def meta(self, key):
        return [a.get('content', '') for t, a in self.tags if t == 'meta' and (a.get('name') == key or a.get('property') == key)]

    def links(self, rel):
        return [a.get('href', '') for t, a in self.tags if t == 'link' and a.get('rel') == rel]


def check(condition, message):
    if not condition:
        errors.append(message)


pages = {p.name: Page(p) for p in ROOT.glob('*.html')}
titles, descriptions, canonicals = [], [], []
for name, page in sorted(pages.items()):
    prefix = name + ': '
    check(sum(t == 'h1' for t, _ in page.tags) == 1, prefix + 'expected one h1')
    check(sum(t == 'head' for t, _ in page.tags) == 1, prefix + 'expected one head')
    check(sum(t == 'title' for t, _ in page.tags) == 1, prefix + 'expected one title')
    check(len(page.ids) == len(set(page.ids)), prefix + 'duplicate HTML ids')
    check(len(page.meta('description')) == 1 and bool(page.meta('description')[0]), prefix + 'missing/duplicate description')
    check(len(page.meta('robots')) == 1, prefix + 'missing/duplicate robots metadata')
    check(any(t == 'html' and a.get('lang') == 'en' for t, a in page.tags), prefix + 'missing document language')
    titles.append(page.title)
    descriptions.extend(page.meta('description'))
    if name == '404.html':
        check(page.meta('robots') == ['noindex, follow'], prefix + '404 must be noindex')
        check(not page.links('canonical'), prefix + '404 must not canonicalize to a valid page')
    else:
        expected_url = ORIGIN + ('/' if name == 'index.html' else '/' + name)
        check(page.links('canonical') == [expected_url], prefix + 'incorrect canonical')
        check(page.meta('og:url') == [expected_url], prefix + 'Open Graph URL differs from canonical')
        check(page.meta('og:title') == [page.title], prefix + 'Open Graph title mismatch')
        check(page.meta('og:description') == page.meta('description'), prefix + 'Open Graph description mismatch')
        check('noindex' not in ','.join(page.meta('robots')), prefix + 'indexable page has noindex')
        canonicals.append(expected_url)
        try:
            check(len(page.json_blocks) == 1, prefix + 'expected one JSON-LD graph')
            graph = json.loads(page.json_blocks[0])['@graph']
            nodes = {node['@id']: node for node in graph}
            check(len(nodes) == len(graph), prefix + 'duplicate structured data ids')
            check(nodes[ORIGIN + '/#business']['telephone'] == '+1-609-313-6317', prefix + 'business phone mismatch')
            if name != 'index.html':
                crumbs = nodes[expected_url + '#breadcrumb']['itemListElement']
                check([c['position'] for c in crumbs] == [1, 2], prefix + 'invalid breadcrumb positions')
                check(crumbs[-1]['item'] == expected_url, prefix + 'breadcrumb URL mismatch')
            if name in {'mosquito-control.html', 'tick-control.html', 'commercial.html'}:
                check(nodes[expected_url + '#service']['@type'] == 'Service', prefix + 'missing Service entity')
            def validate_refs(value):
                if isinstance(value, dict):
                    if set(value) == {'@id'}:
                        check(value['@id'] in nodes, prefix + 'unresolved entity reference: ' + value['@id'])
                    for child in value.values():
                        validate_refs(child)
                elif isinstance(value, list):
                    for child in value:
                        validate_refs(child)
            validate_refs(graph)
        except (ValueError, KeyError, IndexError) as exc:
            errors.append(prefix + 'invalid structured data: ' + str(exc))
    for tag, attrs in page.tags:
        if tag == 'img':
            check('alt' in attrs and 'width' in attrs and 'height' in attrs, prefix + 'image missing alt/dimensions')
        for key in ('href', 'src'):
            value = attrs.get(key)
            if not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme in {'tel', 'sms', 'mailto', 'data'} or parsed.netloc not in {'', 'njbugninja.com'}:
                continue
            target_name = unquote(parsed.path.lstrip('/')) if parsed.path else name
            target_name = target_name or 'index.html'
            target = ROOT / target_name
            check(target.is_file(), prefix + 'missing internal target: ' + value)
            if parsed.fragment and target_name in pages:
                check(unquote(parsed.fragment) in pages[target_name].ids, prefix + 'broken fragment: ' + value)
    print(f'{name}: title {len(page.title)} chars; description {len(page.meta("description")[0])} chars')

check(len(titles) == len(set(titles)), 'Duplicate page titles')
check(len(descriptions) == len(set(descriptions)), 'Duplicate meta descriptions')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap = ET.parse(ROOT / 'sitemap.xml').getroot()
sitemap_urls = [node.text for node in sitemap.findall('s:url/s:loc', ns)]
check(Counter(sitemap_urls) == Counter(canonicals), 'Sitemap and indexable canonical URLs differ')
for node in sitemap.findall('s:url/s:lastmod', ns):
    check(date.fromisoformat(node.text) <= date.today(), 'Future sitemap lastmod date')
robots = (ROOT / 'robots.txt').read_text()
check('Sitemap: ' + ORIGIN + '/sitemap.xml' in robots, 'Missing sitemap in robots.txt')
check(not re.search(r'^Disallow:\s*/\s*$', robots, re.M), 'robots.txt blocks the site')
css = (ROOT / 'mosquito-ninja-v12.css').read_text()
for asset in re.findall(r"url\(['\"]?(/[^)'\"]+)", css):
    check((ROOT / asset.lstrip('/')).is_file(), 'Missing CSS asset: ' + asset)
if errors:
    raise SystemExit('\n'.join(['SEO validation FAILED:'] + errors))
print(f'PASS: {len(pages)} HTML pages, {len(canonicals)} canonical sitemap URLs, metadata, JSON-LD, images and internal links.')

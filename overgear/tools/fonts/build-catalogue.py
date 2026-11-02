#!/usr/bin/env python3
"""
Builds overgear/fonts/catalogue/: the sans-serif fonts of the catalogue https://uncut.wtf/ that are published under the SIL Open Font License and can be downloaded by a script.
Every font is fetched from the place its author publishes it (below), cut down to Latin, Latin Extended and Cyrillic and saved as WOFF2, with its license next to it.

  pip install fonttools brotli
  python3 overgear/tools/fonts/build-catalogue.py            # needs the network; rewrites overgear/fonts/catalogue/

A font is in this list only when its license is the SIL OFL, said by a license file of its repository or archive, or by the license field of the font itself. The rest of the sans-serif fonts
of the catalogue are not here: see overgear/fonts/catalogue/README.md for each of them and the reason.

Outputs: <slug>/<slug>-<weight>.woff2 and <slug>/LICENSE.txt, catalogue.css (the @font-face rules: a browser fetches a file only when the family is used), catalogue.js (the list for the
Theme page, in alphabetical order) and README.md (author, source, license, files).
"""
import io, json, os, re, shutil, subprocess, sys, tarfile, tempfile, zipfile
from urllib.parse import quote

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'fonts', 'catalogue')
UNICODES = ('U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,'
            'U+0100-02AF,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116')
RANGE = (100, 900)   # a font with one file: it answers every weight, so the browser does not make a bold of its own

def gh(repo, branch):
    return {'type': 'github', 'repo': repo, 'branch': branch, 'url': f'https://github.com/{repo}'}

# slug, name, author, source (where it is published), files [(weight or (min, max), path in the source)], license (a path in the source, 'font' for the license field of the font)
FONTS = [
    ('alfphabet', 'Alfphabet', 'Karl Bassil / OSP', {'type': 'archive', 'url': 'https://gitlab.constantvzw.org/osp/foundry.alfphabet/-/archive/master/foundry.alfphabet-master.tar.gz', 'page': 'http://osp.kitchen/foundry/alfphabet/'},
     [(RANGE, 'foundry.alfphabet-master/fonts/Alfphabet-IV.ttf')], 'foundry.alfphabet-master/LICENSE.txt'),
    ('aspekta', 'Aspekta', 'Ivo Dolenc', gh('ivodolenc/aspekta', 'main'),
     [(400, 'packages/fonts/ttf/Aspekta-400.ttf'), (500, 'packages/fonts/ttf/Aspekta-500.ttf'), (600, 'packages/fonts/ttf/Aspekta-600.ttf'), (700, 'packages/fonts/ttf/Aspekta-700.ttf')], 'LICENSE.txt'),
    ('barlaxent', 'Barlaxent', 'Jeremy Tribby', {'type': 'archive', 'url': 'http://typotheque.le75.be/site/assets/files/1034/barlaxent.zip', 'page': 'http://typotheque.le75.be/#barlaxent'},
     [(RANGE, 'barlaxent.otf')], 'font'),
    ('breite-grotesk', 'Breite Grotesk', 'Nicolas Franck Pauly', gh('metapolator/Breite', 'master'), [(RANGE, 'Output/Regular.otf')], 'readme'),
    ('cat-neuzeit', 'CAT Neuzeit', 'Peter Wiegel', {'type': 'archive', 'url': 'http://www.peter-wiegel.de/Fonts/CATNeuzeit.zip', 'page': 'http://www.peter-wiegel.de/CAT_Neuzeit.html'},
     [(RANGE, 'CATNeuzeit.ttf')], 'Open Font License.txt'),
    ('evening', 'Evening', 'Bryce Wilner', gh('brycewilner/Evening', 'master'), [(RANGE, 'Evening-Regular.otf')], 'readme'),
    ('fibel-nord', 'Fibel Nord', 'Peter Wiegel', {'type': 'archive', 'url': 'http://www.peter-wiegel.de/Fonts/FibelNordTT.zip', 'page': 'http://www.peter-wiegel.de/Fibel.html'},
     [(400, 'Fibel Nord.ttf'), (700, 'Fibel Nord Bold.ttf')], 'Open Font License.txt'),
    ('haskoy', 'Hasköy', 'Ertekin Erdin', gh('ertekinno/haskoy', 'main'),
     [(400, 'fonts/otf/Haskoy-Regular.otf'), (500, 'fonts/otf/Haskoy-Medium.otf'), (600, 'fonts/otf/Haskoy-SemiBold.otf'), (700, 'fonts/otf/Haskoy-Bold.otf')], 'OFL.txt'),
    ('helmet', 'Helmet', 'Carl Enlund', gh('carlenlund/helmet', 'master'), [(RANGE, 'Helmet-Regular.ttf')], 'LICENSE'),
    ('liga-sans', 'Liga Sans', 'Nathan Laurent', gh('NathanLaurent/Liga-Sans', 'main'), [(RANGE, 'LigaSans-Bold.otf')], 'LICENCE.txt'),
    ('lil-grotesk', 'Lil Grotesk', 'Bastien Sozeau', gh('noirblancrouge/LilGrotesk', 'master'), [((100, 900), 'fonts/variable/LilGrotesk[wght].ttf')], 'OFL.txt'),
    ('lt-institute', 'LT Institute', 'Daniel Lyons', {'type': 'archive', 'url': 'https://2d6ef404-3457-416f-9d11-f7188f68ac99.filesusr.com/archives/356ba5_6cbb8bc1fc79445190ae6b9ff9b05d69.zip?dn=LTInstitute.zip', 'page': 'https://lyonstype4.wixsite.com/lyonstype-beta/fonts'},
     [(RANGE, 'LTInstitute-1.otf')], 'font'),
    ('lunchtype', 'Lunchtype', 'Stefan Wetterstrand', {'type': 'archive', 'url': 'https://uncut.wtf/downloads/lunchtype.zip', 'page': 'https://uncut.wtf/'},
     [(300, 'Lunchtype22-Light.ttf'), (400, 'Lunchtype22-Regular.ttf'), (500, 'Lunchtype22-Medium.ttf')], 'SIL Open Font License.txt'),
    ('manifont-grotesk', 'Manifont Grotesk', 'Alexandre Liziard', gh('Interstices-/Manifont-Grotesk', 'master'),
     [(400, 'fontes/TTF/ManifontGroteskBook.ttf'), (700, 'fontes/TTF/ManifontGroteskBold.ttf')], 'LICENSE.txt'),
    ('micro-grotesk', 'Micro Grotesk', 'Eli Heuer', gh('eliheuer/micro-grotesk', 'main'), [((100, 900), 'fonts/MicroGrotesk[wght].ttf')], 'OFL.txt'),
    ('miedinger', 'Miedinger', 'Owen Earl', gh('indestructible-type/Miedinger', 'master'),
     [(400, 'Finished/Book/Miedinger*-Book.otf'), (700, 'Finished/Bold/Miedinger*-Bold.otf')], 'LICENSE.md'),
    ('milkman', 'Milkman', 'Giulia Boggio', {'type': 'archive', 'url': 'https://uncut.wtf/downloads/milkman.ttf.zip', 'page': 'https://uncut.wtf/'}, [(RANGE, 'milkman.ttf')], 'font'),
    ('opening-hours-sans', 'Opening Hours Sans', 'Opening Hours Studio', gh('opening-hours-studio/opening-hours-sans', 'main'), [(RANGE, 'fonts/OpeningHoursSans-Regular.otf')], 'LICENSE.md'),
    ('optician-sans', 'Optician Sans', 'Simen Schikulski', gh('anewtypeofinterference/Optician-Sans', 'master'), [(RANGE, 'OpenType-TT/Optician-Sans.ttf')], 'LICENSE.md'),
    ('overused-grotesk', 'Overused Grotesk', 'RandomMaerks', gh('RandomMaerks/Overused-Grotesk', 'main'), [((200, 900), 'fonts/variable/OverusedGrotesk-VF.ttf')], 'LICENSE.txt'),
    ('panamera', 'Panamera', 'Bastien Sozeau', gh('noirblancrouge/Panamera', 'master'), [((100, 900), 'fonts/variable/Panamera[wght].ttf')], 'OFL.txt'),
    ('prodigy-sans', 'Prodigy Sans', 'Wei Huang', gh('weiweihuanghuang/Prodigy-Sans', 'master'),
     [(400, 'fonts/desktop/ProdigySans-Regular.otf'), (500, 'fonts/desktop/ProdigySans-Medium.otf'), (600, 'fonts/desktop/ProdigySans-SemiBold.otf'), (700, 'fonts/desktop/ProdigySans-Bold.otf')], 'OFL.txt'),
    ('rag', 'Rag', 'Dennis Grauel', gh('dennisgrauel/Rag', 'main'), [(400, 'fonts/otf/Rag-Regular.otf'), (700, 'fonts/otf/Rag-Bold.otf')], 'OFL.txt'),
    ('solitus', 'Solitus', 'J Hudson', gh('jhudson100/Solitus-font', 'master'), [(RANGE, 'Solitus.ttf')], 'OFL.txt'),
    ('standard', 'Standard', 'Bryce Wilner', gh('brycewilner/Standard', 'master'), [(400, 'standard-book.otf'), (700, 'standard-bold.otf')], 'font'),
    ('tanklager', 'Tanklager', 'Ariel Martín Pérez', {'type': 'archive', 'url': 'https://codeberg.org/ArielMartinPerez/Tanklager/archive/main.zip', 'page': 'https://www.tunera.xyz/fonts/tanklager/'},
     [(RANGE, 'tanklager/fonts/TTF/Tanklager-Original.ttf')], 'tanklager/LICENSE.txt'),
    ('violet-sans', 'Violet Sans', 'Violet Office', gh('violetoffice/violet_sans', 'master'), [(RANGE, 'fonts/TTF/VioletSans-Regular.ttf')], 'OFL.txt'),
]

def curl(url, dest=None):
    cmd = ['curl', '-sS', '-m', '120', '-L', '-A', 'Mozilla/5.0', '--fail']
    if dest: cmd += ['-o', dest]
    r = subprocess.run(cmd + [url], capture_output=True)
    if r.returncode: raise RuntimeError(f'{url}: {r.stderr.decode()[:200]}')
    return r.stdout

archives = {}
def archive_file(url, path):
    if url not in archives:
        data = curl(url)
        files = {}
        if url.endswith('.tar.gz'):
            with tarfile.open(fileobj=io.BytesIO(data)) as t:
                for m in t.getmembers():
                    if m.isfile(): files[m.name] = t.extractfile(m).read()
        else:
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                for n in z.namelist():
                    if not n.endswith('/') and '__MACOSX' not in n: files[n] = z.read(n)
        archives[url] = files
    return archives[url][path]

def fetch(src, path):
    if src['type'] == 'archive': return archive_file(src['url'], path)
    return curl(f"https://raw.githubusercontent.com/{src['repo']}/{src['branch']}/{quote(path, safe='/')}")

OFL_MARK = '-----------------------------------------------------------\nSIL OPEN FONT LICENSE Version 1.1'
_ofl = {}
def ofl_body():
    """The text of the SIL OFL 1.1 itself, from a license file that carries it (the one of Violet Sans): for the fonts that say "OFL" in the font or in the readme and have no file."""
    if 'text' not in _ofl:
        t = curl('https://raw.githubusercontent.com/violetoffice/violet_sans/master/OFL.txt').decode('utf-8', 'replace').replace('\r\n', '\n')
        i = t.index(OFL_MARK)
        _ofl['text'] = t[i:]
    return _ofl['text']

def name_of(path, i):
    from fontTools.ttLib import TTFont
    n = TTFont(path, lazy=True)['name'].getName(i, 3, 1, 0x409) or TTFont(path, lazy=True)['name'].getName(i, 1, 0, 0)
    return n.toUnicode().strip() if n else ''

def license_text(src, how, first_font):
    if how in ('font', 'readme'):
        notice = name_of(first_font, 0) or name_of(first_font, 13)
        said = name_of(first_font, 13) if how == 'font' else 'the readme of the repository says the font is under the SIL Open Font License (' + src['url'] + ')'
        head = f'Copyright notice of the font: {notice}\n\nHow the font states its license: {said}\n\nThe text of the license, SIL Open Font License 1.1:\n\n'
        return head + ofl_body()
    return fetch(src, how).decode('utf-8', 'replace').replace('\r\n', '\n')

def subset(raw, dest, ext):
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f: f.write(raw); tmp = f.name
    subprocess.run(['pyftsubset', tmp, f'--unicodes={UNICODES}', '--layout-features=*', '--flavor=woff2', '--no-hinting', '--name-IDs=*', '--notdef-outline', f'--output-file={dest}'], check=True)
    os.unlink(tmp)

def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    rows, css = [], ['/* The sans-serif fonts of the catalogue uncut.wtf under the SIL Open Font License, cut to Latin, Latin Extended and Cyrillic (generated by tools/fonts/build-catalogue.py).\n   The browser fetches a file only when its family is used. A font with one file answers every weight: it is not made bold by the browser. */']
    for slug, name, author, src, files, lic in sorted(FONTS, key=lambda f: f[1].lower()):
        os.makedirs(os.path.join(OUT, slug))
        out_files, first = [], None
        for weight, path in files:
            raw = fetch(src, path)
            if first is None:   # the first file is kept in a temporary place, to read the license field of the font from it
                first = tempfile.NamedTemporaryFile(suffix=os.path.splitext(path)[1], delete=False); first.write(raw); first.close()
            w = f'{weight[0]} {weight[1]}' if isinstance(weight, tuple) else str(weight)
            fname = f"{slug}-{w.replace(' ', '-')}.woff2"
            subset(raw, os.path.join(OUT, slug, fname), os.path.splitext(path)[1])
            css.append(f'@font-face {{ font-family: "{name}"; font-weight: {w}; font-style: normal; font-display: swap; src: url("{slug}/{fname}") format("woff2"); }}')
            out_files.append((w, fname, os.path.getsize(os.path.join(OUT, slug, fname))))
        open(os.path.join(OUT, slug, 'LICENSE.txt'), 'w').write(license_text(src, lic, first.name))
        os.unlink(first.name)
        rows.append((slug, name, author, src.get('page') or src['url'], out_files))
        print(f'{name:22} {sum(s for _, _, s in out_files) // 1024:4d} KB  {len(out_files)} file(s)')
    open(os.path.join(OUT, 'catalogue.css'), 'w').write('\n'.join(css) + '\n')
    open(os.path.join(OUT, 'catalogue.js'), 'w').write('// The sans-serif fonts of the catalogue uncut.wtf in this directory, in alphabetical order: [key, name] (generated by tools/fonts/build-catalogue.py)\nexport const CATALOGUE_FONTS = '
        + json.dumps([[r[0], r[1]] for r in rows], ensure_ascii=False, indent=2).replace('[\n    "', '["').replace('",\n    "', '", "').replace('"\n  ]', '"]') + ';\n')
    lines = ['# The fonts of the catalogue uncut.wtf', '', 'Generated by `overgear/tools/fonts/build-catalogue.py`. Each font is the sans-serif font of the catalogue [uncut.wtf](https://uncut.wtf/) that is published under the SIL Open Font License 1.1 and can be fetched by a script; the license of each is in its directory. Files are cut to Latin, Latin Extended and Cyrillic, as WOFF2.', '',
             '| Font | Author | Source | Files |', '| --- | --- | --- | --- |']
    for slug, name, author, page, files in rows:
        lines.append(f"| {name} | {author} | {page} | {', '.join(f'{w}: {s // 1024} KB' for w, _, s in files)} |")
    open(os.path.join(OUT, 'README.md'), 'w').write('\n'.join(lines) + '\n')
    print('total', sum(s for r in rows for _, _, s in r[4]) // 1024, 'KB')

if __name__ == '__main__':
    main()

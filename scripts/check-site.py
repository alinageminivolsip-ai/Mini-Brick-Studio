#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,sys,hashlib,subprocess
R=Path(__file__).resolve().parent.parent;M=R/'miglik'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.h=[];self.titles=0;self.canonical=0
 def handle_starttag(self,t,a):
  d=dict(a)
  if t in ['h1','h2','h3']:self.h.append(int(t[1]))
  if t=='title':self.titles+=1
  if t=='link' and d.get('rel')=='canonical':self.canonical+=1
  for key in ['src','href','poster']:
   if d.get(key):self.refs.append(d[key])
errors=[];routes=json.loads((M/'site/routes.json').read_text())['pages'];paths=[M/'index.html']+[M/p['path']/'index.html' for p in routes]
for f in paths:
 p=Page();p.feed(f.read_text())
 if p.h.count(1)!=1:errors.append(f'{f}: H1 count {p.h.count(1)}')
 if p.titles!=1 or p.canonical!=1:errors.append(f'{f}: metadata')
 for before,after in zip(p.h,p.h[1:]):
  if after>before+1:errors.append(f'{f}: heading {before}->{after}')
 for u in p.refs:
  v=urlsplit(u)
  if v.scheme or v.netloc or not v.path:continue
  target=(R/unquote(v.path).removeprefix('/Mini-Brick-Studio/')) if v.path.startswith('/Mini-Brick-Studio/') else (f.parent/unquote(v.path))
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{f.relative_to(R)}: missing {u}')
# Guard protected constructor against baseline.
changed=subprocess.check_output(['git','diff','--name-only','fd5b185','--','studio/','assets/'],cwd=R,text=True).strip()
integration = {'studio/boot.js', 'studio/index.html', 'studio/sw.js', 'studio/collage-import.js', 'studio/engine.js', 'studio/simple.js', 'studio/simple.css', 'studio/guided.js', 'studio/immersive.js', 'studio/immersive.css', 'studio/loader.js'}
unexpected = [path for path in changed.splitlines() if path not in integration]
if unexpected:errors.append('Protected files changed: ' + ', '.join(unexpected))
print(json.dumps({'pages':len(paths),'errors':errors,'protected_constructor_files_unchanged':not unexpected},ensure_ascii=False,indent=2))
sys.exit(bool(errors))

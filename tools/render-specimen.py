"""Render the supplied prose specimen from the packaged font's vector outlines."""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
root=Path(__file__).resolve().parents[1]
info=json.loads((root/'font.json').read_text());title=info['title'];file=root/'fonts'/info['format']/info['filename'];out='specimen.svg'
font=TTFont(file);cmap=font.getBestCmap();glyphs=font.getGlyphSet();units=font['head'].unitsPerEm
text=(root/'docs/specimen.txt').read_text().strip()
def advance(c):return font['hmtx'][cmap.get(ord(c),'.notdef')][0]
def width(text,size):return sum(advance(c) for c in text)*size/units
size=50;lines=[];line=''
for word in text.split():
 candidate=(line+' '+word).strip()
 if line and width(candidate,size)>1120:lines.append(line);line=word
 else:line=candidate
if line:lines.append(line)
leading=76;bodyY=310;height=max(800,bodyY+len(lines)*leading+116)
paths=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="{height}" viewBox="0 0 1280 {height}" role="img" aria-label="{title} prose specimen"><rect width="1280" height="{height}" rx="20" fill="#17131e"/><path d="M64 220H1216" stroke="#67543c" stroke-width="2"/>']
def draw(text,x,y,size,color):
 scale=min(size/units,1120/max(1,sum(advance(c) for c in text)));cursor=0
 for c in text:
  if c.isspace():cursor+=advance(c);continue
  name=cmap.get(ord(c),'.notdef');pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
  paths.append(f'<path fill="{color}" d="{pen.getCommands()}" transform="translate({x+cursor*scale:.3f} {y}) scale({scale} {-scale})"/>');cursor+=advance(c)
draw(title,64,166,112,'#ffdd8d')
for i,line in enumerate(lines):draw(line,70,bodyY+i*leading,size,'#fff1d2')
draw('Cormac McCarthy, Blood Meridian',70,bodyY+len(lines)*leading+38,26,'#c6b4cd')
paths.append('</svg>');(root/'docs'/out).write_text('\n'.join(paths))
print(title,len(lines),'lines,',height,'px high.')

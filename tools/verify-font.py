"""Validate format parity, coverage, metrics, and preservation of game contours."""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
ROOT=Path(__file__).resolve().parents[1];name='YaksBadFurDay-Regular'
a=TTFont(ROOT/'fonts/ttf'/f'{name}.ttf');b=TTFont(ROOT/'fonts/woff2'/f'{name}.woff2')
cmap=a.getBestCmap();assert cmap==b.getBestCmap();assert a['hmtx'].metrics==b['hmtx'].metrics
assert all(i in cmap for i in range(32,127))
for char in 'abcdefghijklmnopqrstuvwxyz':assert cmap[ord(char)]==cmap[ord(char.upper())]
for name in a.getGlyphOrder():
 pa=RecordingPen();pb=RecordingPen();a.getGlyphSet()[name].draw(pa);b.getGlyphSet()[name].draw(pb);assert pa.value==pb.value,name
 g=a['glyf'][name]
 if g.numberOfContours:
  g.recalcBounds(a['glyf']);assert g.yMin>=-a['OS/2'].usWinDescent and g.yMax<=a['OS/2'].usWinAscent,name
  assert g.xMin>=0 and g.xMax<=a['hmtx'][name][0],name
for char,shape in json.loads((ROOT/'sources/game-glyphs.json').read_text()).items():
 contours=[shape['p']]+shape.get('extra',[])+shape.get('holes',[])
 xmin=min(x for points in contours for x,y in points)
 expected=sorted((round((x-xmin)*700+70),round(y*700)) for points in contours for x,y in points)
 actual=sorted(tuple(pt) for pt in a['glyf'][cmap[ord(char)]].coordinates)
 assert actual==expected, f'Original contour changed: {char}'
assert a['name'].getDebugName(1)=="Yak's Bad Fur Day"
assert a['name'].getDebugName(6)=='YaksBadFurDay-Regular'
assert a['OS/2'].fsType==0
assert len(a['GPOS'].table.LookupList.Lookup)==1
print(f'PASS: {len(cmap)} mappings, {len(a.getGlyphOrder())} glyphs, ASCII coverage, lowercase aliases, bounds, names, kerning, 43 original contours, and TTF/WOFF2 parity.')

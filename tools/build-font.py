"""Build 40 Yaks from the game's authored polygon silhouettes."""
from pathlib import Path
import json, math
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
ROOT=Path(__file__).resolve().parents[1]
FAMILY="40 Yaks"; NAME='FortyYaks-Regular'
shapes=json.loads((ROOT/'sources/game-glyphs.json').read_text())
original=set(shapes)
def polygon(w,p,holes=None,extra=None):return dict(w=w,p=p,holes=holes or [],extra=extra or [])
def stroke(a,b,width=.15):
 x,y=a;u,v=b;length=math.hypot(u-x,v-y);dx=-(v-y)/length*width/2;dy=(u-x)/length*width/2
 return [[x+dx,y+dy],[u+dx,v+dy],[u-dx,v-dy],[x-dx,y-dy]]
def strokes(w,segments,width=.15):
 parts=[stroke(a,b,width) for a,b in segments];return polygon(w,parts[0],extra=parts[1:])
dot=[[.02,.22],[.25,.25],[.28,0],[0,-.02]]
shapes['.']=polygon(.28,dot)
shapes[':']=polygon(.28,dot,extra=[[[x,y+.55] for x,y in dot]])
shapes[';']=polygon(.28,shapes[',']['p'],extra=[[[x,y+.55] for x,y in dot]])
shapes['"']=polygon(.60,shapes["'"]['p'],extra=[[[x+.34,y] for x,y in shapes["'"]['p']]])
shapes['/']=strokes(.64,[((0,-.1),(.65,1.10))],.20)
shapes['\\']=strokes(.64,[((.65,-.1),(0,1.10))],.20)
shapes['_']=polygon(.88,[[0,-.12],[.92,-.08],[.90,-.26],[0,-.29]])
shapes['=']=polygon(.80,[[0,.75],[.84,.78],[.81,.59],[.01,.56]],extra=[[[0,.38],[.82,.40],[.79,.21],[.01,.19]]])
shapes['<']=strokes(.64,[((.62,.94),(.04,.50)),((.04,.50),(.62,.08))],.18)
shapes['>']=strokes(.64,[((.02,.94),(.60,.50)),((.60,.50),(.02,.08))],.18)
shapes['^']=strokes(.76,[((.02,.70),(.38,1.1)),((.38,1.1),(.76,.72))],.17)
shapes['`']=polygon(.30,[[0,1.20],[.20,1.24],[.37,.96],[.21,.91]])
shapes['~']=polygon(.95,[[0,.52],[.12,.73],[.33,.80],[.59,.66],[.74,.66],[.87,.82],[1,.69],[.87,.47],[.64,.43],[.34,.59],[.22,.57],[.12,.42]])
shapes['?']=polygon(.85,[[0,.89],[.23,1.1],[.60,1.12],[.83,.95],[.87,.72],[.70,.52],[.51,.42],[.48,.28],[.23,.30],[.24,.57],[.54,.77],[.51,.86],[.35,.84],[.20,.66]],extra=[[[.22,.17],[.49,.20],[.53,-.05],[.22,-.07]]])
shapes['(']=polygon(.47,[[.42,1.19],[.24,1.22],[.02,.88],[-.03,.45],[.04,.05],[.27,-.23],[.48,-.18],[.30,.12],[.22,.49],[.28,.87]])
shapes[')']=polygon(.47,[[.47-x,y] for x,y in shapes['(']['p']])
shapes['[']=polygon(.48,[[.03,1.18],[.51,1.21],[.49,.98],[.26,.97],[.22,.01],[.49,.03],[.48,-.20],[0,-.23]])
shapes[']']=polygon(.48,[[.48-x,y] for x,y in shapes['[']['p']])
shapes['{']=polygon(.58,[[.55,1.18],[.29,1.21],[.10,1.06],[.10,.73],[-.05,.54],[.10,.36],[.09,.03],[.29,-.18],[.57,-.17],[.57,.05],[.34,.05],[.32,.38],[.20,.54],[.34,.70],[.34,.99],[.57,.97]])
shapes['}']=polygon(.58,[[.58-x,y] for x,y in shapes['{']['p']])
shapes['#']=strokes(.96,[((.30,0),(.46,1.07)),((.65,0),(.81,1.07)),((0,.35),(.96,.39)),((.04,.70),(1,.75))],.16)
shapes['*']=strokes(.83,[((.40,.27),(.45,1.10)),((.08,.43),(.80,.97)),((.06,.92),(.79,.42))],.17)
shapes['%']=polygon(1.04,stroke((.12,-.03),(.94,1.09),.16),extra=[[[0,.82],[.03,1.02],[.20,1.11],[.38,1.02],[.43,.82],[.31,.66],[.12,.65]],[[.60,.20],[.65,.40],[.81,.47],[1,.38],[1.04,.18],[.94,0],[.75,-.02]]],holes=[[[.14,.84],[.19,.95],[.29,.87],[.24,.79]],[[.74,.20],[.80,.31],[.90,.22],[.85,.13]]])
shapes['&']=polygon(1.10,[[.13,.02],[-.01,.24],[.03,.45],[.26,.61],[.12,.84],[.24,1.06],[.48,1.12],[.72,.97],[.74,.75],[.56,.57],[.75,.37],[.86,.60],[1.10,.52],[.94,.19],[1.13,.02],[.86,-.12],[.73,.02],[.49,-.09],[.28,-.08]],holes=[[[.28,.28],[.41,.19],[.55,.26],[.34,.44]],[[.36,.85],[.45,.75],[.53,.85],[.44,.94]]])
shapes['@']=polygon(1.27,[[.18,.01],[-.02,.34],[.02,.79],[.31,1.09],[.75,1.16],[1.09,.99],[1.25,.70],[1.23,.34],[1.07,.17],[.83,.20],[.70,.08],[.49,.10],[.32,.28],[.34,.67],[.50,.85],[.72,.83],[.77,.72],[.83,.83],[1,.79],[.93,.40],[1.04,.39],[1.07,.62],[.94,.86],[.69,.96],[.39,.89],[.21,.65],[.18,.36],[.32,.16],[.62,.06],[.81,.09],[.88,-.10],[.60,-.17]],holes=[[[.50,.36],[.61,.29],[.72,.48],[.72,.61],[.61,.64],[.52,.54]]])
shapes['$']=polygon(.94,shapes['S']['p'],extra=[stroke((.45,-.22),(.57,1.25),.12)])
shapes[' ']=dict(w=.45,p=[])
# Typography aliases intentionally retain capitals; no lowercase outlines are implied.
alias={chr(c):chr(c).upper() for c in range(97,123)}
alias.update({'\u00a0':' ','‘':"'",'’':"'",'“':'"','”':'"','‐':'-','‑':'-','−':'-','•':'·'})
shapes['–']=polygon(1.05,[[x*1.36,y] for x,y in shapes['-']['p']])
shapes['—']=polygon(1.60,[[x*2.05,y] for x,y in shapes['-']['p']])
shapes['…']=polygon(1.06,dot,extra=[[[x+shift,y] for x,y in dot] for shift in [.40,.80]])
shapes['×']=strokes(.8,[((.04,.13),(.78,.89)),((.04,.89),(.78,.13))],.20)
shapes['÷']=polygon(.82,shapes['-']['p'],extra=[[[x+.26,y+.83] for x,y in dot],[[x+.26,y-.11] for x,y in dot]])
shapes['.notdef']=polygon(.8,[[0,0],[.8,0],[.8,1],[0,1]],holes=[[[.15,.15],[.65,.15],[.65,.85],[.15,.85]]])
SCALE=700; glyphs={}; metrics={}; cmap={}
def area(points):return sum(x*v-u*y for (x,y),(u,v) in zip(points,points[1:]+points[:1]))/2
for c,g in shapes.items():
 name='.notdef' if c=='.notdef' else f'uni{ord(c):04X}'
 contours=[(g['p'],False)]+[(p,False) for p in g.get('extra',[])]+[(p,True) for p in g.get('holes',[])]
 allpoints=[pt for p,_ in contours for pt in p];xmin=min((x for x,y in allpoints),default=0);xmax=max((x for x,y in allpoints),default=g['w'])
 pen=TTGlyphPen(None)
 for points,hole in contours:
  if not points:continue
  if (area(points)>0)!=hole:points=list(reversed(points))
  coords=[(round((x-xmin)*SCALE+70),round(y*SCALE)) for x,y in points]
  pen.moveTo(coords[0])
  for point in coords[1:]:pen.lineTo(point)
  pen.closePath()
 glyphs[name]=pen.glyph();metrics[name]=(round(max(g['w'],xmax-xmin)*SCALE+140),70 if allpoints else 0)
 if c!='.notdef':cmap[ord(c)]=name
for c,target in alias.items():cmap[ord(c)]=cmap[ord(target)]
order=['.notdef']+[n for n in glyphs if n!='.notdef']
fb=FontBuilder(1000,isTTF=True);fb.setupGlyphOrder(order);fb.setupCharacterMap(cmap);fb.setupGlyf(glyphs);fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=1000,descent=-240,lineGap=0)
fb.setupNameTable({'familyName':FAMILY,'styleName':'Regular','uniqueFontIdentifier':NAME+'-1.001','fullName':FAMILY+' Regular','psName':NAME,'version':'Version 1.001','copyright':'Copyright 2026 Andrew White.','description':'Chunky polygon display lettering from Lil Miner’s Ruin. Capitals-only; lowercase input maps to uppercase outlines.','licenseDescription':'SIL Open Font License, Version 1.1.','licenseInfoURL':'https://openfontlicense.org/'})
fb.setupOS2(sTypoAscender=1000,sTypoDescender=-240,sTypoLineGap=0,usWinAscent=1000,usWinDescent=240,usWeightClass=900,sCapHeight=770,sxHeight=770,fsType=0,fsSelection=0x40)
fb.setupPost();fb.setupMaxp();font=fb.font
pairs={'AV':-45,'AW':-30,'AY':-40,'AT':-20,'FA':-25,'LT':-35,'LV':-35,'LY':-40,'PA':-25,'TA':-35,'TO':-15,'TV':-15,'VA':-45,'VO':-20,'WA':-30,'YA':-40,'YO':-25}
# Alias mappings share the same glyphs, so capitals and lowercase receive identical kerning.
fea='feature kern {\n'+'\n'.join(f'pos {cmap[ord(pair[0])]} {cmap[ord(pair[1])]} {amount};' for pair,amount in pairs.items())+'\n} kern;'
addOpenTypeFeaturesFromString(font,fea)
font['head'].created=font['head'].modified=3872448000;font.recalcTimestamp=False
for folder in ['ttf','woff2']:(ROOT/'fonts'/folder).mkdir(parents=True,exist_ok=True)
font.save(ROOT/'fonts/ttf'/f'{NAME}.ttf');font.flavor='woff2';font.save(ROOT/'fonts/woff2'/f'{NAME}.woff2')
(ROOT/'fonts/characters.json').write_text(json.dumps({'family':FAMILY,'version':'1.001','mappedCodePoints':len(cmap),'outlines':len(glyphs),'characters':''.join(chr(i) for i in sorted(cmap)),'lowercase':'Mapped to uppercase outlines','kerningPairs':pairs},indent=2)+'\n')
(ROOT/'sources/punctuation.json').write_text(json.dumps({c:g for c,g in shapes.items() if c not in original and c!='.notdef'},indent=2)+'\n')
print(f'Built {FAMILY}: {len(glyphs)} glyphs, {len(cmap)} code points, {len(pairs)} kern pairs.')

# HermiBorð — Smíðaleiðbeiningar

> Skref-fyrir-skref leiðbeiningar til að smíða HermiBorð hermibúnaðinn fyrir PLC kennslu.

🌐 **[Sjá síðuna í notkun →](https://hermiboard.netlify.app)**

## Um verkefnið

HermiBorðið er hermibúnaður sem tengist PLC í gegnum IDC snúru. Nemendur í Rafdeild VMA lóða alla íhluti sjálfir á prentplötu, prófa borðið í prófara, og klára frágang í FabLab.

Þessi vefsíða leiðbeinir nemendum í gegnum allt ferlið — frá undirbúningi til lokaskrefanna.

### Eiginleikar

- **7 skref** — eitt skref sýnilegt í einu, ekkert scroll
- **Ljóst / dökkt þema** — vistast á milli heimsókna
- **Aðgengi** — Atkinson Hyperlegible leturgerð, WCAG AA, lyklaborðsvænt
- **Stækka/minnka texta** — 14px til 22px
- **Gáttarlistar og prófunargrid** — nemendur merkja framvindu
- **Myndir af íhlutum** — 📷 takki opnar mynd í modal
- **FabLab niðurhal** — SVG/PDF skurðarteikning + STL fótamódel
- **Fjöltyngd** — Íslenska og enska, auðvelt að bæta við tungumálum
- **Prentavænt** — öll skref birtast á blaði

## Skráarskipan

```
index.html          ← Aðalskráin
i18n.js             ← Tungumálakerfi
lang/
  is.json           ← Íslenska
  en.json           ← Enska
img/
  foa-logo.png      ← FÓA merki
  logo40.png        ← VMA 40 ára merki
  *.svg             ← Íhlutamyndir (placeholder)
fablab/
  undirplata-template.svg   ← Laserskurður (Inkscape/Lightburn)
  undirplata-template.pdf   ← Forskrift á A4
  fotur-placeholder.stl     ← 3D fótur (PrusaSlicer/Bambu)
  README.md
```

## Nýtt tungumál

1. Afritaðu `lang/is.json` sem `lang/XX.json`
2. Þýddu öll gildi — **breyttu ekki lyklum**
3. Bættu tungumálinu við `LANGUAGES` listann í `i18n.js`

## Þróun

Engin build-skref — bara statískar HTML/JS/JSON skrár. Opnaðu `index.html` í vafra eða notaðu:

```bash
npx serve .
```

## Deploy

Síðan er hýst á [Netlify](https://netlify.com) beint frá GitHub. Push á `main` branch deployar sjálfkrafa.

## Höfundar

Samstarfsverkefni **Friðriks Óla Árnasonar** (kennari, Rafdeild VMA) og **Claude AI** (Anthropic).

Rafdeild VMA — Verkmenntaskólinn á Akureyri, Ísland.

---

*Þetta verkefni er hluti af [Rökrásir og Iðnsmíði](https://github.com/) opnu námsgagnaverkefni.*

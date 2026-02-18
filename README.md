# HermiBorð — VMA Rafdeild

Step-by-step smíðaleiðbeiningar með 3D skoðara og framgangsvistunar.

## Keyra staðbundið

```bash
npm install
npm start
# Opnaðu http://localhost:3000
```

Þróunarham (sjálfvirk endurræsing):
```bash
npm run dev
```

---

## Setja upp á Render.com

### 1. GitHub repo
Sett upp á GitHub fyrst:
```bash
git init
git add .
git commit -m "HermiBorð v1"
git remote add origin https://github.com/NOTANDANAFN/hermiboro.git
git push -u origin main
```

### 2. Render uppsetning
1. Farðu á [render.com](https://render.com) og skráðu þig inn
2. **New → Web Service**
3. Tengdu GitHub repoið
4. Stilltu:
   - **Name:** `hermiboro`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (nóg fyrir skólanotkun)

### 3. Gögn á Render
Framgangsgögn eru vistuð í `progress-data.json` á serverinum.

> ⚠️ **Athugasemd:** Render's Free plan hreinsar skrár við endurræsingu.  
> Til að geyma gögn varanlega, notaðu **Render Persistent Disk** (frjáls í hobby plan):
> - Dashboard → þjónustan þín → **Disks** → Add Disk
> - Mount Path: `/var/data`
> - Breyttu `DATA_FILE` í `server.js` í: `/var/data/progress-data.json`

---

## Uppbygging verkefnis

```
hermiboro/
├── server.js          # Express server + API
├── package.json       # Dependencies
├── progress-data.json # Gögn (búin til sjálfkrafa)
└── public/
    └── index.html     # Allt frontend (HTML + CSS + JS + Three.js)
```

## API endpoints

| Method | Slóð | Lýsing |
|--------|------|--------|
| `GET`  | `/api/progress/:userId` | Sækja framgang |
| `POST` | `/api/progress/:userId` | Vista framgang |
| `DELETE` | `/api/progress/:userId` | Hreinsa framgang |
| `GET`  | `/health` | Health check |

## Síðar — bæta við GLB módeli

Þegar þú færð `.glb` skrána:

1. Settu hana í `public/models/hermiboro.glb`
2. Í `index.html`, skiptu `buildPCB()` út fyrir:

```javascript
const loader = new THREE.GLTFLoader();
loader.load('/models/hermiboro.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

Þú þarft að bæta við GLTFLoader:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
```

---

## Tæknileg gögn

- **Frontend:** Vanilla HTML/CSS/JS + Three.js r128
- **Backend:** Node.js + Express
- **Geymsla:** JSON skrá (eða Render Persistent Disk)
- **Aðgengi:** WCAG 2.1 AA
- **3D skoðari:** Snúa (drag), þysja (scroll/pinch), færa (right-drag), lyklaborð (←→↑↓ +-)

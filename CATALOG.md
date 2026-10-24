# Il catalogo Progetti TWIICE

Integrazione preparata sul branch **`work/twiice-updates`**, a partire da `0f9b57c23f4173d77b340828c7c219ef74ac9a86`.

La pagina `dist/progetti.html`, già collegata dalla home, ospita il catalogo con slider, categorie animate, caroselli, ricerca e lista personale. Il layout riprende il catalogo di Raffaele; palette, caratteri, logo, stella e cambio giorno/notte appartengono a TWIICE.

## Contenuti

- I quattro progetti esistenti — Astrocane, Engineering 2K, CoReVe e TWIICE — continuano a essere letti da `dist/projects-data.js`. Le loro schede, immagini, video e contenuti non sono stati modificati.
- Le nove repository di Raffaele sono in `dist/repositories-data.js`. Un clic sulla locandina apre la repository su GitHub in una nuova scheda.
- Un clic sui progetti di Nicole/TWIICE apre la corrispondente scheda `progetto.html?id=…` nella stessa scheda del browser.
- Il pulsante **i** mostra una scheda informativa. Il pulsante **+** salva qualunque progetto in **La mia lista**, usando `localStorage`. Il tema usa la stessa chiave `twiice-night` in `sessionStorage` già utilizzata dal resto del sito.

Categorie, raccolte e scelta degli elementi in evidenza si modificano in `dist/catalog.js`. I nuovi stili sono in `dist/catalog.css` e sono isolati dalla home e dalle schede originali con classi `tc-` e il selettore `.catalog-page`.

Le immagini illustrative delle repository sono in `dist/assets/catalog/` e provengono dal precedente catalogo di Raffaele. Sono fotografie da [Unsplash](https://unsplash.com/license): [cosmos](https://images.unsplash.com/photo-1462331940025-496dfbfc7564), [mountain](https://images.unsplash.com/photo-1519681393784-d120267933ba), [neon](https://images.unsplash.com/photo-1544885935-98dd03b09034), [forest](https://images.unsplash.com/photo-1441974231531-c6227db76b6e), [ocean](https://images.unsplash.com/photo-1518837695005-2083093ee35b), [camera](https://images.unsplash.com/photo-1516035069371-29a1b244cc32), [desert](https://images.unsplash.com/photo-1509316785289-025f5b846b35), [earth](https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4), [aurora](https://images.unsplash.com/photo-1531366936337-7c912a4589a7). Il logo Raffaele+ e gli asset Disney non sono inclusi.

## Anteprima del branch

Dal checkout di questo branch:

```sh
python -m http.server 4180 --directory dist
```

Apri `http://localhost:4180/progetti.html`. Il percorso home → Progetti usa già questa pagina.

Il workflow GitHub Pages originale pubblica esclusivamente `main`: è rimasto invariato. Un push su `work/twiice-updates` **non pubblica sulla pagina di produzione**. Per portare online l’integrazione sul sito originale servirà una successiva revisione e integrazione in `main`.

## Verifiche

Controllati nel browser: 13 elementi nel catalogo, filtri per categoria/autore, ricerca, preferiti misti e loro persistenza, schede informative, navigazione dalla home e verso le schede originali, continuità del tema giorno/notte tra pagine e layout mobile a 390 e 320 px. Verificati inoltre sintassi JavaScript, riferimenti locali alle immagini e assenza di modifiche ai file condivisi originali.

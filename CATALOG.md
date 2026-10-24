# Il catalogo Progetti TWIICE

Integrazione preparata sul branch **`work/twiice-updates`**, a partire da `0f9b57c23f4173d77b340828c7c219ef74ac9a86`.

La pagina `dist/progetti.html`, già collegata dalla home, ospita il catalogo con slider, categorie animate, caroselli, ricerca e lista personale. Il layout riprende il catalogo di Raffaele; palette, caratteri, logo, stella e cambio giorno/notte appartengono a TWIICE.

## Contenuti

- I quattro progetti esistenti — Astrocane, Engineering 2K, CoReVe e TWIICE — continuano a essere letti da `dist/projects-data.js`. Le loro schede, immagini, video e contenuti non sono stati modificati.
- Le nove repository di Raffaele sono in `dist/repositories-data.js`. Un clic sulla locandina apre la repository su GitHub in una nuova scheda.
- Un clic sui progetti di Nicole/TWIICE apre la corrispondente scheda `progetto.html?id=…` nella stessa scheda del browser.
- Il pulsante **i** mostra una scheda informativa. Il pulsante **+** salva qualunque progetto in **La mia lista**, usando `localStorage`. Il tema usa la stessa chiave `twiice-night` in `sessionStorage` già utilizzata dal resto del sito.

Categorie, raccolte e scelta degli elementi in evidenza si modificano in `dist/catalog.js`. Layout, dimensioni, breakpoint, posizione delle caption, comparsa delle frecce, zoom delle card e animazioni delle categorie in `dist/catalog.css` riprendono le regole del catalogo originale di Raffaele. Anche i gestori di slider e caroselli sono portati dal codice originale: scorrimento fluido, aggancio delle card, passo delle frecce e comandi da tastiera restano gli stessi.

La grafica TWIICE è applicata separatamente in `dist/catalog-theme.css`: palette, caratteri, superfici, bordi e marchio. Il menu torna nella barra superiore fissa, come nel catalogo originale. I pulsanti delle card compaiono sulle immagini al passaggio del mouse o al focus; le caption restano su una riga sotto le locandine. Le barre di scorrimento native sono nascoste. Gli stili sono isolati dalla home e dalle schede originali con classi `tc-` e il selettore `.catalog-page`.

Le immagini illustrative delle repository sono in `dist/assets/catalog/` e provengono dal precedente catalogo di Raffaele. Sono fotografie da [Unsplash](https://unsplash.com/license): [cosmos](https://images.unsplash.com/photo-1462331940025-496dfbfc7564), [mountain](https://images.unsplash.com/photo-1519681393784-d120267933ba), [neon](https://images.unsplash.com/photo-1544885935-98dd03b09034), [forest](https://images.unsplash.com/photo-1441974231531-c6227db76b6e), [ocean](https://images.unsplash.com/photo-1518837695005-2083093ee35b), [camera](https://images.unsplash.com/photo-1516035069371-29a1b244cc32), [desert](https://images.unsplash.com/photo-1509316785289-025f5b846b35), [earth](https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4), [aurora](https://images.unsplash.com/photo-1531366936337-7c912a4589a7). Il logo Raffaele+ e gli asset Disney non sono inclusi.

## Anteprima del branch

Dal checkout di questo branch:

```sh
python -m http.server 4180 --directory dist
```

Apri `http://localhost:4180/progetti.html`. Il percorso home → Progetti usa già questa pagina.

Il workflow GitHub Pages originale pubblica esclusivamente `main`: è rimasto invariato. Un push su `work/twiice-updates` **non pubblica sulla pagina di produzione**. Per portare online l’integrazione sul sito originale servirà una successiva revisione e integrazione in `main`.

## Verifiche

Il comportamento è confrontato con `raffaele-pet/raffaele-plus` al commit `4aff7db`: a 1010 e 390 px coincidono dimensioni di card e banner, spaziature, aggancio dello scorrimento, posizione e comparsa dei controlli, caption e tempi delle animazioni. Il passo della freccia sul primo carosello coincide (923 px nel confronto desktop), così come lo zoom 1,055 e la rivelazione dei pulsanti al focus. I gestori di slider e caroselli derivano dagli originali, con adattamento dei selettori e dei nomi delle variabili.

Controllati inoltre: 13 elementi e relativi URL/immagini, ricerca, schede informative, tema giorno/notte, sintassi JavaScript e assenza di modifiche a home, schede, dati e workflow condivisi originali. Preferiti misti, navigazione dalla home alle schede e persistenza del tema erano già verificati durante l’integrazione.

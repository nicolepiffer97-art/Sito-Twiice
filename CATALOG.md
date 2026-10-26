# Progetti TWIICE

[Apri la pagina Progetti](https://nicolepiffer97-art.github.io/Sito-Twiice/progetti.html).

La pagina `dist/progetti.html` mostra tutti i 13 progetti in una griglia responsive, senza caroselli o scorrimento laterale. I cinque pulsanti riprendono lo stile arrotondato del sito: **Tutti i progetti** è selezionato all’apertura, seguito dalle quattro categorie.

## Categorie

- **Identità e comunicazione:** Engineering 2K.
- **Immagini e movimento:** Astrocane, CoReVe, gallery-dl-windows-gui, yt-dlp-windows-gui, batch-image-resizer.
- **Esperienza e interazione:** TWIICE, before-after-slider, camera-motion-studio.
- **AI tools:** ComfyUI-RPNodes, realtime-captions-system-audio-gui, chatbot_ZURU, chatbot_semplice.

Le assegnazioni sono in `projectCategories` in `dist/catalog.js`. Ogni progetto ha una categoria; la vista iniziale li mostra tutti una volta sola. La ricerca filtra la griglia e si combina con la categoria selezionata. Il pulsante Cerca nell’header porta il focus al campo nella stessa pagina. I vecchi frammenti come `#all` e `#search` vengono rimossi dall’indirizzo e aprono la griglia unica.

## Contenuti e interazioni

I quattro lavori di Nicole/TWIICE vengono letti da `dist/projects-data.js` e aprono le schede originali `progetto.html?id=…`. Le nove repository di Raffaele sono in `dist/repositories-data.js` e aprono GitHub in una nuova scheda. Titolo, autore e ambito sono sotto l’immagine, insieme ai pulsanti per salvare e leggere le informazioni. Le immagini sono prive di etichette sovrapposte. Le schede, immagini, video e contenuti originali dei progetti restano invariati.

Il tema condivide la chiave `twiice-night` in `sessionStorage` con il resto del sito. I salvataggi usano `twiice-catalog-saved` in `localStorage`. Il layout è in `catalog.css`, palette e header in `catalog-theme.css`. Home, schede originali, stelle e movimento dell’header continuano a usare i propri file condivisi.

## Sviluppo e pubblicazione

```sh
python -m http.server 4180 --directory dist
```

Apri `http://localhost:4180/progetti.html`. Il workflow GitHub Pages pubblica `dist/` da `main`, senza compilazione o dipendenze.

Le immagini delle repository sono in `dist/assets/catalog/`, provengono dal catalogo di Raffaele e sono fotografie da [Unsplash](https://unsplash.com/license). Non sono inclusi logo Raffaele+ o asset Disney.

## Verifiche

Controllati in browser: 13 progetti iniziali, cinque pulsanti, conteggi per categoria (1/5/3/4), combinazione con la ricerca, nessun risultato e ripristino, Cerca senza cambio URL, schede informative e ritorno del focus, tema giorno/notte, titoli sotto le immagini e assenza di caroselli. Controllati anche sintassi JavaScript, riferimenti locali e impaginazione responsive senza overflow orizzontale.

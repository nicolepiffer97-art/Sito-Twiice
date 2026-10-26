# Progetti TWIICE

[Apri la pagina Progetti](https://nicolepiffer97-art.github.io/Sito-Twiice/progetti.html).

La pagina `dist/progetti.html` apre con una fascia grande a scorrimento che presenta tutti i 13 progetti, con frecce, indicatori, pausa, scorrimento automatico e comandi da tastiera. Sotto rimane la griglia responsive senza scorrimento laterale. I cinque pulsanti riprendono lo stile arrotondato del sito: **Tutti i progetti** è selezionato all’apertura, seguito dalle quattro categorie.

## Categorie

- **Identità e comunicazione:** Engineering 2K.
- **Immagini e movimento:** Astrocane, CoReVe, gallery-dl-windows-gui, yt-dlp-windows-gui, batch-image-resizer.
- **Esperienza e interazione:** TWIICE, before-after-slider, camera-motion-studio.
- **AI tools:** ComfyUI-RPNodes, realtime-captions-system-audio-gui, chatbot_ZURU, chatbot_semplice.

Le assegnazioni sono in `projectCategories` in `dist/catalog.js`. Ogni progetto ha una categoria; la vista iniziale li mostra tutti una volta sola. La ricerca filtra la griglia e si combina con la categoria selezionata. La ricerca è disponibile soltanto nel campo «Cerca un progetto…» sopra la griglia; l’header non contiene un secondo comando Cerca. I filtri e la ricerca agiscono sulla griglia e non ricostruiscono la fascia superiore. I vecchi frammenti come `#all` e `#search` vengono rimossi dall’indirizzo e aprono la griglia unica.

## Contenuti e interazioni

I quattro lavori di Nicole/TWIICE vengono letti da `dist/projects-data.js` e aprono le schede originali `progetto.html?id=…`. Le nove repository di Raffaele sono in `dist/repositories-data.js` e aprono GitHub in una nuova scheda. Il titolo è sotto l’immagine, insieme al pulsante per leggere le informazioni. In **Tutti i progetti**, il sottotitolo indica soltanto la categoria; nei filtri di categoria il sottotitolo è assente. La funzione di salvataggio nella lista e i relativi pulsanti sono stati rimossi, anche dalle schede informative. Le immagini sono prive di etichette sovrapposte. Le schede, immagini, video e contenuti originali dei progetti restano invariati.

Il tema condivide la chiave `twiice-night` in `sessionStorage` con il resto del sito. Il layout è in `catalog.css`, palette e header in `catalog-theme.css`. Home, schede originali, stelle e movimento dell’header continuano a usare i propri file condivisi.

## Sviluppo e pubblicazione

```sh
python -m http.server 4180 --directory dist
```

Apri `http://localhost:4180/progetti.html`. Il workflow GitHub Pages pubblica `dist/` da `main`, senza compilazione o dipendenze.

Le immagini delle repository sono in `dist/assets/catalog/`, provengono dal catalogo di Raffaele e sono fotografie da [Unsplash](https://unsplash.com/license). Non sono inclusi logo Raffaele+ o asset Disney.

## Verifiche

Controllati in browser: 13 progetti iniziali, cinque pulsanti, conteggi per categoria (1/5/3/4), combinazione con la ricerca, nessun risultato e ripristino, ricerca senza cambio URL, schede informative e ritorno del focus, tema giorno/notte, titoli sotto le immagini, categoria visibile solo nella vista completa, assenza dei comandi della lista e di Cerca nell’header. Verificati inoltre i 13 elementi della fascia superiore, frecce, indicatori, pausa e assenza di contenuti tagliati nei banner su mobile. Controllati anche sintassi JavaScript, riferimenti locali e impaginazione responsive senza overflow orizzontale.

# Progetti TWIICE

[Apri la pagina Progetti](https://nicolepiffer97-art.github.io/Sito-Twiice/progetti.html).

La pagina `dist/progetti.html` apre con una fascia di immagini a scorrimento. Il titolo «Progetti» e il sottotitolo rimangono fissi in un livello separato dalle immagini: non ci sono testi, descrizioni o pulsanti dei singoli progetti nella fascia. Le cinque immagini in evidenza mantengono frecce laterali, scorrimento automatico e comandi da tastiera; pallini e pulsante pausa sono rimossi. Il movimento si ferma al passaggio del mouse, al focus, quando la pagina non è visibile e con la preferenza di movimento ridotto. Sotto rimane la griglia di tutti i 14 progetti, senza scorrimento laterale. Categorie e ricerca seguono direttamente la fascia, senza un secondo titolo. I cinque pulsanti riprendono lo stile arrotondato del sito: **Tutti i progetti** è selezionato all’apertura, seguito dalle quattro categorie.

## Categorie

- **Identità e comunicazione:** Engineering 2K.
- **Immagini e movimento:** Astrocane, CoReVe, The Coffin, gallery-dl-windows-gui, yt-dlp-windows-gui, batch-image-resizer.
- **Esperienza e interazione:** TWIICE, before-after-slider, camera-motion-studio.
- **AI tools:** ComfyUI-RPNodes, realtime-captions-system-audio-gui, chatbot_ZURU, chatbot_semplice.

Le assegnazioni sono in `projectCategories` in `dist/catalog.js`. Ogni progetto ha una categoria; la vista iniziale li mostra tutti una volta sola. La ricerca filtra la griglia e si combina con la categoria selezionata. La ricerca è disponibile soltanto nel campo «Cerca un progetto…» sopra la griglia; l’header non contiene un secondo comando Cerca. I filtri e la ricerca agiscono sulla griglia e non ricostruiscono la fascia superiore. I vecchi frammenti come `#all` e `#search` vengono rimossi dall’indirizzo e aprono la griglia unica.

## Contenuti e interazioni

I quattro lavori di Nicole/TWIICE vengono letti da `dist/projects-data.js` e aprono le schede originali `progetto.html?id=…`. Le nove repository di Raffaele sono in `dist/repositories-data.js` e aprono GitHub in una nuova scheda. Il titolo è sotto l’immagine e apre direttamente il progetto. I pulsanti informativi e le relative finestre sono rimossi dalla fascia e dalla griglia. In **Tutti i progetti**, il sottotitolo indica soltanto la categoria; nei filtri di categoria il sottotitolo è assente. La funzione di salvataggio nella lista e i relativi pulsanti sono stati rimossi, da tutta la pagina. Le immagini sono prive di etichette sovrapposte. Le schede, immagini, video e contenuti originali dei progetti restano invariati.

Il tema condivide la chiave `twiice-night` in `sessionStorage` con il resto del sito. La griglia è in `catalog.css`, la fascia e il titolo fisso in `catalog-hero.css`, palette e header in `catalog-theme.css`. Home, schede originali, stelle e movimento dell’header continuano a usare i propri file condivisi.

## Sviluppo e pubblicazione

```sh
python -m http.server 4180 --directory dist
```

Apri `http://localhost:4180/progetti.html`. Il workflow GitHub Pages pubblica `dist/` da `main`, senza compilazione o dipendenze.

Le immagini delle repository sono in `dist/assets/catalog/`, provengono dal catalogo di Raffaele e sono fotografie da [Unsplash](https://unsplash.com/license). Non sono inclusi logo Raffaele+ o asset Disney.

## Verifiche

Controllati in browser: un solo titolo «Progetti», posizione e testo invariati al cambio immagine, avanzamento automatico, frecce, assenza di pallini/pausa e di testi o azioni dei singoli progetti nella fascia. Verificati inoltre i 13 progetti iniziali, filtri e ricerca combinata, sottotitoli di categoria solo nella vista completa, tema giorno/notte e impaginazione mobile senza overflow orizzontale. Sintassi JavaScript e file condivisi della home e delle schede originali controllati senza modifiche.

## The Coffin

[Apri la scheda The Coffin](https://nicolepiffer97-art.github.io/Sito-Twiice/progetto.html?id=the-coffin).

La nuova scheda segue un percorso lineare: titolo, video principale in grande, i sei paragrafi forniti in inglese, video making of più raccolto e galleria di 11 immagini. I lettori YouTube includono un collegamento diretto al video. Il nuovo progetto è in **Immagini e movimento** e usa la copertina fornita nel catalogo.

`dist/coffin-data.js` aggiunge il progetto solo al catalogo e alle schede; la selezione nella homepage e i dati originali non cambiano. Il rendering dedicato è in `dist/film-project.js`, lo stile è circoscritto in `dist/film-project.css`. Gli altri quattro progetti mantengono il proprio layout. Le immagini fornite sono salvate localmente in WebP, con miniature separate per la galleria; le didascalie e i link sorgente Drive conservano i nomi originali in `coffin-data.js`.

La galleria apre un dialogo modale con frecce precedente/successiva, tasti ←/→, Esc, chiusura sullo sfondo e swipe su touch. Lo scorrimento torna alla prima immagine dopo l’ultima. Il dialogo trattiene il focus e lo restituisce alla miniatura alla chiusura. Verificati catalogo, ricerca e categoria, ordine dei contenuti, quattro colonne desktop, due colonne mobile e assenza di overflow. YouTube può rifiutare il video principale dall’origine locale: verificare il lettore sul dominio pubblico dopo la pubblicazione.

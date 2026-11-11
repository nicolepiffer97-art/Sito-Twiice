# TWIICE · Creative universe

## Catalogo integrato

La sezione **Progetti** riunisce i lavori di Nicole e le repository di Raffaele con una fascia superiore a scorrimento e una griglia con quattro categorie e ricerca nella pagina, usando identità visiva e modalità giorno/notte TWIICE. [Dettagli tecnici](CATALOG.md).

[Apri direttamente il catalogo Progetti](https://nicolepiffer97-art.github.io/Sito-Twiice/progetti.html). L’integrazione, sviluppata su `work/twiice-updates`, è pubblicata da `main` dopo l’approvazione.

## Visita il sito

[Apri TWIICE · Tra le nuvole](https://nicolepiffer97-art.github.io/Sito-Twiice/)

Il link apre il sito pubblicato su GitHub Pages, navigabile senza account GitHub o ChatGPT.

Sito statico in `dist/`, senza dipendenze o compilazione. Servire la cartella
`dist/` per aprire il sito completo.

## Home fotografica

Lo sfondo `sky-photo.jpg` è la fotografia fornita dall’utente. Il logo è
sempre visibile. Le nuvole PNG sovrapposte e la loro animazione sono state
rimosse dalla home e dall’anteprima del progetto. Gli asset precedenti sono
conservati nel repository come riferimenti.

Il pulsante in alto a destra cambia giorno/notte. Stelle, contatore e scie
compaiono esclusivamente in modalità notte. Le otto stelle riprendono le
due sagome del logo definitivo. Raccolta e tema persistono in sessionStorage.
Tornando al giorno le scie in corso terminano senza perdere le raccolte.
Il documento scorre dalla home alle sezioni successive con una sfumatura.

## Identità visiva

`brand.css` applica bianco ghiaccio `#F7F8FC` dominante nel light, azzurro
cielo `#90CAF0` per sezioni selezionate, testi `#18234A`, blu notte `#10205A`
per il dark. Accenti: giallo caldo `#FFC400` nel light e verde luminoso
`#C2FDC7` nel dark.

Il progetto Adobe `https://use.typekit.net/nxv4ymj.css` carica Avenir LT Pro
200/400 per parti leggere e testi e Futura PT 700 per i titoli marcati.
Gochi Hand da Google Fonts evidenzia le parole accent. I loghi sono PNG
trasparenti, esportati dallo stesso originale con sagoma identica:
`twiice-logo-day.png` e `twiice-logo-dark.png` (RGB esatto `#C2FDC7`).

## Interazioni e verifiche

Le sezioni dei servizi si espandono. Il mini brief resta nel browser e può
essere copiato; non viene inviato. Sono rispettati prefers-reduced-motion,
focus visibile e nomi accessibili. WebMCP è disponibile tramite rilevamento
opzionale per leggere il tema e impostare giorno/notte.

Verificati: sintassi JavaScript, riferimenti agli asset e ID HTML, identità
della fotografia originale. Un controllo con DOM simulato verifica avvio,
cambio tema, raccolta solo di notte e completamento delle scie tornando al
giorno. Verifica visiva in browser non disponibile nell’ambiente corrente.

## Little Star · livello segreto
Le 8 stelle raccolte sulle pagine del sito sbloccano una costellazione animata, il messaggio **Wonder Found** e un varco verso `little-star/`. Il collegamento **✦ Wonder Found** rimane disponibile in tutte le pagine della caccia, anche in modalità giorno. Lo sblocco persiste in localStorage con fallback sessionStorage; i progressi della caccia mantengono il comportamento di sessione esistente. La sequenza rispetta le preferenze di movimento ridotto, ha chiusura e navigazione da tastiera, e non si ripete dopo lo sblocco.

Il gioco è incluso direttamente in `dist/little-star/` per essere pubblico su GitHub Pages senza account ChatGPT. Il ritorno al sito punta alla home relativa `../index.html`. Hall of Stars condivisa tramite servizio Sites e database D1, senza dati di esempio. I vecchi punteggi salvati soltanto nel browser non vengono importati nella classifica pubblica.

`site-stars.js` emette `twiice:stars-progress` quando il contatore visivo termina una raccolta. `secret-level.js` gestisce lo sblocco. Il collegamento Wonder Found passa da `wonder/`, che verifica lo sblocco e porta a Little Star; senza sblocco mostra l'invito a raccogliere le stelle. Il filtro pubblico Wonder/R&D del catalogo resta separato dal gioco. Su GitHub Pages il percorso completo è `/Sito-Twiice/wonder/`.

## Verifica della caccia alle stelle

Le otto stelle hanno ID stabili (qui numerati da 1): home 1, 3, 4, 5, 7, 8 e catalogo Progetti 2, 6. La stella 7 è quella accanto a «possibilità»: in modalità notte è un pulsante raccoglibile inserito nel titolo, senza duplicati. Le altre stelle delle sezioni di contenuto occupano una fascia dedicata di 80 px a tutte le larghezze; la stella del cielo cerca spazio sullo sfondo. Le stelle trasferite dalle schede conservano gli stessi ID e i progressi già registrati. L'area cliccabile misura almeno 44×44 px; il contatore e la grafica SVG non intercettano i clic destinati alle stelle.

Il sito è statico: non richiede build. Per i test di regressione: `npm install`, `npx playwright install chromium`, `npm test`. Per usare Edge già installato, impostare `PLAYWRIGHT_CHANNEL=msedge`. `star-audit.cjs` serve `dist/` localmente e verifica le otto stelle a 1440, 1024, 768, 600, 390 e 320 px: visibilità, bordi dello schermo, hitbox, sovrapposizioni, clic reali, raccolta animata e con movimento ridotto, contatore 8/8, persistenza, apertura singola e percorso Wonder → Little Star. I servizi esterni (font e video) sono esclusi dal test.


## Controlli e ritmo di Little Star
Su touch il joypad flottante usa il punto di appoggio come origine: trascinare indica una direzione, rilasciare ferma il comando, senza portare la stella sotto il dito. Mouse e tastiera restano disponibili. Dimensione e colore della stella interpolano gradualmente la crescita. Si parte con 18 puntini nel flusso, di cui 6 già visibili e distanziati all’avvio, e nessun ostacolo. Le particelle riciclate vengono accodate singolarmente con intervalli sfalsati di circa un secondo; la polvere scorre più velocemente degli ostacoli per evitare attese tra una raccolta e la successiva. Tutti i nuovi oggetti entrano da oltre il bordo superiore, senza ricomparire nel campo visibile. I primi asteroidi sono possibili dopo almeno 20 secondi e massa 3, le stelle dopo almeno 60 secondi e massa 10. Al massimo 3 ostacoli (2 su telefono), un nuovo incontro ogni 14 secondi, distanze longitudinali e corridoio centrale dimensionati per lasciare passaggio alla stella. Gli ostacoli non si attraggono né si scontrano tra loro. I puntini valgono 3 punti nella fase iniziale; il punteggio passivo è 0,25 punti al secondo. Una collisione letale mostra un'esplosione prima del Game over, che riporta fase e punteggio raggiunti.

`npm run test:game` verifica nel browser joypad touch, crescita e colore continui, progressione degli incontri, punteggio rallentato, stato di esplosione, ingresso fuori schermo, distanze e passaggio libero, classifica dopo il salvataggio e risultato finale, su desktop, telefono verticale e orizzontale.


## Classifica pubblica
`leaderboard.js` usa `https://twiice-hall-of-stars.fbshfc785g.chatgpt.site/api`. Ogni partita riceve un token casuale monouso. Il servizio conserva i risultati in D1, valida tempi, punteggi e nomi sul server, limita i tentativi e controlla il nickname con OpenAI prima di pubblicarlo. Senza chiave o con moderazione indisponibile, il salvataggio viene rifiutato: nessun ripiego su localStorage. I test browser simulano la risposta del servizio; i test del servizio verificano persistenza condivisa, token monouso, validazione e rifiuto in caso di errore. Nessun filtro garantisce copertura perfetta di tutte le lingue.

Le fasi di gioco usano classi stellari reali: nana rossa M, nana arancione K, stella solare G e stella blu B, con colori saturi e transizioni interpolate solo nell’ultimo tratto di ogni fase. È una progressione ludica per massa, non il ciclo evolutivo universale di una singola stella. Riferimento: [NASA, colori e classi stellari](https://science.nasa.gov/exoplanets/stars/). Il verde identifica materia e interfaccia, non una classe stellare.

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
compaiono esclusivamente in modalità notte. Le dodici stelle riprendono le
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
Le 12 stelle raccolte sulle pagine del sito sbloccano una costellazione animata, il messaggio **Wonder Found** e un varco verso `little-star/`. Il collegamento **✦ Wonder Found** rimane disponibile in tutte le pagine della caccia, anche in modalità giorno. Lo sblocco persiste in localStorage con fallback sessionStorage; i progressi della caccia mantengono il comportamento di sessione esistente. La sequenza rispetta le preferenze di movimento ridotto, ha chiusura e navigazione da tastiera, e non si ripete dopo lo sblocco.

Il gioco è incluso direttamente in `dist/little-star/` per essere pubblico su GitHub Pages senza account ChatGPT. Il ritorno al sito punta alla home relativa `../index.html`. Hall of Stars simulata: nomi di esempio e punteggi nel browser, senza database globale.

`site-stars.js` emette `twiice:stars-progress` quando il contatore visivo termina una raccolta. `secret-level.js` gestisce lo sblocco senza cambiare posizioni o regole delle stelle esistenti. La pagina pubblica Wonder/R&D resta separata dal gioco.

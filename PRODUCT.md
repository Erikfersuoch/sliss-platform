# Product

## Register

product

## Users

Piccoli imprenditori di servizi e prodotti che lavorano da soli o in micro-team: tatuatori, barbieri, estetisti, officine, artigiani, makers (stampa 3D). Sono in negozio o sul lavoro, spesso col cliente davanti o tra un appuntamento e l'altro. Usano il telefono al volo, a una mano, in tempi corti. Non sono persone "tech": vogliono aprire l'app, capire in tre secondi cosa fare e chiuderla. Il loro lavoro è il mestiere, non gestire un software, e ogni minuto passato al PC o al telefono a gestire i clienti uno a uno è tempo tolto al lavoro vero.

## Product Purpose

Sliss è una piattaforma che aiuta il piccolo artigiano a gestire più fasi del rapporto con la propria clientela, dall'appuntamento al post-vendita, con un doppio obiettivo: far dare un servizio eccellente al cliente e ridare tempo prezioso al professionista, togliendolo dalla gestione manuale uno a uno. Invece di passare il tempo al PC o al telefono a ricordare, scrivere e seguire ogni cliente a mano, il titolare lascia che Sliss tenga il filo.

La direzione di prodotto è "Sliss alleggerisce, non sostituisce": si aggancia agli strumenti che il titolare già usa (Google Calendar, WhatsApp) invece di ricostruirli. La piattaforma cresce per moduli, ciascuno una fase del rapporto col cliente; il primo modulo attivo è M1 Follow-Up (ricorda i follow-up, tiene la scheda cliente essenziale, prepara il messaggio giusto), gli altri (M2/M3/M5/M6/M9) si sbloccano dopo la validazione. Successo = il titolare cura i clienti meglio di prima e lavora di più, senza percepire Sliss come un lavoro in più. È una PWA, oggi in fase di validazione con tester reali.

## Brand Personality

Pratico, affidabile, professionale, premium ma caldo. Tre parole: pratico, fidato, curato. Sliss deve dare la sensazione di uno strumento serio e ben fatto ("figo" per qualità e dettaglio, non per effetti), ma con calore umano: parla la lingua dell'artigiano, non quella del software aziendale. Premium si esprime nella cura del dettaglio, nella calma e nella precisione, mai nella freddezza. Tono che toglie ansia, non che la aggiunge.

## Anti-references

- **App AI generica / slop**: niente gradienti viola, glow, glassmorphism decorativo, card tutte identiche, eyebrow maiuscoletto sopra ogni sezione, hero-metric da SaaS.
- **Social / consumer chiassoso**: niente toni giocosi eccessivi, emoji ovunque, animazioni esagerate o gamification gratuita.
- **Corporate freddo / impersonale**: niente dashboard SaaS anonima blu-navy senza calore, copy da ufficio.
- **Gestionale / ERP pesante**: niente tabelloni fitti, menu infiniti, densità da software aziendale complicato. Sliss è leggero per scelta, anche crescendo per moduli.

Sliss vive nel mezzo: piattaforma seria ma leggera, con personalità, mai sciatta e mai fredda.

## Design Principles

1. **Alleggerisce, non sostituisce.** Ogni schermata toglie lavoro al titolare e gli ridà tempo; non aggiunge un sistema da imparare. Se una funzione esiste già meglio altrove (Calendar, WhatsApp), Sliss ci si aggancia.
2. **Una piattaforma che resta leggera mentre cresce.** Sliss copre più fasi del rapporto col cliente per moduli, ma ogni schermata mostra solo la fase corrente. La crescita non deve mai diventare densità da gestionale.
3. **Tre secondi al compito.** L'azione principale di ogni schermata deve essere ovvia e raggiungibile a una mano. La gerarchia decide cosa conta, il resto si fa da parte.
4. **Premium è cura, non effetto.** La qualità si sente nei dettagli (spaziatura, contrasto, micro-feedback), non in decorazioni vistose.
5. **Calore prima di freddezza.** Linguaggio e colore parlano da artigiano ad artigiano. Stato e fiducia comunicati con tono umano, non da terminale.

## Accessibility & Inclusion

Baseline di default WCAG AA, mobile-first: contrasto testo ≥4.5:1, touch target ≥44px, layout usabile a una mano sul telefono in negozio. Stato (es. follow-up inviato/oggi/scaduto) non comunicato dal solo colore. Requisiti precisi da affinare con il feedback dei tester reali (Moira, Luca) man mano che emergono in uso. Reduced-motion da rispettare quando si introducono animazioni.

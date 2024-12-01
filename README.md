# Workshop i Procedural Animation

Hei, og velkommen til en skreddersydd workshop hos Bekk som skal lose deg inn i det sinnsykt fete temaet
som er Procedural Animation! Men du tenker sikkert hva er det egentlig?

Procedural Animation er metoder for å generere animasjoner i sanntid i stedet for å lage dem på forhånd.
Dette er et vidt brukt konsept i videospill, robotikk og simulasjoner ettersom det lar en definere bevegelser
og oppførsler som dynmaisk tilpasser seg omgivelser, brukerinput og andre påvirkningskrefter.

I denne workshoppen skal vi starte fra scratch, hvor vi begynner med å lære noen av de grunnleggende konseptene,
som gir oss en solid verktøykasse for å lage skikkelig fete ting mot slutten av opplegget.

## Installasjon

Klon repoet, og få smelt opp det som treng med å kjøre en av følgene kommandoer i rotmappa:

```
npm install
yarn install
bun install
```

Hvis det gikk knirkefritt så kan du kjøre prosjektet ved hjelp av tilsvarende kommando:

```
npm run dev
yarn dev
bun run dev
```

## P5.js

Vi bruker [P5.js](https://p5js.org/) som verktøy til å visualisere i denne workshoppen. Dette er et JavaScript rammeverk bygget oppå det multispråklige rammeverket [Processing](https://processing.org/) som er utbredt for å lære grafisk programmering.

Dersom du ønsker en oversikt over hvilke metoder som er innebygget så anbefaler jeg å sjekke ut referansene deres, emn jeg kommer også til å lenke til relevante metoder for oppgavene det gjelder.

## 1: Constraints

Constraints er regler eller begrensinger som sier noe om hvordan objekter og karakterer kan bevege seg, enten relativt
til andre ting eller til seg selv!

I denne delen skal vi prøve å gjenskape dette:

<video width="320" height="240" controls>
  <source src="./videos/oppgave1.mov" type="video/mp4">
</video>

hvor vi har en dott, som er "constrained" til å ikke kunne
være lengre unna musepekeren enn sirkelen som er tegna.

### Oppgave 1 A

- Åpne sketch.ts fila, denne fila vil fungere som vår canvas for resten av workshoppen.

- Gjør TODO for å opprette en vektor for musepekeren.
- Gå inn i `components/utils` og implementer `constrainDistance` funksjonen.
- Bruk vektoren for musepekeren, og `constrainDistance` funksjonen til å oppdatere posisjonen til dotten.

### Oppgave 1 B

- Implementer `constrainMaxDistance` funksjonen.
- Erstatt oppdateringen av posisjone til dotten med `constrainMaxDistance` funksjonen

## 2: Kinematics

Kinematics er et felt som handler om å studere hvordan ting beveger seg _uten_ å ta til hensyn hvilke naturkrefter som forårsaker det!

I Procedural Animation så handler det om å definere hvordan og i hvilken rekkefølge ting skal flytte og rotere på seg.

Man deler det ofte inn i to deler, forward kinematics (FK) og Inverse kinematics (IK). Først skal vi fokusere på Forward kinematics, hvor vi prøver å definere hvordan et helt sammensatt objekt følger etter når en del begynner å bevege seg. For eksempel, at vognene henger etter når et lokomotiv kjører.

### Oppgave 2 A

I denne oppgaven skal vi lage en kjede, hvor flere ledd henger sammen og blir dratt i retning av musa:

<video width="320" height="240" controls>
  <source src="./videos/oppgave2.mov" type="video/mp4">
</video>

- Finn frem til `SimpleChain` filen i components mappa, og implementer `resolve` og `draw` metodene.

- Initialiser en `SimpleChain` i sketchen din som beveger seg mot musepekeren.

## 3: Inverse kinematics

## 4: Drawing shapes

## 5: With our powers combined

## 6: Let the creativity flow

HAhahahah
https://x.com/runevision/status/1857823929575870911

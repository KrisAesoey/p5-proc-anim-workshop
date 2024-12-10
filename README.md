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

Dersom du ønsker en oversikt over hvilke metoder som er innebygget så anbefaler jeg å sjekke ut referansene deres, men jeg kommer også til å nevne relevante metoder for oppgavene det gjelder.

Tips! Hvis du finner en oppgave litt forvirrende, så er det et sett med løsningsforslag i `Fasiter` mappen. Der finner du _ALL_ koden du trenger for å løse en oppgave i hver fil!

## 1: Constraints

Constraints er regler eller begrensinger som sier noe om hvordan objekter og karakterer kan bevege seg, enten relativt
til andre ting eller til seg selv!

I denne delen skal vi prøve å gjenskape dette:

<video width="320" height="360" controls>
  <source src="./videos/oppgave1.mov" type="video/mp4">
</video>

hvor vi har en dott, som er "constrained" til å ikke kunne
være lengre unna musepekeren enn sirkelen som er tegna.

For denne oppgaven kan det være lurt å sjekke ut:

- `add(value: P5.Vector)` - Plusser på en annen vektor og gir deg summen.
- `sub(value: P5.Vector)` - Trekker fra en annen vektor for å finne differansen.
- `mag()` - Finner den totale lengden (magnituden) av vektoren i alle retninger.
- `setMag(len: number)`- Skalerer vektoren til en ny magnitude basert på gitt lengde.

I tillegg er det mange metoder som ikke er statiske fra biblioteket, men bygger på en `P5`instans. Dette gjelder hovedsaklig ting som skal være knyttet til en canvas (med andre ord tegnes):

`.createVector()` - Tegner en ny vector på canvaset.
`.ellipse(x: number, y: number, w: number, h?: number)` - Tegner en sirkel på canvaset.

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

### Oppgave 2

I denne oppgaven skal vi lage en kjede, hvor flere ledd henger sammen og blir dratt i retning av musa:

<video width="320" height="360" controls>
  <source src="./videos/oppgave2.mov" type="video/mp4">
</video>

- Finn frem til `SimpleChain` filen i components mappa, og implementer `resolve` metoden, slik at hver lenke på kjeden er "constrained" på avstand når posisjon blir oppdatert.

- Implementer `draw` metoden også, slik at kjeden tegnes på canvaset.

- Initialiser en `SimpleChain` i sketchen din som beveger seg mot musepekeren.

## 3: Inverse kinematics

I forrige del fikk vi intro til Kinematics, og nå skal vi se på det som heter Inverse kinematics. Da ser man på hvordan bevegelsen henger sammen både fra startpunktet og sluttpunktet før man regner ut bevegelsen. For eksempel, hvis en skal ta et steg, så ser man hvor langt foten kan strekke seg fra kroppen og hvor den lander før man kalkluerer hvordan alle leddene må bevege seg for å nå den ønskede posisjonen.

Her er en søt liten tabell som forklarer litt flere detaljer om forskjellene:

| Aspect         | Forward Kinematics (FK)                  | Inverse Kinematics (IK)                     |
| -------------- | ---------------------------------------- | ------------------------------------------- |
| **Direction**  | Joint parameters → End effector position | End effector position → Joint parameters    |
| **Complexity** | Relatively simple to compute             | Computationally more complex                |
| **Control**    | Direct control over joint movements      | Indirect control, focusing on end effector  |
| **Use Case**   | Predetermined motion paths               | Target-driven motion (e.g., reaching tasks) |

Vi skal lage inverse kinematics, ved å skape en lenke som sitter fast, men strekker seg etter musepekeren uten at ankeret flytter på seg.

For å oppnå dette skal vi implementere **FABRIK** algoritmen, **(Forward and Backward Reaching Inverse Kinematics)**, hvor vi regner ut hvordan det fremste leddet i kjeden beveger seg mot musepekeren og hvordan det påvirker alle ledene etter, og så går vi bakover og sjekker at de nye posisjonene ikke overskriver avstanden vi har satt som constrain for hvert ledd hvor vi starter med ankeret.

### Oppgave 3

- I `SimpleChain` filen, implementer `resolveFabrik` algoritmen, og erstatt `resolve` metoden i sketchen din med denne i stedet.

## 4: Constraining angles

Med funksjonene vi har implementert nå, så har vi egentlig alt vi trenger for å lage noe skikkelig fett. Kjedene vi har implementert kan fungere som ryggrader for skapninger og dyr som slanger, fisker og alt annet med enn rygg!

Men, ryggrader er ikke uendelig fleksible, og skal ikke kunne bøye seg i alle mulig retninger. Nå skal vi gjøre kjedene våre litt mindre fleksible!

### Oppgave 4 A

I denne oppgaven skal vi bytte ut `SimpleChain` med `AngledChain`, som er veldig lik den vi har jobbet med, men den har også en oversikt over hvilken `angle` hvert ledd har, og hvor mye `angleConstraint` det skal være mellom hvert ledd. Lavere constraint vinkel = stivere kjede.

I `resolve` er det allerde satt en vinkel for første leddet, som peker mot musepekeren.

- Se på loopen for å oppdatere resten av leddene: finn vinkelen for hvert ledd, og oppdater `angles` ved å constraine leddet til det forrige leddet ved hjelp av `constrainAngle` funskjonen som ligger i `utils.ts`.

- Bytt ut `SimpleChain` med `AngledChain` i sketchen din og sjekk det ut!

### Oppgave 4 B

Nå som vi har en ryggrad som ikke kan loope over seg selv 14 millioner ganger, så kan vi faktisk prøve å tegne noe!

I denne oppgaven skal vi prøve å tegne en slange slik som det her:

<video width="320" height="360" controls>
  <source src="./videos/oppgave4.mov" type="video/mp4">
</video>

Metoden vi skal bruke for å tegne formen er å lage en kjede hvor vi definerer hvor bred hver enkelt ledd av slangen skal være, og så tegne omrisset av slangen:

For at dette skal være smooth, så tegner vi fra ytterpunktet av hvert ledd til det neste, slik at vi får en form som lett kan bøyes når slangen snirkler seg.

Det vi trenger å gjøre, som vi ikke har gjort, er da å regne ut hvor ytterpunktene faktisk er, basert på hvilken vinkel leddet peker mot.

- I `Snake` fila: implementer funksjonene `getPosX`og `getPosY`. I tillegg til argumentene til funksjonen, så trenger dere også å bruke:
  - `this.spine.joints` - Arrayen som holder leddene
  - `this.spine.angles` - Listen over vinklene til hvert ledd
  - `this.jointSizes` - Listen som sier hvor bred hvert ledd er.
  - `.cos()` - Funksjon i p5 for å finne cosinus av en vinkel.
  - `.sin()` - Funksjon i p5 for å finne sinus av en vinkel.

## 5: With our powers combined

Nå har vi egentlig gått gjennom alt som skal til for å lage alle mulige fantastiske animerte dyr. Det meste er jo egentlig bare en slange med armer og bein, som vi kan implementere med FABRIK algoritmen! Så det skal vi prøve på nå.

I `Lizard` filen finner vi noe som ligner på slangen fra forrige oppgave, bortsett fra at den har en array bestående av 4 armer,
representert av `Arm` klassen. En `Arm` er nøyaktig det samme som en `AngledChain` fra forrige oppgave, men den tegner formen ulikt basert på hvilken side av kroppen den er på og om den er framme eller bak.

### Oppgave 5

For at armene skal se skikkelig smooth ut så ønsker vi at de bare strekker seg i retningen firfirslen beveger seg når de er helt bak
i sin "Range of Motion". Akkurat slik som at vi bare flytter bena våre framover når vi går når de er bak oss. Derfor lagrer vi en ønsket posisjon som armen skal strekke seg mot (arrayen `armsDesiredPos`), og når det punktet er langt nok unna det nåværende ønskete punktet så oppdaterer vi det!

- I `Lizard` filens `resolve` metode, oppdater hver arms posisjon ved hjelp av armens `resolveFabrik` funksjon. For å få dette til må du finne ut hvor ankeret til armen er (dette er relativt til leddet på kroppen den henger fra).

- Bonus: hvis du prøve å få litt smoothere bevegelse så kan du teste `lerp()` metoden for å ikke strekke armen så langt den kan gå.

- Instansier `Lizard` klassen i sketchen din!

## 6: Let the creativity flow

Gratulerer du er gjennom oppgavene, nå er det bare å være kreativ og lage de sykeste skapningene og animere dem som du vil!

https://x.com/runevision/status/1857823929575870911

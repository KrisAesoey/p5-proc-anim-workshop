# Oppgave 1

Som en oppvarming skal vi lage vår første constraint!

## Nyttige metoder fra P5.js

P5.js' vektorer har mange metoder som kan brukes for å
gjøre utregninger og transformasjoner på dem!

For denne oppgaven kan det være lurt å sjekke ut:

- `add(value: P5.Vector)` - Adderer en annen vektor og gir deg summen.
- `sub(value: P5.Vector)` - Trekker fra en annen vektor for å finne differansen.
- `mag()` - Finner den totale lengden (magnituden) av vektoren i alle retninger.
- `setMag(len: number)`- Skalerer vektoren til en ny magnitude basert på gitt lengde.

I tillegg er det mange metoder som ikke er statiske fra biblioteket, men bygger på en `P5`instans. Dette gjelder hovedsaklig ting som skal være knyttet til en canvas (med andre ord tegnes):

`.createVector()`

## Gotchas og hint

<details>
  <summary>
    Er dotten alltid stuck på sirkelen?
  </summary>
    Hvis dotten er innenfor sirkelen så er det ingen grunn til å oppdatere posisjonen. Kan du gjøre en sjekk som finner ut om den er innafor eller ikke?
</details>
<details>
  <summary>
    Peker alltid dotten mot midten av skjermen når du beveger på sirkelen?
  </summary>
    Hvis du setter den intielle posisjonen dotten inne i
    draw metoden, så vil den alltid regne ut fra sentrum til
    museposisjonen. Kan du sette startsposisjonen et sted så den ikke blir oppdatert på hver frame? 
</details>

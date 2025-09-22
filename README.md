# Aureum

Eine kleine, einseitige React 19 Anwendung (Vite + Tailwind), die
Audio aufnimmt oder hochlädt, lokal speichert und erst nach deiner Bestätigung
über den großen "Process"-Button zu OpenAI sendet, transkribiert und
mit einem gezielten Prompt in sieben Abschnitte auf Deutsch auswertet.

Abschnitte:
- Anamnese
- Klinische Fragestellung
- Untersuchungsart
- Befund
- Beurteilung
- Befund in Laienverständlicher Sprache
- Beurteilung in Laienverständlicher Sprache

## Entwicklung

Voraussetzungen: Node 18+ (empfohlen: 20)

```bash
npm install
npm run dev
```

## OpenAI API Key

- Die App ist vollständig clientseitig (kein Backend). Gib deinen OpenAI API Key in der Oberfläche ein.
- Optional kann der Key im Browser (LocalStorage) gespeichert werden. Beachte das Sicherheitsrisiko.

## Deployment auf GitHub Pages

Die Workflow-Datei `.github/workflows/deploy.yml` baut und deployt bei Push auf `main`.

Schritte:
1. In den Repository Settings unter "Pages" die Build-Quelle auf "GitHub Actions" setzen.
2. Auf `main` pushen.
3. Die App wird unter `https://<user>.github.io/<repo>/` verfügbar sein.

> Der Vite `base`-Pfad wird im Workflow dynamisch auf `/<repo>/` gesetzt.

## Datenschutz

Audio und Inhalte werden an die OpenAI API gesendet. Nutze die Anwendung nur mit Daten, deren Nutzung zulässig ist.

## Bedienung

- Aufnahme starten über den großen gelben Button oder Datei hochladen.
- Die Audiodatei wird zunächst lokal (im Browser) abgelegt.
- Erst durch Klick auf den großen Button "Process" startet die Transkription und Auswertung.
- Der Fortschrittsbalken zeigt den Status (Upload → Transkription → Analyse).

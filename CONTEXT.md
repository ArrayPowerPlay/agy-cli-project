# CONTEXT.md

## 1. PROJECT IDENTITY
- **Project Name**: agy-cli-project
- **Core Objective**: Web application built using Python Flask and plain vanilla HTML, JavaScript, and CSS that fetches Google Cloud BigQuery release notes and provides interactive update sharing via X/Twitter.

## 2. TECH STACK
- **Language**: Python 3.13
- **Framework**: Flask
- **Libraries**: `requests`, `beautifulsoup4`, `xml.etree.ElementTree`
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism & Dark Mode), Vanilla JavaScript
- **Version Control & Hosting**: Git, GitHub (`https://github.com/ArrayPowerPlay/agy-cli-project`)

## 3. SYSTEM ARCHITECTURE
- `app.py`: Flask web server and Atom XML feed parser for BigQuery release notes (`/api/release-notes`).
- `templates/index.html`: Main single-page web app interface with search, filter chips, and loading states.
- `static/css/style.css`: Custom glassmorphism dark mode theme, typography, and card styles.
- `static/js/main.js`: Client-side feed fetching, category filtering, search, and Tweet intent trigger.
- `.gitignore`: Standard Python and environment exclusion rules.

## 4. ACTIVE INTEGRATIONS
- **Google Cloud Feed**: `https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`
- **X/Twitter Web Intent**: `https://twitter.com/intent/tweet`
- **GitHub Repository**: `ArrayPowerPlay/agy-cli-project`

## 5. DEVELOPMENT LOG
- **2026-08-10**: Initialized project, created Flask backend and Atom feed parser.
- **2026-08-10**: Built single-page responsive UI with search, category filtering, refresh button, and tweet action.
- **2026-08-10**: Initialized Git repository, created `.gitignore`, authenticated via GitHub CLI, and pushed repository to [ArrayPowerPlay/agy-cli-project](https://github.com/ArrayPowerPlay/agy-cli-project).

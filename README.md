# BigQuery Release Notes Radar 🚀

A modern, full-stack web application built with **Python Flask**, **Vanilla JavaScript**, and **CSS3** that automatically ingests, parses, categorizes, and displays live [Google Cloud BigQuery Release Notes](https://docs.cloud.google.com/feeds/bigquery-release-notes.xml).

---

## 🌟 Key Features

- **Live Feed Ingestion**: Connects directly to Google Cloud's Atom XML RSS feed.
- **Smart HTML & Category Parsing**: Parses XML entries into structured update cards categorized by type (`Feature`, `Announcement`, `Changed`).
- **Interactive Control Bar**:
  - **Instant Search**: Search through release notes by keyword (e.g. `VECTOR_SEARCH`, `OpenTelemetry`, `cross-cloud`).
  - **Category Chips**: Filter notes dynamically by category.
  - **Refresh Spinner**: One-click refresh button with animated spinner.
- **One-Click X/Twitter Sharing**: Formats selected updates into a pre-filled Tweet dialog with hashtags (`#BigQuery #GoogleCloud #DataEngineering`), summary text, and official documentation links.
- **Dark Mode Glassmorphic UI**: Styled using custom CSS tokens, micro-animations, and Google Fonts (`Outfit` and `Inter`).

---

## 🛠️ Tech Stack

- **Backend**: Python 3.13, Flask, Requests, BeautifulSoup4, ElementTree XML
- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), Vanilla JavaScript (ES6+), FontAwesome
- **CLI & Version Control**: Git, GitHub CLI (`gh`)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Python 3.8+** installed on your system.

### 2. Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArrayPowerPlay/agy-cli-project.git
   cd agy-cli-project
   ```

2. **Install Python dependencies**:
   ```bash
   pip install flask requests bs4
   ```

3. **Run the Flask application**:
   ```bash
   python app.py
   ```

4. **Open in your browser**:
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📁 Project Structure

```text
agy-cli-project/
├── app.py              # Flask server & Atom XML parser logic
├── templates/
│   └── index.html      # Main application HTML structure
├── static/
│   ├── css/
│   │   └── style.css   # Dark-mode glassmorphic design system
│   └── js/
│       └── main.js     # Client-side feed fetching, search & tweet triggers
├── .gitignore          # Environment and cache exclusions
├── CONTEXT.md          # Project context & development log
└── README.md           # Documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

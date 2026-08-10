import xml.etree.ElementTree as ET
import re
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def parse_release_feed(xml_text):
    notes = []
    try:
        root = ET.fromstring(xml_text)
        namespace = {'atom': 'http://www.w3.org/2005/Atom'}
        
        for entry in root.findall('atom:entry', namespace):
            date_title = entry.find('atom:title', namespace)
            date_str = date_title.text if date_title is not None else 'Unknown Date'
            
            entry_id = entry.find('atom:id', namespace)
            entry_id_text = entry_id.text if entry_id is not None else ''
            
            link_elem = entry.find('atom:link', namespace)
            link_url = link_elem.attrib.get('href') if link_elem is not None else 'https://cloud.google.com/bigquery/docs/release-notes'
            
            content_elem = entry.find('atom:content', namespace)
            content_html = content_elem.text if content_elem is not None else ''
            
            if content_html:
                soup = BeautifulSoup(content_html, 'html.parser')
                current_category = "General"
                current_items = []
                
                # Iterate over children to separate categories (h3 tags) and content (p/ul tags)
                for element in soup.children:
                    if element.name == 'h3':
                        if current_items:
                            # Save preceding block
                            raw_text = " ".join(current_items).strip()
                            clean_text = re.sub(r'\s+', ' ', raw_text)
                            if clean_text:
                                notes.append({
                                    "date": date_str,
                                    "category": current_category,
                                    "html_content": "".join(current_items),
                                    "text_content": clean_text,
                                    "link": link_url,
                                    "id": f"{entry_id_text}_{len(notes)}"
                                })
                            current_items = []
                        current_category = element.get_text(strip=True) or "General"
                    elif element.name in ['p', 'ul', 'ol', 'div']:
                        current_items.append(str(element))
                
                if current_items:
                    raw_text = " ".join(current_items).strip()
                    soup_text = BeautifulSoup(raw_text, 'html.parser').get_text()
                    clean_text = re.sub(r'\s+', ' ', soup_text)
                    if clean_text:
                        notes.append({
                            "date": date_str,
                            "category": current_category,
                            "html_content": "".join(current_items),
                            "text_content": clean_text,
                            "link": link_url,
                            "id": f"{entry_id_text}_{len(notes)}"
                        })
            else:
                notes.append({
                    "date": date_str,
                    "category": "General",
                    "html_content": "<p>No description provided.</p>",
                    "text_content": "No description provided.",
                    "link": link_url,
                    "id": f"{entry_id_text}_{len(notes)}"
                })
    except Exception as e:
        print(f"Error parsing Atom feed: {e}")
        
    return notes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/release-notes')
def get_release_notes():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(FEED_URL, headers=headers, timeout=10)
        response.raise_for_status()
        notes = parse_release_feed(response.text)
        
        # Collect distinct categories
        categories = list(dict.fromkeys([n['category'] for n in notes]))
        
        return jsonify({
            "status": "success",
            "count": len(notes),
            "categories": categories,
            "notes": notes
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

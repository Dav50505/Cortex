from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sys
import os
import json
from datetime import datetime

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Import database
from database import CortexDB

app = Flask(__name__)
CORS(app)

# Initialize database with correct path (go up one level from web_ui to apps/cortex)
db_path = os.path.join(parent_dir, 'data', 'cortex_db.json')
db = CortexDB(db_path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/research')
def get_all_research():
    """Get all research papers"""
    papers = db.find('publications')
    # Sort by timestamp (newest first)
    papers.sort(key=lambda x: x.get('_timestamp', ''), reverse=True)
    return jsonify(papers)

@app.route('/api/research/<paper_id>')
def get_research(paper_id):
    """Get specific research paper"""
    papers = db.find('publications', {'_id': paper_id})
    if papers:
        return jsonify(papers[0])
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/stats')
def get_stats():
    """Get performance statistics"""
    papers = db.find('publications')
    
    if not papers:
        return jsonify({
            'total_papers': 0,
            'total_agents': 0,
            'avg_iterations': 0,
            'papers_by_topic': []
        })
    
    stats = {
        'total_papers': len(papers),
        'total_agents': sum(len(p.get('agents', [])) for p in papers),
        'papers_by_date': {},
        'recent_papers': papers[-5:] if len(papers) >= 5 else papers
    }
    
    # Group by date
    for paper in papers:
        timestamp = paper.get('_timestamp', '')[:10]  # Get date part
        if timestamp:
            stats['papers_by_date'][timestamp] = stats['papers_by_date'].get(timestamp, 0) + 1
    
    return jsonify(stats)

if __name__ == '__main__':
    print("🧠 Cortex Web UI starting...")
    print("📡 Access at: http://localhost:8000")
    app.run(debug=True, port=8000)

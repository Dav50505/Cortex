import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

class CortexDB:
    def __init__(self, db_path: str = "data/cortex_db.json"):
        self.db_path = db_path
        self.data = self._load_db()

    def _load_db(self) -> Dict[str, List[Dict]]:
        if not os.path.exists(self.db_path):
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            return {}
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}

    def _save_db(self):
        with open(self.db_path, 'w') as f:
            json.dump(self.data, f, indent=2)

    def insert(self, collection: str, document: Dict[str, Any]) -> str:
        """Inserts a document into a collection. Returns the new ID."""
        if collection not in self.data:
            self.data[collection] = []
        
        doc_id = str(uuid.uuid4())
        record = {
            "_id": doc_id,
            "_timestamp": datetime.now().isoformat(),
            **document
        }
        
        self.data[collection].append(record)
        self._save_db()
        return doc_id

    def find(self, collection: str, query: Dict[str, Any] = None) -> List[Dict]:
        """Finds documents in a collection matching the query."""
        if collection not in self.data:
            return []
        
        if not query:
            return self.data[collection]

        results = []
        for doc in self.data[collection]:
            match = True
            for key, value in query.items():
                if doc.get(key) != value:
                    match = False
                    break
            if match:
                results.append(doc)
        return results

    def clear(self, collection: str):
        """Clears a collection."""
        if collection in self.data:
            self.data[collection] = []
            self._save_db()

import sys
import os
import json

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

def test_semantic_search():
    print("=== Qualia Semantic Search Integration Test ===")
    
    # Initialize TestClient
    client = TestClient(app)

    # 1. Upload first interview (Notion workflows)
    payload_notion = {
        "title": "B2B SaaS PM Notion Workflow Session",
        "transcript": (
            "Interviewer: Tell us about quote collection.\n"
            "Mark: I copy-paste quotes manually into Notion pages. It is tedious and takes "
            "hours of transcription work. I wish there was a searchable database of insights."
        ),
        "participant_info": {"name": "Mark Jones", "role": "PM", "company": "SaaSFlow"}
    }
    
    # 2. Upload second interview (App Store Battery Drain)
    payload_battery = {
        "title": "Mobile Developer App Store Review Analysis",
        "transcript": (
            "Interviewer: What is the main feedback this week?\n"
            "Developer: Users are complaining about severe battery drain and slow performance "
            "on iOS 17. The app store reviews are dropping because the app crashes on launch."
        ),
        "participant_info": {"name": "Sarah Lee", "role": "Developer", "company": "AppCo"}
    }

    print("\nUploading Interview 1 (Notion)...")
    res1 = client.post("/api/v1/interviews", json=payload_notion)
    assert res1.status_code == 201, f"Failed: {res1.text}"
    
    print("Uploading Interview 2 (Battery Drain)...")
    res2 = client.post("/api/v1/interviews", json=payload_battery)
    assert res2.status_code == 201, f"Failed: {res2.text}"

    # 3. Perform semantic search for "copying text notion"
    search_payload_1 = {
        "query": "copying text notion",
        "limit": 3,
        "threshold": 0.1
    }
    print("\nSearching for: 'copying text notion'...")
    search_res_1 = client.post("/api/v1/search", json=search_payload_1)
    assert search_res_1.status_code == 200, f"Search failed: {search_res_1.text}"
    
    results_1 = search_res_1.json()
    print(f"Found {len(results_1)} results.")
    for idx, r in enumerate(results_1):
        print(f" {idx + 1}. Title: {r['interview']['title']}")
        print(f"    Similarity: {r['similarity']:.4f}")
        print(f"    Summary: {r['summary']}")

    # 4. Perform semantic search for "battery performance ios reviews"
    search_payload_2 = {
        "query": "battery performance ios reviews",
        "limit": 3,
        "threshold": 0.1
    }
    print("\nSearching for: 'battery performance ios reviews'...")
    search_res_2 = client.post("/api/v1/search", json=search_payload_2)
    assert search_res_2.status_code == 200, f"Search failed: {search_res_2.text}"
    
    results_2 = search_res_2.json()
    print(f"Found {len(results_2)} results.")
    for idx, r in enumerate(results_2):
        print(f" {idx + 1}. Title: {r['interview']['title']}")
        print(f"    Similarity: {r['similarity']:.4f}")
        print(f"    Summary: {r['summary']}")

if __name__ == "__main__":
    test_semantic_search()

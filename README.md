# Qualia - AI Qualitative Research & Synthesis Platform

Qualia is a qualitative research platform that translates raw interview transcripts into qualitative insights. It automatically groups recurring themes, extracts feature requests, lists pain points, and verifies every single claim with verbatim quotes mapped to the original session context.

---

## Technical Architecture & Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase / PostgreSQL (with `pgvector` enabled)
- **Language Models**: Google Gemini (via `google-genai` / structured schema outputs)
- **Vector Search**: pgvector conceptual semantic search (with pure-python cosine similarity fallback)

### Frontend
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 (Sleek dark-mode aesthetic)
- **Icons**: Lucide React

---

## Project Structure

```text
qualia/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── ai/               # Gemini Extractions, Embeddings & Clustering
│   │   ├── core/             # Settings and Configurations
│   │   ├── db/               # Supabase Clients & Repositories
│   │   ├── models/           # Pydantic Database Schemas
│   │   └── schemas/          # API Serialization Contracts
│   └── scratch/              # Integration Test Scripts
│
└── frontend/                 # Next.js Application
    ├── src/
    │   ├── components/       # Navigation Sidebar and Search Modal overlays
    │   │   └── ui/           # Custom Reusable shadcn-style UI Primitives
    │   └── app/              # Dashboard pages and evidence panels
```

---

## Local Setup & Run Instructions

To run both services concurrently, open two terminal windows.

### 1. Backend Server Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   source .venv/bin/activate # Unix/macOS
   ```
3. Install package requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables (create a `.env` file inside `backend/` or export them):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   SUPABASE_URL="optional-supabase-url"
   SUPABASE_KEY="optional-supabase-anon-key"
   ```
5. Boot the FastAPI API server:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```
   *The Swagger API documentation will be available at **`http://localhost:8000/docs`**.*

### 2. Frontend Development Setup
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm package dependencies:
   ```bash
   npm install
   ```
3. Configure the local environment variables (create a `.env.local` file inside `frontend/`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Boot the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will boot up at **`http://localhost:3000`**.*

---

## Running Integration Tests

Ensure your backend virtual environment is active, then run:
```bash
# Test Gemini qualitative insight extraction pipeline
python scratch/test_extraction.py

# Test conceptual semantic vector similarity search
python scratch/test_semantic_search.py

# Test the entire end-to-end processing pipeline
python scratch/test_full_flow.py
```

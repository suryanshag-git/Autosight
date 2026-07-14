from uuid import UUID
from typing import Optional, Dict
from app.models.interview import InterviewModel
from app.db.supabase import supabase_client
import logging

logger = logging.getLogger(__name__)

# Fallback global mock database to simulate state persistence when Supabase is not configured
_mock_interviews_db: Dict[UUID, InterviewModel] = {}

class InterviewRepository:
    def __init__(self) -> None:
        self.client = supabase_client

    async def create(self, interview: InterviewModel) -> InterviewModel:
        """
        Inserts an interview record into the Supabase database.
        Falls back to a static in-memory store if Supabase is unconfigured or fails.
        """
        if self.client is None:
            logger.info(f"[Mock DB] Saving interview record locally: {interview.id}")
            _mock_interviews_db[interview.id] = interview
            return interview

        try:
            # model_dump(mode="json") automatically converts UUIDs & datetimes to strings
            payload = interview.model_dump(mode="json")
            self.client.table("interviews").insert(payload).execute()
            logger.info(f"[Supabase DB] Saved interview: {interview.id}")
            return interview
        except Exception as e:
            logger.error(f"Supabase interview insert failed: {e}. Falling back to local in-memory DB.")
            _mock_interviews_db[interview.id] = interview
            return interview

    async def get(self, interview_id: UUID) -> Optional[InterviewModel]:
        """
        Retrieves an interview record by its unique ID.
        """
        if self.client is None:
            return _mock_interviews_db.get(interview_id)

        try:
            response = self.client.table("interviews").select("*").eq("id", str(interview_id)).execute()
            if not response.data:
                return _mock_interviews_db.get(interview_id)
            return InterviewModel(**response.data[0])
        except Exception as e:
            logger.error(f"Supabase interview select failed: {e}. Checking local in-memory DB.")
            return _mock_interviews_db.get(interview_id)

    async def get_by_transcript(self, transcript: str) -> Optional[InterviewModel]:
        """
        Retrieves an interview record with the exact transcript content.
        Helps prevent duplicate uploads and redundant AI extractions.
        """
        if not transcript:
            return None
        stripped_t = transcript.strip()

        if self.client is None:
            for interview in _mock_interviews_db.values():
                if interview.transcript.strip() == stripped_t:
                    return interview
            return None

        try:
            response = self.client.table("interviews").select("*").eq("transcript", stripped_t).execute()
            if not response.data:
                for interview in _mock_interviews_db.values():
                    if interview.transcript.strip() == stripped_t:
                        return interview
                return None
            return InterviewModel(**response.data[0])
        except Exception as e:
            logger.error(f"Supabase query by transcript failed: {e}. Checking local mock DB.")
            for interview in _mock_interviews_db.values():
                if interview.transcript.strip() == stripped_t:
                    return interview
            return None

    async def search_similarity(
        self, query_embedding: list[float], limit: int = 5, threshold: float = 0.3
    ) -> list[dict]:
        """
        Performs semantic similarity search against interviews using pgvector via Supabase RPC.
        Falls back to local pure-python cosine similarity calculations if database is unconfigured/offline.
        """
        if self.client is None:
            logger.info("[Mock DB] Running local similarity search fallback...")
            return self._local_search(query_embedding, limit, threshold)

        try:
            response = self.client.rpc("match_interviews", {
                "query_embedding": query_embedding,
                "match_threshold": threshold,
                "match_count": limit
            }).execute()
            
            # If search returns no DB results, try local in-memory records
            if not response.data:
                return self._local_search(query_embedding, limit, threshold)
            
            return response.data
        except Exception as e:
            logger.error(f"Supabase RPC match_interviews failed: {e}. Falling back to local similarity search.")
            return self._local_search(query_embedding, limit, threshold)

    def _local_search(self, query_embedding: list[float], limit: int, threshold: float) -> list[dict]:
        results = []
        for interview in _mock_interviews_db.values():
            if not interview.embedding:
                continue
            sim = cosine_similarity(query_embedding, interview.embedding)
            if sim >= threshold:
                results.append({
                    "id": str(interview.id),
                    "title": interview.title,
                    "transcript": interview.transcript,
                    "participant_info": interview.participant_info,
                    "date": interview.date.isoformat() if interview.date else None,
                    "metadata": interview.metadata,
                    "created_at": interview.created_at.isoformat() if interview.created_at else None,
                    "updated_at": interview.updated_at.isoformat() if interview.updated_at else None,
                    "similarity": sim
                })
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]

import math

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    magnitude_v1 = math.sqrt(sum(a * a for a in v1))
    magnitude_v2 = math.sqrt(sum(b * b for b in v2))
    if magnitude_v1 == 0.0 or magnitude_v2 == 0.0:
        return 0.0
    return dot_product / (magnitude_v1 * magnitude_v2)


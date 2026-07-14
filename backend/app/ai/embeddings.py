import google.generativeai as genai
import logging
from app.core.config import settings
from app.ai.gemini import configure_gemini
import asyncio
import time
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

# In-memory cache for query embeddings: query_str -> (embedding, expiry_timestamp)
_query_embedding_cache: Dict[str, Tuple[list[float], float]] = {}

async def generate_embedding(text: str, is_query: bool = False) -> list[float]:
    """
    Generates a 768-dimensional vector embedding for the given text using Gemini's embedding model.
    Runs synchronously wrapped inside an async executor to prevent blocking the event loop.
    Caches search query embeddings for 10 minutes to minimize API quota consumption.
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty for embedding generation.")

    # Check query embedding cache
    if is_query:
        cleaned_query = text.strip().lower()
        now = time.time()
        if cleaned_query in _query_embedding_cache:
            embedding, expiry = _query_embedding_cache[cleaned_query]
            if now < expiry:
                logger.info(f"Query embedding cache hit for: '{cleaned_query}'")
                return embedding
            else:
                # Remove expired cache entry
                del _query_embedding_cache[cleaned_query]

    # Re-ensure Gemini client config is configured
    configure_gemini()
    
    # Select task type based on retrieval mode
    task_type = "retrieval_query" if is_query else "retrieval_document"
    model = "models/gemini-embedding-001"

    try:
        logger.info(f"Generating embedding vector for text excerpt ({len(text)} chars)...")
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: genai.embed_content(
                model=model,
                content=text,
                task_type=task_type
            )
        )
        embedding = response["embedding"]
        logger.info("Successfully generated embedding vector.")

        # Cache query embedding
        if is_query:
            cleaned_query = text.strip().lower()
            # Cache for 10 minutes (600 seconds)
            _query_embedding_cache[cleaned_query] = (embedding, time.time() + 600.0)
            logger.info(f"Cached query embedding for: '{cleaned_query}'")

        return embedding
    except Exception as e:
        logger.error(f"Gemini embedding API call failed: {e}. Returning zero vector.")
        # Return a 768-dimensional zero vector so the application does not crash
        return [0.0] * 768

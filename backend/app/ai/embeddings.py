import google.generativeai as genai
import logging
from app.core.config import settings
from app.ai.gemini import configure_gemini
import asyncio

logger = logging.getLogger(__name__)

async def generate_embedding(text: str, is_query: bool = False) -> list[float]:
    """
    Generates a 768-dimensional vector embedding for the given text using Gemini's embedding model.
    Runs synchronously wrapped inside an async executor to prevent blocking the event loop.
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty for embedding generation.")

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
        return embedding
    except Exception as e:
        logger.error(f"Gemini embedding API call failed: {e}. Returning zero vector.")
        # Return a 768-dimensional zero vector so the application does not crash
        return [0.0] * 768

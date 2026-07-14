from google import genai
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None

def get_gemini_client() -> genai.Client:
    """
    Retrieves or initializes the Google Gemini API Client using environment settings.
    """
    global _client
    if _client is not None:
        return _client

    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key":
        logger.warning(
            "GEMINI_API_KEY is not properly set in environment settings. "
            "Gemini API calls will fail until a valid key is provided."
        )
        _client = genai.Client()
    else:
        try:
            _client = genai.Client(api_key=api_key)
            logger.info("Google Gemini API Client successfully initialized.")
        except Exception as e:
            logger.error(f"Error during Google Gemini SDK initialization: {e}")
            _client = genai.Client()

    return _client

def configure_gemini() -> None:
    """
    Helper function kept for compatibility with other modules.
    Ensures that the Gemini client is initialized.
    """
    get_gemini_client()

# Run configuration when module is loaded
configure_gemini()

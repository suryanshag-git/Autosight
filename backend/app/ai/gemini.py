import google.generativeai as genai
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

def configure_gemini() -> None:
    """
    Initializes the Google Gemini API client configuration using environment settings.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key":
        logger.warning(
            "GEMINI_API_KEY is not properly set in environment settings. "
            "Gemini API calls will fail until a valid key is provided."
        )
    else:
        try:
            genai.configure(api_key=api_key)
            logger.info("Google Gemini API successfully configured.")
        except Exception as e:
            logger.error(f"Error during Google Gemini SDK configuration: {e}")

# Run configuration when module is loaded
configure_gemini()

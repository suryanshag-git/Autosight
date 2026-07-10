import logging
import asyncio
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from app.schemas.insight import InsightExtraction
from app.core.config import settings
from app.ai.gemini import configure_gemini

logger = logging.getLogger(__name__)

class TranscriptExtractor:
    """
    Service responsible for parsing and extracting qualitative research insights
    from raw interview transcripts using Google's Gemini LLM.
    """
    def __init__(self, model_name: str = None) -> None:
        self.model_name = model_name or settings.GEMINI_MODEL
        # Re-ensure Gemini client config is loaded
        configure_gemini()

    async def extract_insights(self, transcript: str, max_retries: int = 3) -> InsightExtraction:
        """
        Sends raw transcript to Google Gemini API to extract qualitative insights.
        Uses structured outputs (response_schema) to guarantee format alignment.
        Implements error handling and exponential backoff retries.

        Args:
            transcript (str): Raw transcript text.
            max_retries (int): Maximum number of retry attempts for API failures.

        Returns:
            InsightExtraction: Validated Pydantic schema object.
        """
        if not transcript or not transcript.strip():
            raise ValueError("Transcript text cannot be empty.")

        system_instruction = (
            "You are an expert qualitative researcher and UX analyst. "
            "Analyze the provided interview transcript and extract qualitative insights. "
            "Ensure the output strictly conforms to the requested schema. "
            "Extract pain points, feature requests, positive feedback, key quotes with context, "
            "user persona description, sentiment (Positive/Neutral/Negative/Mixed), summary, and general themes. "
            "Do not invent facts or extrapolate beyond what is stated in the transcript."
        )

        user_prompt = (
            f"Analyze the following interview transcript and extract the qualitative insights:\n\n"
            f"TRANSCRIPT:\n{transcript}"
        )

        # Configure structured output settings using the InsightExtraction schema
        generation_config = GenerationConfig(
            response_mime_type="application/json",
            response_schema=InsightExtraction,
            temperature=0.0,  # Zero temperature for deterministic extractions
        )

        model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=generation_config,
            system_instruction=system_instruction
        )

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"Extracting insights using Gemini {self.model_name} (Attempt {attempt}/{max_retries})...")
                
                # Trigger async content generation
                response = await model.generate_content_async(user_prompt)
                
                response_text = response.text
                if not response_text:
                    raise ValueError("Gemini returned an empty response body.")

                logger.debug(f"Raw JSON response from model: {response_text}")

                # Validate and parse response into Pydantic schema
                extracted_insights = InsightExtraction.model_validate_json(response_text)
                logger.info("Successfully extracted and validated qualitative insights.")
                return extracted_insights

            except Exception as e:
                logger.warning(f"Attempt {attempt} failed: {e}")
                if attempt == max_retries:
                    logger.error("All extraction retry attempts failed.")
                    raise RuntimeError(f"Failed to extract qualitative insights after {max_retries} attempts: {e}") from e
                
                # Exponential backoff sleep: 2s, 4s, etc.
                backoff_time = 2 ** attempt
                logger.info(f"Retrying in {backoff_time} seconds...")
                await asyncio.sleep(backoff_time)

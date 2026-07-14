import logging
import asyncio
from google.genai import types
from app.schemas.insight import InsightExtraction
from app.core.config import settings
from app.ai.gemini import get_gemini_client

logger = logging.getLogger(__name__)

class TranscriptExtractor:
    """
    Service responsible for parsing and extracting qualitative research insights
    from raw interview transcripts using Google's Gemini LLM.
    """
    def __init__(self, model_name: str = None) -> None:
        self.model_name = model_name or settings.GEMINI_MODEL
        # Re-ensure Gemini client config is loaded
        get_gemini_client()

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
            "You are a Senior Principal UX Researcher and Qualitative Synthesis Expert with 10+ years of experience "
            "in user research, qualitative analysis, and product strategy. Your goal is to perform a strict, "
            "evidence-backed thematic analysis on the user interview transcript.\n\n"
            "STRICT GROUNDING & NEUTRALITY RULES:\n"
            "1. Absolute Evidence Grounding: Every single point must be directly supported by raw statements in the transcript. "
            "Do not introduce outside facts, assume user background, or extrapolate. Never hallucinate.\n"
            "2. Quote Integrity: Every key quote must be exactly verbatim as spoken in the transcript. Do not alter wording, "
            "clean up typos, or rephrase.\n"
            "3. Analytical Neutrality: Maintain a balanced, unbiased research view. If the participant expresses "
            "contradictory opinions (e.g., loving a feature but finding it hard to use), document both sides to capture nuance.\n\n"
            "DETAILED INSTRUCTIONS FOR FIELDS:\n"
            "- pain_points: List distinct friction areas, workflow bottlenecks, or frustrations. Keep them concise but contextual. Example: 'Friction when manually cleaning up transcript speaker tags.'\n"
            "- feature_requests: List explicit product requests or clear capability gaps mentioned. Example: 'Thematic coding tag recommendations.'\n"
            "- positive_feedback: List workflows, tools, or aspects the participant finds valuable. Example: 'Appreciates rapid transcription speeds.'\n"
            "- key_quotes: Verbatim quotes paired with context (the question or context that prompted it).\n"
            "- user_persona: Descriptive archetype summarizing the participant's role, company type, and goals. Example: 'Lead UX Researcher at a mid-sized SaaS company managing high-frequency interview cycles.'\n"
            "- sentiment: Must be one of 'Positive', 'Neutral', 'Negative', or 'Mixed'. Select 'Mixed' if there are substantial contradictions.\n"
            "- summary: A concise, executive-level summary (3-5 sentences) summarizing the interview narrative, key takeaways, and user goals.\n"
            "- themes: List 3-6 high-level qualitative tags mapping the key discussion topics. Example: ['Integration', 'Data Cleaning', 'Thematic Analysis'].\n\n"
            "FEW-SHOT EXAMPLE:\n"
            "--- Transcript ---\n"
            "User: I'm a Product Designer. Uploading files is fast, but I hate the manual tagging. I wish there was an auto-tagger. It's frustrating to tag everything manually.\n"
            "--- Expected Output ---\n"
            "{\n"
            '  "pain_points": ["Manual tagging of files is frustrating and slow"],\n'
            '  "feature_requests": ["Automated tagging helper"],\n'
            '  "positive_feedback": ["File upload speed is fast"],\n'
            '  "key_quotes": [{"quote": "Uploading files is fast, but I hate the manual tagging.", "context": "When describing the upload and tagging workflow."}],\n'
            '  "user_persona": "Product Designer focused on file workflows",\n'
            '  "sentiment": "Mixed",\n'
            '  "summary": "The user is a Product Designer who values upload performance but finds manual file tagging highly frustrating. They request auto-tagging functions to streamline their workflow.",\n'
            '  "themes": ["File Upload", "Tagging Workflow", "Automation"]\n'
            "}"
        )


        user_prompt = (
            f"Analyze the following interview transcript and extract the qualitative insights:\n\n"
            f"TRANSCRIPT:\n{transcript}"
        )

        client = get_gemini_client()

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"Extracting insights using Gemini {self.model_name} (Attempt {attempt}/{max_retries})...")
                
                # Trigger async content generation
                response = await client.aio.models.generate_content(
                    model=self.model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.0,
                        response_mime_type="application/json",
                        response_schema=InsightExtraction,
                    )
                )
                
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

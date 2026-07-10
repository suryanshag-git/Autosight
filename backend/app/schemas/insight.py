from typing import List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.base import BaseSchema

class KeyQuote(BaseModel):
    quote: str = Field(
        ...,
        description="The exact verbatim quote from the transcript.",
        examples=["I really struggle with importing audio files from Zoom."]
    )
    context: str = Field(
        ...,
        description="The surrounding context or question that prompted this quote.",
        examples=["When asked about the upload workflow issues."]
    )

class InsightExtraction(BaseModel):
    """
    Strict schema representing the structured insights extracted from an interview transcript.
    Used directly for Gemini structured JSON generation.
    """
    pain_points: List[str] = Field(
        default_factory=list,
        description="Core difficulties, friction points, or frustrations expressed by the user.",
        examples=[["Struggles with manual transcription", "Hard to find previous notes"]]
    )
    feature_requests: List[str] = Field(
        default_factory=list,
        description="Explicit or implicit feature requests or enhancements suggested by the user.",
        examples=[["Auto-tagging based on themes", "Integration with Slack"]]
    )
    positive_feedback: List[str] = Field(
        default_factory=list,
        description="Specific aspects of their current workflow or tool that the user likes.",
        examples=[["Fast processing time", "Accurate baseline transcription"]]
    )
    key_quotes: List[KeyQuote] = Field(
        default_factory=list,
        description="Verbatim key quotes with context illustrating critical feedback."
    )
    user_persona: str = Field(
        ...,
        description="Descriptive name or summary profile of the user based on their role and behavior.",
        examples=["Lead UX Researcher at a mid-sized SaaS company"]
    )
    sentiment: str = Field(
        ...,
        description="Overall sentiment of the user interview (e.g., Positive, Neutral, Negative, Mixed).",
        examples=["Mixed"]
    )
    summary: str = Field(
        ...,
        description="An executive summary summarizing the interview highlights and key outcomes.",
        examples=["The user runs 5-10 interviews weekly. They love the speed of the tool but need better tagging options."]
    )
    themes: List[str] = Field(
        default_factory=list,
        description="General themes or topics associated with this interview.",
        examples=[["Usability", "Integrations", "Pricing"]]
    )

class InsightCreate(BaseSchema):
    """
    Schema for creating/saving an Insight.
    """
    interview_id: UUID = Field(..., description="ID of the interview this insight belongs to.")
    data: InsightExtraction = Field(..., description="The structured insight extraction details.")

class InsightResponse(BaseSchema):
    """
    Schema returning the stored insight from database.
    """
    id: UUID = Field(..., description="Unique database ID of the insight.")
    interview_id: UUID = Field(..., description="Associated interview ID.")
    data: InsightExtraction = Field(..., description="The structured insight extraction details.")
    created_at: datetime = Field(..., description="Timestamp of when this insight was created.")
    updated_at: datetime = Field(..., description="Timestamp of when this insight was last updated.")

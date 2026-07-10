from datetime import datetime, timezone
from uuid import UUID
from pydantic import BaseModel, Field
from app.schemas.insight import InsightExtraction

class InsightModel(BaseModel):
    """
    Pydantic database model representing the 'insights' table/document.
    Separates database schemas from API-facing request/response schemas.
    """
    id: UUID = Field(..., description="Unique database primary key for the insight.")
    interview_id: UUID = Field(..., description="The ID of the interview this insight belongs to.")
    data: InsightExtraction = Field(..., description="The structured insight details extracted from the interview.")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of when the database record was created."
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of when the database record was last updated."
    )

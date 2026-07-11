from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.interview import InterviewCreate, InterviewResponse
from app.schemas.insight import InsightResponse
from app.services.interview_service import InterviewProcessingService

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Evidence-backed AI tool for qualitative research (interview transcript analysis)."
)

# CORS middleware configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

class InterviewProcessingResultSchema(BaseModel):
    interview: InterviewResponse
    insight: InsightResponse

@app.get("/health", tags=["Health Check"])
def health_check():
    """
    Simple health check endpoint to verify backend service status.
    """
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "api_version": settings.API_V1_STR
    }

@app.post(
    f"{settings.API_V1_STR}/interviews",
    response_model=InterviewProcessingResultSchema,
    tags=["Interviews"],
    status_code=201
)
async def process_new_interview(payload: InterviewCreate):
    """
    Accepts an interview transcript, saves it to Supabase database, triggers
    AI qualitative insight extraction (with fallback), and returns the results.
    """
    try:
        service = InterviewProcessingService()
        interview, insight = await service.process_interview(payload)
        return {
            "interview": interview,
            "insight": insight
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process interview: {str(e)}")


from uuid import UUID
from app.db.repositories.interview_repository import InterviewRepository
from app.db.repositories.insight_repository import InsightRepository
from app.ai.embeddings import generate_embedding

class SearchRequest(BaseModel):
    query: str
    limit: int = 5
    threshold: float = 0.3

class SearchResultItem(BaseModel):
    interview: InterviewResponse
    similarity: float
    user_persona: str
    summary: str
    themes: list[str]
    key_quotes: list[dict]

@app.post(
    f"{settings.API_V1_STR}/search",
    response_model=list[SearchResultItem],
    tags=["Search"]
)
async def search_interviews(payload: SearchRequest):
    """
    Performs semantic vector search across interview transcripts.
    Generates embedding for query, runs similarity check, and returns highlights.
    """
    try:
        # Generate query embedding
        query_embedding = await generate_embedding(payload.query, is_query=True)
        
        # Query repository
        interview_repo = InterviewRepository()
        matching_interviews = await interview_repo.search_similarity(
            query_embedding=query_embedding,
            limit=payload.limit,
            threshold=payload.threshold
        )
        
        insight_repo = InsightRepository()
        results = []
        
        for item in matching_interviews:
            interview_id = UUID(item["id"])
            # Load associated insights
            insight = await insight_repo.get_by_interview_id(interview_id)
            
            # Format interview response
            interview_res = InterviewResponse(
                id=interview_id,
                title=item["title"],
                transcript=item["transcript"],
                participant_info=item["participant_info"],
                date=item["date"],
                metadata=item["metadata"],
                created_at=item["created_at"],
                updated_at=item["updated_at"]
            )

            
            # If insights found, populate fields
            user_persona = ""
            summary = ""
            themes = []
            key_quotes = []
            
            if insight and insight.data:
                user_persona = insight.data.user_persona
                summary = insight.data.summary
                themes = insight.data.themes
                key_quotes = [q.model_dump() for q in insight.data.key_quotes]
                
            results.append(SearchResultItem(
                interview=interview_res,
                similarity=item["similarity"],
                user_persona=user_persona,
                summary=summary,
                themes=themes,
                key_quotes=key_quotes
            ))
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

from app.ai.clustering import ThemeClusteringService, ClusteredTheme

@app.get(
    f"{settings.API_V1_STR}/themes",
    response_model=list[ClusteredTheme],
    tags=["Themes"]
)
async def get_clustered_themes():
    """
    Exposes theme clusters computed across all uploaded interview transcripts.
    Uses in-memory cache to guarantee sub-millisecond response latency.
    """
    try:
        service = ThemeClusteringService()
        themes = await service.get_clustered_themes()
        return themes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Theme clustering failed: {str(e)}")




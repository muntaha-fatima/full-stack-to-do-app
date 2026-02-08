from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/test-cors", tags=["test"])
async def test_cors():
    """
    Test endpoint to verify CORS is working properly.
    """
    return {"message": "CORS is working!"}
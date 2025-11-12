from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_settings
from app.routers import recruitment, candidates, interview

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Candidly API",
    description="AI-powered interview platform backend",
    version="1.0.0"
)

# Get settings
settings = get_settings()

# Configure CORS
origins = settings.cors_origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recruitment.router)
app.include_router(candidates.router)
app.include_router(interview.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Candidly API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

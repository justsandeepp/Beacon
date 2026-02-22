# Setup Instructions - PS21 Backend

This guide provides step-by-step instructions to set up the PS21 BRD Generation Agent backend locally.

## 📋 Prerequisites

-   **Python**: 3.9 or higher
-   **PostgreSQL**: Local instance or hosted (e.g., Supabase, RDS)
-   **API Keys**:
    -   Groq API Key (for LLM generation)
    -   Slack App Token & Bot User OAuth Token (for Slack integration)
    -   Google Cloud Credentials (if using Firestore/Gmail)

## 🛠 Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ps21-consolidated/backend
```

### 2. Create a Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory and add the following:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/brd_agent

# LLM Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-70b-8192

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token

# Google Cloud (Optional)
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account.json

# API Settings
DEBUG=True
PORT=8000
```

### 5. Initialize the Database
Ensure your PostgreSQL server is running and the database specified in `DATABASE_URL` exists. The system will initialize tables automatically on the first run, or you can run:

```bash
python scripts/init_db.py  # If available
```

## 🚀 Running the Application

### Start the FastAPI Server
```bash
uvicorn api.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
You can access the interactive documentation (Swagger UI) at `http://localhost:8000/docs`.

## 🧪 Testing
To run the automated tests:
```bash
pytest
```

## 📂 Project Modules

-   **Noise Filter**: Run `python "Noise filter module/main.py"` for standalone testing of the noise classification pipeline.
-   **BRD Pipeline**: Run `python brd_module/main.py` to trigger a sample BRD generation flow.

---
> [!NOTE]  
> If you encounter `psycopg2` installation issues on Windows, ensure you have the PostgreSQL dev headers installed, or use `psycopg2-binary`.

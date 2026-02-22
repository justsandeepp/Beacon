# PS21 – Business Requirements Document (BRD) Generation Agent

An AI-powered system that generates professional Business Requirements Documents (BRDs) by ingesting, filtering, and synthesizing information from real-world communication sources such as Slack, emails, meeting transcripts, and documents.

## 🚀 Overview

Unlike typical AI document generators, this system behaves like a senior business analyst working with messy reality. It focuses on **trustworthy, explainable BRD generation**, not just impressive prose.

### The Pipeline
1.  **Ingest**: Collect fragmented information from multiple sources (Slack, Email, Files).
2.  **Filter**: Explicitly classify and suppress noise without silent data loss.
3.  **Synthesize**: Extract signals and build structured knowledge.
4.  **Compose**: Generate a structured, attributed BRD with human-in-the-loop control.

## ✨ Key Features

-   **Multi-Source Ingestion**: Supported integrations with Slack (read-only) and simulated uploads for Email/Meetings/Docs.
-   **Noise Filtering & Signal Extraction**: Intelligent classification into Requirements, Decisions, Stakeholder Feedback, and Timelines.
-   **Attributed Knowledge Store (AKS)**: Every piece of information in the BRD is linked back to its original source.
-   **Multi-Agent Generation**: Dedicated agents for each BRD section (Executive Summary, Functional Requirements, etc.) to ensure accountability.
-   **Validation & Review**: Automated rule-based and AI semantic validation to flag gaps and contradictions.
-   **Human-in-the-Loop**: Users can review filtered items, override classifications, and lock manually edited sections.

## 🛠 Tech Stack

-   **Backend**: Python, FastAPI, Uvicorn
-   **AI/LLM**: Groq (Llama 3), Google Generative AI
-   **Database**: PostgreSQL
-   **Messaging/Integration**: Slack SDK, Google Auth
-   **Document Generation**: Python-Docx, WeasyPrint
-   **Frontend**: Next.js / Tailwind CSS (Conceptual/UI Design)

## 📂 Project Structure

-   `/api`: FastAPI routes and core application logic.
-   `/Integration Module`: Connectors for Slack, Gmail, and file ingestion.
-   `/Noise filter module`: Heuristic and LLM-based noise classification and signal extraction.
-   `/brd_module`: Multi-agent pipeline for BRD generation, validation, and export.

## 📄 Documentation

-   [Complete Project Doc](CompleteProjectDoc.md): Detailed project vision and requirements.
-   [BRD Design Doc](BRD_designDoc.md): Comprehensive UI/UX and component specifications.
-   [SETUP.md](SETUP.md): Instructions for local setup and deployment.

---
*Built for Hackfest 2.0 - PS21*

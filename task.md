TASK BREAKDOWN FOR AN AUTONOMOUS CODING AGENT

This is a step-by-step execution plan.
Each step should be completed fully before moving on.

PHASE 1 — BACKEND FOUNDATION
Task 1: Project Skeleton

Create FastAPI project with:

core/ (config, logging, security)

db/ (engine, session, models)

schemas/ (Pydantic)

api/ (routes)

agents/

services/

workers/

Task 2: Configuration System

Environment-based settings class

Load secrets safely

Separate dev vs prod configs

PHASE 2 — DATABASE & AUTH
Task 3: Database Models

Create SQLAlchemy models for:

User

Profile

DSAQuestion

Submission

Review

LearningMemory

Include timestamps, foreign keys, and indexes.

Task 4: Alembic Migrations

Initialize Alembic

Generate first migration

Ensure reversible migrations

Task 5: Clerk Auth Integration

JWT verification dependency

Auto-create user on first request

Protect all core endpoints

PHASE 3 — CORE INTELLIGENCE (REVIEW PIPELINE)
Task 6: Reviewer Agent

Prompt template (versioned)

JSON-only output

Extract:

Score

Strengths

Weaknesses

Thinking style

Concept gaps

Task 7: /review Endpoint

Validate input

Store submission

Call Reviewer Agent

Persist review

Return structured response

PHASE 4 — BACKGROUND INTELLIGENCE
Task 8: Background Agent

Async worker setup

Summarize last N reviews

Update profile trends

Store long-term memory

PHASE 5 — PERSONALIZED TEACHING
Task 9: Profile Agent

Maintain evolving learner profile

Merge new insights safely

Avoid overwriting useful history

Task 10: Tutor Agent + /tutor

Profile-aware prompting

Adaptive depth

Hint-based teaching

PHASE 6 — FRONTEND
Task 11: Next.js Setup

Clerk auth

API client

Protected routes

Task 12: Review Flow UI

Code editor

Submission

Review visualization

Task 13: Tutor UI

Conversational teaching interface

Context-aware hints

PHASE 7 — MEMORY & DEPLOYMENT
Task 14: Embeddings Memory

Store semantic summaries

pgvector integration

Task 15: Deployment

Dockerize backend

Deploy backend

Deploy frontend
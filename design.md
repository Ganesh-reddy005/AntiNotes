# System Design Document: AntiNotes
## AI-Powered Self-Aware Developer Mentor

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

AntiNotes follows a **Micro-Agent Architecture** orchestrated by **LangGraph** on a serverless AWS backend. The system employs three specialized agents that work in parallel to deliver personalized learning experiences and automated documentation.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│                  (Next.js + TailwindCSS)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/WSS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS API Gateway                            │
│              (REST + WebSocket for Streaming)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Orchestrator (FastAPI + LangGraph)                 │
│                    [AWS Lambda Container]                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Profiler   │  │    Tutor     │  │    Scribe    │        │
│  │    Agent     │  │    Agent     │  │    Agent     │        │
│  │ (The Memory) │  │ (The Teacher)│  │ (The Writer) │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│   MongoDB       │  │ Amazon Bedrock   │  │  Amazon S3   │
│  (User Profiles)│  │ - Claude Sonnet  │  │ (PDF Storage)│
│  (Chat History) │  │ - Titan Embed    │  │              │
└─────────────────┘  └────────┬─────────┘  └──────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Qdrant Vector   │
                     │    Database      │
                     │  (RAG Context)   │
                     └──────────────────┘
```

### 1.2 Design Principles

1. **Agent Autonomy:** Each agent operates independently with clear responsibilities
2. **Parallel Execution:** Tutor and Scribe agents run concurrently for speed
3. **Stateful Orchestration:** LangGraph maintains conversation state and context
4. **Serverless Scalability:** AWS Lambda auto-scales based on demand
5. **Offline-First:** Generated PDFs enable learning without constant connectivity

---

## 2. Component Architecture

### 2.1 The Orchestrator (LangGraph State Machine)

**Role:** Central router that analyzes user queries and coordinates agent execution

**State Management:**
```python
class ConversationState(TypedDict):
    messages: List[Message]           # Chat history
    user_context: UserProfile         # Current user profile
    current_notes: CheatsheetData     # Session cheatsheet
    agent_outputs: Dict[str, Any]     # Agent responses
    metadata: SessionMetadata         # Timestamps, session_id
```

**Decision Logic:**
- Routes every user message to Tutor Agent
- Triggers Profiler Agent when quest/topic completion is detected
- Activates Scribe Agent in parallel with Tutor
- Handles error recovery and fallback responses

**Quest Completion Detection:**
```python
def detect_quest_completion(message: str, conversation_history: List[Message]) -> bool:
    completion_signals = [
        "next", "got it", "understood", "move on", "clear now",
        "makes sense", "I see", "okay let's continue"
    ]
    
    topic_change_signals = [
        "now explain", "what about", "how do I", "can you teach"
    ]
    
    # Check for explicit completion signals
    if any(signal in message.lower() for signal in completion_signals):
        return True
    
    # Check for topic change after extended discussion (5+ messages on same topic)
    if len(conversation_history) >= 5:
        current_topic = extract_topic(message)
        previous_topic = extract_topic(conversation_history[-2].content)
        if current_topic != previous_topic:
            return True
    
    return False

workflow = StateGraph(ConversationState)
workflow.add_node("tutor", tutor_agent)
workflow.add_node("scribe", scribe_agent)
workflow.add_node("profiler", profiler_agent)
workflow.add_conditional_edges("tutor", detect_quest_completion, {
    True: "profiler",
    False: "scribe"
})
```

---

## 3. Agent Design

### 3.1 Profiler Agent (The Memory)

**Purpose:** Builds and maintains the "Living User Profile" with spaced repetition intelligence

**Trigger Conditions:**
- When user completes a problem/concept and moves to next quest
- When user demonstrates mastery or struggle with a specific topic
- After completing onboarding assessment
- When user explicitly requests profile update
- **When revision is needed based on Ebbinghaus forgetting curve**

**Revision Loop Intelligence:**
The Profiler Agent implements spaced repetition using the Ebbinghaus forgetting curve to prevent knowledge decay:

```python
def calculate_revision_schedule(concept: str, mastery_level: float, last_reviewed: datetime) -> datetime:
    """
    Calculate when a concept needs revision based on forgetting curve
    """
    # Base intervals (in days) based on mastery level
    intervals = {
        0.3: 1,    # Struggling - review tomorrow
        0.5: 3,    # Learning - review in 3 days  
        0.7: 7,    # Good - review in 1 week
        0.9: 14,   # Mastered - review in 2 weeks
        1.0: 30    # Expert - review in 1 month
    }
    
    base_interval = intervals.get(mastery_level, 7)
    
    # Apply forgetting curve: R = e^(-t/S) where S is memory strength
    memory_strength = mastery_level * 10  # Convert to days
    days_since_review = (datetime.now() - last_reviewed).days
    retention_rate = math.exp(-days_since_review / memory_strength)
    
    # If retention drops below 70%, schedule immediate revision
    if retention_rate < 0.7:
        return datetime.now()
    
    return last_reviewed + timedelta(days=base_interval)

def detect_prerequisite_learning(new_concept: str, user_profile: dict) -> List[str]:
    """
    Detect when learning new concept requires revision of prerequisites
    """
    concept_dependencies = {
        "Async/Await": ["Promises", "Callbacks", "Event Loop"],
        "React Hooks": ["JavaScript Functions", "Closures", "State Management"],
        "Dynamic Programming": ["Recursion", "Arrays", "Time Complexity"],
        "System Design": ["Databases", "APIs", "Caching", "Load Balancing"]
    }
    
    prerequisites = concept_dependencies.get(new_concept, [])
    needs_revision = []
    
    for prereq in prerequisites:
        if prereq in user_profile.get('learned_concepts', {}):
            concept_data = user_profile['learned_concepts'][prereq]
            next_revision = calculate_revision_schedule(
                prereq, 
                concept_data['mastery_level'], 
                concept_data['last_reviewed']
            )
            
            # If revision is due or concept mastery is low, add to revision list
            if next_revision <= datetime.now() or concept_data['mastery_level'] < 0.7:
                needs_revision.append(prereq)
    
    return needs_revision
```

**Quest Completion Detection:**
- User says "next", "got it", "understood", "move on"
- User asks about a different topic after extended discussion
- User successfully explains a concept back to the AI
- Session topic change detected by the orchestrator

**Input:**
- Complete conversation thread for the completed quest/topic
- Current user profile with concept mastery levels and timestamps
- Performance indicators (time spent, questions asked, errors made)
- Success signals (correct explanations, code implementations)
- **Prerequisite concepts that may need revision**

**Processing Logic:**
1. Analyze entire quest conversation for learning outcomes
2. Determine concept mastery level (0.0-1.0 scale)
3. Calculate next revision date using forgetting curve
4. Check if current learning requires prerequisite revision
5. Update skill progression and learning patterns
6. Schedule automatic revision reminders

**Output Schema:**
```json
{
  "quest_completed": "JavaScript Closures",
  "mastery_level": 0.85,
  "next_revision_date": "2026-02-15T10:00:00Z",
  "profile_updates": {
    "skill_level": "Intermediate → Advanced",
    "concepts_mastered": {
      "Closures": {
        "mastery_level": 0.85,
        "learned_date": "2026-02-01T10:30:00Z",
        "last_reviewed": "2026-02-01T10:30:00Z",
        "next_revision": "2026-02-15T10:00:00Z",
        "revision_count": 0
      }
    },
    "weak_concepts": ["Removed: Closures"],
    "learning_velocity": 0.75
  },
  "revision_needed": [
    {
      "concept": "JavaScript Functions",
      "reason": "Prerequisite for Closures, mastery dropped to 0.6",
      "urgency": "high",
      "last_reviewed": "2026-01-20T10:00:00Z"
    }
  ],
  "next_recommendations": [
    "Higher-Order Functions",
    "Async/Await Patterns"
  ],
  "reasoning": "User successfully implemented closures. However, function fundamentals need revision before advancing to higher-order functions."
}
```

**Amazon Bedrock Integration:**
- Model: Claude 3 Sonnet
- Prompt: Structured analysis with few-shot examples
- Temperature: 0.3 (for consistency)

### 3.2 Tutor Agent (The Teacher)

**Purpose:** Generates personalized, context-aware explanations with intelligent revision prompts

**Trigger:** On every user query

**Input:**
- User question
- User profile (skill level, learning style, weak concepts)
- RAG context from Qdrant (relevant documentation)
- Previous conversation context
- **Revision schedule and prerequisite analysis**

**Revision Integration:**
Before answering any new concept, the Tutor Agent checks:
1. **Prerequisite Check:** Does this new topic require prior knowledge?
2. **Forgetting Curve Analysis:** Are any prerequisites due for revision?
3. **Contextual Revision:** Weave revision into current explanation naturally

**Processing Pipeline:**
```
User Query → Profile Retrieval → Prerequisite Analysis → 
Revision Check → Vector Search (RAG) → Prompt Construction → 
Bedrock API Call → Stream Response with Revision Hooks
```

**Revision Integration Examples:**

*Scenario 1: Learning React Hooks (Prerequisites: Functions, Closures)*
```
User: "Explain React useState hook"

Tutor Response: "Before we dive into useState, let me quickly refresh your memory on closures since they're crucial here. Remember how closures let functions 'remember' variables from their outer scope? 

[Mini revision of closures with example]

Now, useState works similarly - it 'closes over' the state value..."
```

*Scenario 2: Scheduled Revision Reminder*
```
User: "What should I learn next?"

Tutor Response: "Great question! I notice it's been 2 weeks since you learned Promises, and based on the forgetting curve, you might benefit from a quick review before we tackle async/await. 

Would you like a 5-minute refresher on Promises, or shall we jump straight into async/await?"
```

**Personalization Strategy:**
- **For Beginners:** Always include prerequisite revision
- **For Visual Learners:** Use diagrams to show concept connections
- **For Hinglish Users:** Code-switch naturally during revision
- **Based on Mastery:** Adjust revision depth (quick refresh vs. deep dive)

**Revision Prompt Templates:**
```python
revision_prompts = {
    "prerequisite_refresh": """
    Before explaining {new_concept}, briefly review {prerequisite} because:
    - User learned it {days_ago} days ago
    - Current mastery level: {mastery_level}
    - It's essential for understanding {new_concept}
    
    Keep revision to 2-3 sentences with a quick example.
    """,
    
    "scheduled_revision": """
    User's forgetting curve indicates {concept} needs revision:
    - Learned: {learned_date}
    - Last reviewed: {last_reviewed}  
    - Current retention estimate: {retention_rate}%
    
    Offer a friendly revision opportunity before continuing.
    """,
    
    "contextual_revision": """
    While explaining {current_topic}, naturally weave in revision of:
    {related_concepts} to strengthen connections and prevent forgetting.
    """
}
```
- Previous conversation context

**Processing Pipeline:**
```
User Query → Profile Retrieval → Vector Search (RAG) → 
Prompt Construction → Bedrock API Call → Stream Response
```

**Personalization Strategy:**
- **For Beginners:** Use analogies, avoid jargon, step-by-step breakdowns
- **For Visual Learners:** Include diagrams descriptions, real-world metaphors
- **For Hinglish Users:** Code-switch naturally, use familiar examples

**Example Prompt Template:**
```
You are tutoring {user_name}, a {skill_level} developer who learns best through {learning_style}.
They struggle with: {weak_concepts}.

User Question: {query}

Relevant Context: {rag_context}

Provide an explanation that:
1. Uses analogies from {cultural_context}
2. Avoids overwhelming them with {avoid_topics}
3. Responds in {language_preference}
```

**Amazon Bedrock Configuration:**
- Model: Claude 3 Sonnet (for reasoning quality)
- Streaming: Enabled (for perceived speed)
- Max Tokens: 2048
- Temperature: 0.7 (for natural conversation)

**RAG Implementation:**
- Embed user query using Titan Embeddings
- Search Qdrant for top 5 relevant chunks
- Inject context into prompt with source citations
- Fallback to general knowledge if no relevant docs

### 3.3 Scribe Agent (The Writer)

**Purpose:** Automatically extracts and structures key information into cheatsheets

**Trigger:** Runs in parallel with Tutor Agent

**Input:**
- Tutor Agent's response (before streaming to user)
- Current session's cheatsheet structure
- User's annotation preferences

**Extraction Logic:**
```python
def extract_content(tutor_response: str) -> CheatsheetBlock:
    # 1. Identify code blocks with syntax highlighting
    code_snippets = extract_code_with_language(tutor_response)
    
    # 2. Extract definitions (pattern: "X is...")
    definitions = extract_definitions(tutor_response)
    
    # 3. Capture analogies and mental models
    analogies = extract_analogies(tutor_response)
    
    # 4. Identify warnings and best practices
    warnings = extract_warnings(tutor_response)
    
    return CheatsheetBlock(
        timestamp=now(),
        topic=infer_topic(tutor_response),
        content={
            "code": code_snippets,
            "definitions": definitions,
            "analogies": analogies,
            "warnings": warnings
        }
    )
```

**Output Schema:**
```json
{
  "session_id": "sess_abc123",
  "blocks": [
    {
      "id": "block_1",
      "timestamp": "2026-02-01T10:30:00Z",
      "topic": "JavaScript Closures",
      "content": {
        "definition": "A closure is a function that remembers variables from its outer scope",
        "code": {
          "language": "javascript",
          "snippet": "function outer() { let count = 0; return function() { count++; } }",
          "explanation": "The inner function 'closes over' the count variable"
        },
        "analogy": "Like a backpack that carries variables wherever the function goes",
        "key_points": [
          "Closures enable data privacy",
          "Common in callbacks and event handlers"
        ]
      }
    }
  ]
}
```

**Storage:**
- Real-time updates to MongoDB (session collection)
- Indexed by session_id and user_id
- Supports incremental updates (append-only)

---

## 4. Data Architecture

### 4.1 MongoDB Schema Design

**Collection: users**
```json
{
  "_id": "user_67890",
  "email": "rahul@example.com",
  "name": "Rahul Kumar",
  "created_at": "2026-01-15T08:00:00Z",
  "credits": 150,
  "subscription": {
    "tier": "free",
    "expires_at": null
  },
  "profile": {
    "skill_level": "Intermediate",
    "learning_style": "Visual",
    "language_pref": "Hinglish",
    "learned_concepts": {
      "JavaScript Functions": {
        "mastery_level": 0.6,
        "learned_date": "2026-01-10T10:00:00Z",
        "last_reviewed": "2026-01-20T10:00:00Z",
        "next_revision": "2026-02-03T10:00:00Z",
        "revision_count": 2,
        "forgetting_rate": 0.15
      },
      "Closures": {
        "mastery_level": 0.85,
        "learned_date": "2026-02-01T10:30:00Z",
        "last_reviewed": "2026-02-01T10:30:00Z",
        "next_revision": "2026-02-15T10:00:00Z",
        "revision_count": 0,
        "forgetting_rate": 0.08
      }
    },
    "weak_concepts": [
      {
        "topic": "Dynamic Programming",
        "identified_at": "2026-01-20T10:00:00Z",
        "improvement_score": 0.3,
        "needs_revision": true
      }
    ],
    "strong_concepts": ["REST APIs", "React Hooks"],
    "interests": ["Web Development", "System Design"],
    "onboarding_completed": true,
    "revision_preferences": {
      "frequency": "moderate",
      "reminder_style": "contextual",
      "max_revisions_per_session": 2
    }
  },
  "usage_stats": {
    "total_sessions": 45,
    "total_messages": 320,
    "pdfs_generated": 8,
    "concepts_revised": 15,
    "last_active": "2026-02-01T09:00:00Z"
  }
}
```

**Collection: sessions**
```json
{
  "_id": "sess_abc123",
  "user_id": "user_67890",
  "started_at": "2026-02-01T10:00:00Z",
  "last_updated": "2026-02-01T10:45:00Z",
  "status": "active",
  "messages": [
    {
      "role": "user",
      "content": "Explain async/await in JavaScript",
      "timestamp": "2026-02-01T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Async/await is syntactic sugar...",
      "timestamp": "2026-02-01T10:30:15Z",
      "metadata": {
        "model": "claude-3-sonnet",
        "tokens": 450,
        "latency_ms": 1200
      }
    }
  ],
  "cheatsheet": {
    "blocks": [...],  // As defined in Scribe Agent output
    "pdf_generated": false,
    "pdf_url": null
  }
}
```

**Collection: credits_transactions**
```json
{
  "_id": "txn_xyz789",
  "user_id": "user_67890",
  "type": "purchase",
  "amount": 100,
  "price_paid": 49.00,
  "currency": "INR",
  "timestamp": "2026-01-25T14:00:00Z",
  "payment_method": "UPI"
}
```

### 4.2 Qdrant Vector Database

**Collection: documentation_chunks**

**Schema:**
```python
{
  "id": "chunk_12345",
  "vector": [0.123, -0.456, ...],  # 1536 dimensions (Titan Embeddings)
  "payload": {
    "text": "Async functions in JavaScript return promises...",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/...",
    "topic": "JavaScript",
    "subtopic": "Async/Await",
    "difficulty": "Intermediate",
    "language": "en"
  }
}
```

**Indexing Strategy:**
- HNSW index for fast approximate search
- Cosine similarity metric
- Chunk size: 512 tokens with 50-token overlap
- Metadata filtering by topic and difficulty

**Search Query:**
```python
results = qdrant_client.search(
    collection_name="documentation_chunks",
    query_vector=embed_query(user_question),
    limit=5,
    query_filter={
        "must": [
            {"key": "difficulty", "match": {"value": user_skill_level}}
        ]
    }
)
```

---

## 5. API Design

### 5.1 REST Endpoints

**Base URL:** `https://api.antinotes.ai/v1`

#### POST `/auth/signup`
```json
Request:
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "Rahul"
}

Response:
{
  "user_id": "user_67890",
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

#### POST `/chat/stream`
**Description:** Main chat interaction with streaming response

```json
Request:
{
  "message": "Explain closures in JavaScript",
  "user_id": "user_67890",
  "session_id": "sess_abc123"  // Optional, creates new if not provided
}

Response: (Server-Sent Events)
data: {"type": "start", "session_id": "sess_abc123"}
data: {"type": "token", "content": "A"}
data: {"type": "token", "content": " closure"}
data: {"type": "token", "content": " is..."}
data: {"type": "cheatsheet_update", "block_id": "block_1"}
data: {"type": "end", "metadata": {"tokens": 450, "latency_ms": 1200}}
```

#### GET `/profile/{user_id}/revisions`
**Description:** Get concepts due for revision based on forgetting curve

```json
Response:
{
  "user_id": "user_67890",
  "revisions_due": [
    {
      "concept": "JavaScript Functions",
      "mastery_level": 0.6,
      "days_since_review": 12,
      "estimated_retention": 0.65,
      "urgency": "high",
      "reason": "Prerequisite for upcoming React Hooks lesson"
    },
    {
      "concept": "Promises",
      "mastery_level": 0.8,
      "days_since_review": 14,
      "estimated_retention": 0.72,
      "urgency": "medium",
      "reason": "Scheduled revision based on forgetting curve"
    }
  ],
  "revision_stats": {
    "total_concepts_learned": 23,
    "concepts_due_revision": 2,
    "average_retention_rate": 0.78,
    "next_revision_date": "2026-02-03T10:00:00Z"
  }
}
```

#### POST `/profile/{user_id}/revision-complete`
**Description:** Mark a concept as revised and update mastery level

```json
Request:
{
  "concept": "JavaScript Functions",
  "performance_score": 0.85,
  "time_spent_minutes": 15,
  "revision_type": "contextual"
}

Response:
{
  "concept_updated": true,
  "new_mastery_level": 0.75,
  "next_revision_date": "2026-02-17T10:00:00Z",
  "retention_improvement": 0.15,
  "message": "Great job! Your understanding of JavaScript Functions has improved."
}
```

#### POST `/profile/{user_id}/onboarding`
**Description:** Submit onboarding assessment results

```json
Request:
{
  "skill_level": "Intermediate",
  "learning_style": "Visual",
  "interests": ["Web Development", "System Design"],
  "language_pref": "Hinglish"
}

Response:
{
  "profile_created": true,
  "recommendations": [
    "Start with React fundamentals",
    "Practice system design patterns"
  ]
}
```

#### GET `/sessions/{session_id}/cheatsheet`
**Description:** Retrieve cheatsheet for a session

```json
Response:
{
  "session_id": "sess_abc123",
  "created_at": "2026-02-01T10:00:00Z",
  "blocks": [
    {
      "id": "block_1",
      "topic": "JavaScript Closures",
      "content": {...}
    }
  ],
  "pdf_available": false
}
```

#### POST `/export/pdf`
**Description:** Generate and export cheatsheet as PDF

```json
Request:
{
  "session_id": "sess_abc123",
  "user_id": "user_67890",
  "options": {
    "include_code_highlighting": true,
    "include_toc": true,
    "watermark": true
  }
}

Response:
{
  "pdf_url": "https://antinotes-pdfs.s3.amazonaws.com/...",
  "expires_at": "2026-02-08T10:00:00Z",
  "credits_deducted": 10,
  "remaining_credits": 140
}
```

#### POST `/credits/purchase`
**Description:** Purchase credit pack

```json
Request:
{
  "user_id": "user_67890",
  "pack_id": "starter_pack",
  "payment_method": "upi",
  "payment_details": {...}
}

Response:
{
  "transaction_id": "txn_xyz789",
  "credits_added": 100,
  "total_credits": 240,
  "amount_paid": 49.00,
  "currency": "INR"
}
```

### 5.2 WebSocket Protocol

**Endpoint:** `wss://api.antinotes.ai/v1/ws`

**Connection:**
```json
{
  "type": "connect",
  "auth_token": "jwt_token_here",
  "session_id": "sess_abc123"
}
```

**Message Types:**
- `user_message`: User sends a question
- `assistant_token`: Streaming response token
- `cheatsheet_update`: New content added to cheatsheet
- `profile_update`: User profile was updated
- `error`: Error occurred during processing

---

## 6. AWS Services Integration

### 6.1 Compute Layer

**AWS Lambda (Container Image)**
- **Runtime:** Python 3.11
- **Framework:** FastAPI with Mangum adapter
- **Memory:** 2048 MB
- **Timeout:** 30 seconds
- **Concurrency:** 1000 concurrent executions
- **Cold Start Optimization:** Provisioned concurrency during peak hours

**Container Image:**
```dockerfile
FROM public.ecr.aws/lambda/python:3.11

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ${LAMBDA_TASK_ROOT}/app/

CMD ["app.main.handler"]
```

### 6.2 AI/ML Services

**Amazon Bedrock**

**Models Used:**
1. **Claude 3 Sonnet** (Tutor & Profiler Agents)
   - Model ID: `anthropic.claude-3-sonnet-20240229-v1:0`
   - Use Case: Conversational responses, profile analysis
   - Pricing: $3 per 1M input tokens, $15 per 1M output tokens

2. **Titan Embeddings G1** (RAG Pipeline)
   - Model ID: `amazon.titan-embed-text-v1`
   - Use Case: Query and document embeddings
   - Dimensions: 1536
   - Pricing: $0.10 per 1M tokens

**Invocation Example:**
```python
import boto3

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

response = bedrock.invoke_model_with_response_stream(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    body=json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    })
)

for event in response['body']:
    chunk = json.loads(event['chunk']['bytes'])
    if chunk['type'] == 'content_block_delta':
        yield chunk['delta']['text']
```

### 6.3 Storage Services

**Amazon S3**
- **Bucket:** `antinotes-pdfs-prod`
- **Purpose:** Store generated PDF cheatsheets
- **Lifecycle Policy:** Delete after 30 days
- **Access:** Presigned URLs with 7-day expiration
- **Encryption:** AES-256 server-side encryption

**S3 Upload Flow:**
```python
import boto3
from datetime import timedelta

s3 = boto3.client('s3')

# Upload PDF
s3.put_object(
    Bucket='antinotes-pdfs-prod',
    Key=f'users/{user_id}/sessions/{session_id}.pdf',
    Body=pdf_bytes,
    ContentType='application/pdf',
    ServerSideEncryption='AES256'
)

# Generate presigned URL
url = s3.generate_presigned_url(
    'get_object',
    Params={
        'Bucket': 'antinotes-pdfs-prod',
        'Key': f'users/{user_id}/sessions/{session_id}.pdf'
    },
    ExpiresIn=int(timedelta(days=7).total_seconds())
)
```

### 6.4 API Management

**AWS API Gateway**
- **Type:** HTTP API (lower latency, lower cost)
- **Features:**
  - JWT authorizer for authentication
  - CORS configuration for web clients
  - Request throttling (10,000 requests/second)
  - CloudWatch logging for monitoring

**Routes:**
```
POST   /v1/auth/signup
POST   /v1/auth/login
POST   /v1/chat/stream
GET    /v1/profile/{user_id}
POST   /v1/profile/{user_id}/onboarding
GET    /v1/sessions/{session_id}/cheatsheet
POST   /v1/export/pdf
POST   /v1/credits/purchase
```

### 6.5 Frontend Hosting

**AWS Amplify**
- **Framework:** Next.js 14 (App Router)
- **Build Settings:**
  ```yaml
  version: 1
  frontend:
    phases:
      preBuild:
        commands:
          - npm ci
      build:
        commands:
          - npm run build
    artifacts:
      baseDirectory: .next
      files:
        - '**/*'
    cache:
      paths:
        - node_modules/**/*
  ```
- **Environment Variables:** API_URL, WEBSOCKET_URL
- **Custom Domain:** antinotes.ai
- **CDN:** CloudFront for global distribution

---

## 7. PDF Generation Pipeline

### 7.1 Architecture

```
Cheatsheet JSON → HTML Template → Puppeteer/WeasyPrint → 
PDF Bytes → S3 Upload → Presigned URL
```

### 7.2 HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            margin: 40px;
            color: #1a1a1a;
        }
        
        .header {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .code-block {
            background: #f8f9fa;
            border-left: 4px solid #6366f1;
            padding: 15px;
            font-family: 'Fira Code', monospace;
            overflow-x: auto;
        }
        
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.3;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ session_topic }}</h1>
        <p>Generated for {{ user_name }} on {{ date }}</p>
    </div>
    
    {% for block in blocks %}
    <div class="content-block">
        <h2>{{ block.topic }}</h2>
        
        {% if block.definition %}
        <div class="definition">
            <strong>Definition:</strong> {{ block.definition }}
        </div>
        {% endif %}
        
        {% if block.code %}
        <div class="code-block">
            <pre><code class="language-{{ block.code.language }}">{{ block.code.snippet }}</code></pre>
            <p class="explanation">{{ block.code.explanation }}</p>
        </div>
        {% endif %}
        
        {% if block.analogy %}
        <div class="analogy">
            <strong>💡 Analogy:</strong> {{ block.analogy }}
        </div>
        {% endif %}
    </div>
    {% endfor %}
    
    <div class="watermark">
        AntiNotes.ai | {{ user_name }} | {{ session_id }}
    </div>
</body>
</html>
```

### 7.3 Generation Service

```python
from weasyprint import HTML
from jinja2 import Template
import boto3

def generate_pdf(session_id: str, user_id: str) -> str:
    # 1. Fetch cheatsheet data
    session = mongo_db.sessions.find_one({"_id": session_id})
    user = mongo_db.users.find_one({"_id": user_id})
    
    # 2. Render HTML
    template = Template(HTML_TEMPLATE)
    html_content = template.render(
        session_topic=session['cheatsheet']['topic'],
        user_name=user['name'],
        date=datetime.now().strftime('%B %d, %Y'),
        blocks=session['cheatsheet']['blocks'],
        session_id=session_id
    )
    
    # 3. Generate PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    # 4. Upload to S3
    s3_key = f'users/{user_id}/sessions/{session_id}.pdf'
    s3.put_object(
        Bucket='antinotes-pdfs-prod',
        Key=s3_key,
        Body=pdf_bytes,
        ContentType='application/pdf'
    )
    
    # 5. Generate presigned URL
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'antinotes-pdfs-prod', 'Key': s3_key},
        ExpiresIn=604800  # 7 days
    )
    
    # 6. Update session record
    mongo_db.sessions.update_one(
        {"_id": session_id},
        {"$set": {"cheatsheet.pdf_generated": True, "cheatsheet.pdf_url": url}}
    )
    
    return url
```

---

## 8. Security Architecture

### 8.1 Authentication & Authorization

**JWT-Based Authentication:**
```python
{
  "sub": "user_67890",
  "email": "user@example.com",
  "tier": "free",
  "iat": 1706774400,
  "exp": 1706860800
}
```

**Token Flow:**
1. User logs in → Backend generates JWT
2. Client stores token in httpOnly cookie
3. Every API request includes token in Authorization header
4. API Gateway validates token before routing to Lambda

### 8.2 Data Protection

**Encryption:**
- **At Rest:** MongoDB Atlas encryption, S3 server-side encryption
- **In Transit:** TLS 1.3 for all API communications
- **Secrets:** AWS Secrets Manager for API keys and database credentials

**Access Control:**
- IAM roles with least-privilege permissions
- VPC for database isolation
- Security groups restricting Lambda egress

### 8.3 Rate Limiting

**API Gateway Throttling:**
- **Per User:** 100 requests/minute
- **Global:** 10,000 requests/second
- **Burst:** 5,000 requests

**Credit-Based Limiting:**
- Free tier: 50 messages/day
- Premium features require credits
- Prevents abuse while allowing legitimate usage

---

## 9. Monitoring & Observability

### 9.1 Metrics

**CloudWatch Metrics:**
- Lambda invocation count, duration, errors
- API Gateway 4xx/5xx error rates
- Bedrock API latency and token usage
- S3 upload success rate

**Custom Metrics:**
- User engagement (messages per session)
- Profile update accuracy
- Cheatsheet generation success rate
- PDF export completion time

### 9.2 Logging

**Structured Logging:**
```python
import structlog

logger = structlog.get_logger()

logger.info(
    "chat_message_processed",
    user_id=user_id,
    session_id=session_id,
    message_length=len(message),
    response_tokens=tokens,
    latency_ms=latency
)
```

**Log Aggregation:**
- CloudWatch Logs for centralized storage
- Log retention: 30 days
- Alerts on error rate spikes

### 9.3 Tracing

**AWS X-Ray:**
- End-to-end request tracing
- Identify bottlenecks in agent execution
- Track Bedrock API call performance

---

## 10. Deployment Strategy

### 10.1 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Lambda Container
        run: |
          docker build -t antinotes-backend .
          docker tag antinotes-backend:latest $ECR_REGISTRY/antinotes-backend:latest
      
      - name: Push to ECR
        run: docker push $ECR_REGISTRY/antinotes-backend:latest
      
      - name: Update Lambda Function
        run: |
          aws lambda update-function-code \
            --function-name antinotes-orchestrator \
            --image-uri $ECR_REGISTRY/antinotes-backend:latest
      
      - name: Deploy Frontend to Amplify
        run: |
          cd frontend
          npm run build
          aws amplify start-deployment --app-id $AMPLIFY_APP_ID
```

### 10.2 Environment Management

**Environments:**
1. **Development:** Local Docker Compose setup
2. **Staging:** AWS with reduced capacity
3. **Production:** Full AWS deployment with auto-scaling

**Configuration:**
- Environment variables via AWS Systems Manager Parameter Store
- Separate databases for each environment
- Blue-green deployment for zero-downtime updates

---

## 11. Cost Optimization

### 11.1 Estimated Monthly Costs (1000 Active Users)

| Service | Usage | Cost |
|---------|-------|------|
| AWS Lambda | 5M invocations, 2GB RAM | $50 |
| Amazon Bedrock | 100M tokens (Claude) | $450 |
| Amazon Bedrock | 50M tokens (Titan Embed) | $5 |
| MongoDB Atlas | M10 cluster | $60 |
| Qdrant Cloud | 1GB vectors | $25 |
| Amazon S3 | 10GB storage, 1000 PDFs | $5 |
| API Gateway | 5M requests | $5 |
| AWS Amplify | 100GB bandwidth | $15 |
| **Total** | | **~$615/month** |

### 11.2 Optimization Strategies

1. **Caching:** Redis for frequently accessed user profiles
2. **Batch Processing:** Group profile updates to reduce Lambda invocations
3. **Model Selection:** Use cheaper models for simple queries
4. **S3 Lifecycle:** Auto-delete old PDFs after 30 days
5. **Reserved Capacity:** Provisioned concurrency only during peak hours

---

## 12. Scalability Considerations

### 12.1 Horizontal Scaling

- **Lambda:** Auto-scales to 1000 concurrent executions
- **MongoDB:** Sharding by user_id for distributed load
- **Qdrant:** Horizontal scaling with multiple nodes
- **API Gateway:** Handles millions of requests per second

### 12.2 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Chat Response Time (P95) | < 2s | 1.8s |
| PDF Generation Time | < 10s | 8s |
| Profile Update Latency | < 500ms | 400ms |
| Concurrent Users | 10,000+ | Tested to 5,000 |

---

## 13. Future Enhancements

### 13.1 Phase 2 Features

1. **Voice Mode:**
   - OpenAI Whisper for speech-to-text
   - ElevenLabs for text-to-speech
   - Real-time voice conversation on mobile

2. **Collaborative Learning:**
   - Share cheatsheets with peers
   - Group study sessions
   - Leaderboards and achievements

3. **Advanced Analytics:**
   - Learning progress dashboard
   - Concept mastery heatmaps
   - Personalized study recommendations

### 13.2 Enterprise Pivot

**Developer Onboarding Platform:**
- Help new hires understand legacy codebases
- Auto-generate documentation from code
- Team knowledge base integration
- Enterprise SSO and compliance features

---

## 14. Technical Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bedrock API Rate Limits | High | Implement request queuing, fallback models |
| Cold Start Latency | Medium | Provisioned concurrency during peak hours |
| PDF Generation Failures | Medium | Retry logic, fallback to HTML export |
| Database Connection Pool Exhaustion | High | Connection pooling, read replicas |
| Cost Overruns | High | Budget alerts, usage caps per user |

---

## Conclusion

AntiNotes represents a paradigm shift in AI-powered education, combining cutting-edge AWS technologies with deep understanding of Indian student needs. The architecture is designed for:

**🎯 Scalability:** Serverless AWS infrastructure (Lambda, Bedrock, S3) enables automatic scaling from 500 alpha users to 100,000+ students during exam periods.

**🧠 Intelligence:** The three-agent system (Profiler, Tutor, Scribe) working in harmony creates a truly "self-aware" mentor that gets smarter with every interaction.

**📚 Innovation:** The Auto-Scribe Engine and Ebbinghaus forgetting curve implementation solve the fundamental problem of knowledge retention that no existing AI tutor addresses.

**🌍 Impact:** Built specifically for Bharat - Hinglish support, offline-first design, and cultural adaptation make quality AI education accessible to Tier-2/3 students.

**💰 Viability:** The freemium model with credit system provides sustainable monetization while maintaining accessibility, with clear path to ₹50Cr+ ARR through enterprise pivot.

The technical foundation supports both the immediate hackathon demo and long-term vision of transforming how India learns technology. Every architectural decision - from LangGraph orchestration to S3 PDF storage - is optimized for the unique challenges of the Indian education market.

**This isn't just another AI chatbot - it's the future of personalized, permanent, and culturally-adapted learning for Bharat.**
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime

from app.models.user import User
from app.models.problem import Problem
from app.models.session import Session, Message, SessionStatus, Role, MessageType
from app.schemas.session import SessionCreate, SessionRead, MessageCreate
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Start a new chat session for a specific problem.
    """
    # 1. Fetch problem
    problem = await Problem.find_one(Problem.slug == session_data.problem_slug)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
        
    # 2. Check if an active session already exists for this user + problem
    existing_session = await Session.find_one(
        Session.user.id == current_user.id,
        Session.problem.id == problem.id,
        Session.status == SessionStatus.ACTIVE
    )
    
    if existing_session:
        return existing_session

    # 3. Create initial system message for context
    system_msg = Message(
        role=Role.SYSTEM,
        content=f"Socratic Tutor initialized for problem: {problem.title}",
        type=MessageType.CHAT
    )

    # 4. Create new session
    session = Session(
        user=current_user,
        problem=problem,
        messages=[system_msg]
    )
    
    await session.insert()
    return session

@router.get("/", response_model=List[SessionRead])
async def list_sessions(
    current_user: User = Depends(get_current_user)
):
    """
    Get all chat sessions for the current user.
    """
    sessions = await Session.find(Session.user.id == current_user.id).to_list()
    return sessions

@router.get("/{session_id}", response_model=SessionRead)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific chat session by ID.
    """
    # Requires importing Pydantic ObjectId if session_id is a valid ObjectId, 
    # but Beanie can handle string IDs directly in .get()
    from beanie import PydanticObjectId
    
    try:
        obj_id = PydanticObjectId(session_id)
        session = await Session.get(obj_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID format")

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    # Security check
    if session.user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
        
    return session

@router.post("/{session_id}/messages", response_model=SessionRead)
async def add_message(
    session_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Add a single message to an existing session.
    """
    from beanie import PydanticObjectId
    
    try:
        obj_id = PydanticObjectId(session_id)
        session = await Session.get(obj_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID format")

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    if session.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    if session.status != SessionStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot add messages to inactive session")

    # Add new message
    new_message = Message(
        role=message_data.role,
        content=message_data.content,
        type=message_data.type
    )
    
    session.messages.append(new_message)
    session.updated_at = datetime.now()
    
    await session.save()
    return session

@router.delete("/{session_id}")
async def close_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Close an active session.
    """
    from beanie import PydanticObjectId
    try:
        obj_id = PydanticObjectId(session_id)
        session = await Session.get(obj_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session ID format")

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    if session.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    session.status = SessionStatus.COMPLETED
    session.updated_at = datetime.now()
    await session.save()
    
    return {"status": "success", "message": "Session closed"}

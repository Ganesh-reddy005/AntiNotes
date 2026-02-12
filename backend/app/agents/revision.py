"""
Revision System - Spaced Repetition

Reminds users to revise topics before they forget.
Similar to Anki cards for coding concepts.
"""

from datetime import datetime, timedelta
from typing import List, Optional
from app.models.profile import Profile
from app.models.problem import Problem
from app.models.revision import Revision


class RevisionAgent:
    """
    Manages spaced repetition for topics.
    Tracks when user last saw each topic and suggests revision.
    """
    
    @staticmethod
    def should_revise_topic(last_seen: datetime, revision_count: int) -> bool:
        """
        Determine if a topic needs revision based on spaced repetition.
        
        Intervals:
        - 1st revision: 1 day
        - 2nd revision: 3 days
        - 3rd revision: 7 days
        - 4th+: 14 days
        """
        now = datetime.now()
        days_since = (now - last_seen).days
        
        if revision_count == 0:
            return days_since >= 1
        elif revision_count == 1:
            return days_since >= 3
        elif revision_count == 2:
            return days_since >= 7
        else:
            return days_since >= 14
    
    @staticmethod
    async def get_topics_due_for_revision(profile: Profile) -> List[str]:
        """
        Get list of topics that need revision.
        """
        topics_due = []
        
        for topic, last_seen in profile.last_seen_topics.items():
            revision_count = profile.revision_count.get(topic, 0)
            
            if RevisionAgent.should_revise_topic(last_seen, revision_count):
                topics_due.append(topic)
        
        return topics_due
    
    @staticmethod
    async def mark_topic_seen(profile: Profile, topic: str) -> None:
        """
        Update last seen time for a topic.
        Called when user solves a problem with this topic.
        """
        profile.last_seen_topics[topic] = datetime.now()
        await profile.save()
    
    @staticmethod
    async def mark_topic_revised(
        profile: Profile, 
        topic: str, 
        problem: Optional[Problem] = None,
        score: Optional[float] = None,
        success: bool = True
    ) -> None:
        """
        Mark topic as revised (increments revision count).
        Creates a Revision record for tracking history.
        """
        # Calculate days since last seen
        last_seen = profile.last_seen_topics.get(topic)
        days_since_last_seen = 0
        if last_seen:
            days_since_last_seen = (datetime.now() - last_seen).days
        
        # Get current revision count
        revision_number = profile.revision_count.get(topic, 0) + 1
        
        # Determine scheduled interval based on revision count
        if revision_number == 1:
            scheduled_interval = 1
        elif revision_number == 2:
            scheduled_interval = 3
        elif revision_number == 3:
            scheduled_interval = 7
        else:
            scheduled_interval = 14
        
        # Create revision record
        revision = Revision(
            user=profile.user,
            problem=problem,
            topic=topic,
            revision_number=revision_number,
            success=success,
            score=score,
            days_since_last_seen=days_since_last_seen,
            scheduled_interval_days=scheduled_interval
        )
        await revision.insert()
        
        # Update profile
        profile.revision_count[topic] = revision_number
        profile.last_seen_topics[topic] = datetime.now()
        
        # Remove from topics_to_revise if present
        if topic in profile.topics_to_revise:
            profile.topics_to_revise.remove(topic)
        
        await profile.save()
    
    @staticmethod
    async def check_for_revision_reminder(profile: Profile, current_problem: Problem) -> str:
        """
        Check if current problem relates to a topic needing revision.
        Returns a reminder message if applicable.
        """
        topics_due = await RevisionAgent.get_topics_due_for_revision(profile)
        
        if not topics_due:
            return ""
        
        # Check if current problem tags overlap with due topics
        problem_tags = set(current_problem.tags)
        due_tags = set(topics_due)
        
        overlap = problem_tags & due_tags
        
        if overlap:
            topic = list(overlap)[0]
            days_since = (datetime.now() - profile.last_seen_topics[topic]).days
            
            return f"💡 Revision reminder: You last practiced '{topic}' {days_since} days ago. Great timing to refresh!"
        
        return ""
    
    @staticmethod
    async def suggest_revision_problems(profile: Profile) -> List[str]:
        """
        Suggest problem tags for revision based on what's due.
        Frontend can filter problems by these tags.
        """
        topics_due = await RevisionAgent.get_topics_due_for_revision(profile)
        return topics_due[:3]  # Top 3 most urgent

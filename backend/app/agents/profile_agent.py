# ProfileAgent - Background Intelligence

from typing import List
from app.models.profile import Profile
from app.models.review import Review


class ProfileAgent:
    """
    Updates user profiles based on review patterns.
    Cost-optimized: Pure logic, no AI calls.
    """
    
    @staticmethod
    async def update_from_review(profile: Profile, review: Review, submission=None) -> None:
        """
        Update profile based on a single review.
        Uses rule-based logic to extract learning signals.
        
        COST: $0 (no AI calls)
        """
        
        # Update concept tracking
        for gap in review.concept_gaps:
            if gap not in profile.unknown_concepts:
                profile.unknown_concepts.append(gap)
        
        # Update weaknesses (keep top 10 most recent)
        for weakness in review.weaknesses:
            if weakness not in profile.weaknesses:
                profile.weaknesses.append(weakness)
        profile.weaknesses = profile.weaknesses[-10:]
        
        # Update thinking style if consistent
        if review.thinking_style and review.thinking_style != "unknown":
            profile.thinking_style = review.thinking_style
        
        # Track problems solved
        if review.score >= 70:  # Threshold for "solved"
            profile.problems_solved += 1
        
        # Update stats
        profile.total_reviews += 1
        
        await profile.save()
    
    @staticmethod
    async def batch_update_profile(profile: Profile, recent_reviews: List[Review]) -> None:
        """
        Analyze multiple reviews to update long-term patterns.
        Still no AI - pure statistical analysis.
        
        COST: $0
        """
        if not recent_reviews:
            return
        
        # Find most common concept gaps
        gap_counts = {}
        for review in recent_reviews:
            for gap in review.concept_gaps:
                gap_counts[gap] = gap_counts.get(gap, 0) + 1
        
        # Top persistent gaps
        persistent_gaps = sorted(gap_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        profile.unknown_concepts = [gap for gap, _ in persistent_gaps]
        
        # Identify strengths (concepts they consistently get right)
        # If concept gaps are empty or decreasing, move to known_concepts
        
        # Calculate trend
        scores = [r.score for r in recent_reviews]
        if len(scores) >= 3:
            recent_avg = sum(scores[-3:]) / 3
            older_avg = sum(scores[:3]) / 3 if len(scores) >= 6 else recent_avg
            
            if recent_avg > older_avg + 10:
                # They're improving!
                pass  # Could trigger encouragement
        
        await profile.save()

# Code Exploration Memory

## General Notes
- Investigating why frontend dashboard shows 0 for solved, reviews, streak, and avg score.
- Stats in `DashboardPage` are derived from the `history` state (`liveSolved`, `liveReviews`, `avgScore`).
- If `history` is empty, stats are 0 or "-".
- `Learning Intelligence` and `Recommended Problems` are rendering fine, so some APIs work.

## Backend
- `users.py` -> `get_my_profile()`, `get_my_history()`, `get_my_memory()`, `get_recommended_problems()`.
- `get_my_history` queries `Review` model using `{"user.$id": ObjectId(str(current_user.id))}`.
- If finding reviews fails or errors out, frontend returns `[]`. 

## Frontend
- Dashboard component fetches:
  - `userApi.profile()`
  - `revisionApi.due()`
  - `userApi.recommended()`
  - `userApi.history()`
  - `userApi.memory()`
- If `userApi.history()` fails, it is caught and `histRes.data` defaults to `[]`.
- Need to check `frontend/lib/api.ts` and `backend/app/models/review.py`.

### Issue 3: Missing `topics_to_revise` on the Frontend Revision Page
The frontend Space Repetition (/revision) page was showing no topics because the `topics_to_revise` array in the master user `Profile` database document was empty.
1. **The Root Cause 1 (Agent Prompting)**: As previously discovered, the OpenAI Prompt `reviewer_v1.md` had an empty array `[]` in its JSON schema example for `topics_to_revise`. Because LLMs are pattern matchers, the AI was literally outputting `[]` instead of populating the array. I fixed this by adding strong `CRITICAL` instructions specifically telling it to fill it out and not leave it empty.
2. **The Root Cause 2 (Backend Propagation)**: Even when the AI did occasionally return topics (such as `["Optimizing string operations"]`), they were only being saved on the `Review` document, and not synced to the master `Profile` document. The Revision system reads exclusively from the `Profile` document. I modified `backend/app/api/v1/endpoints/review.py` specifically under the `update_learning_memory()` background task to append any `review_data.topics_to_revise` to `profile.topics_to_revise` and `profile.last_seen_topics`. Now, when new reviews come in, their topics will correctly flow to the DB profile and appear on the frontend Revision page!
## Bug Resolution: Dashboard Empty Data
- **Root Cause**: The dashboard data (Solved, Reviews, Streak, Avg Score) relies directly on the `userApi.history()` response. The backend endpoint `get_my_history()` was crashing because of the `fetch_links=True` usage in `Review.find(...)` inside `backend/app/api/v1/endpoints/users.py`.
- **Why it failed**: When `fetch_links=True` is provided to `beanie`, it attempts to eagerly fetch all linked DBRef documents (`User`, `Problem`, `Submission`). If even a *single* link is broken (e.g., an orphaned review where the associated problem or submission was deleted), Beanie throws a `DocumentNotFound` exception. This crashed the entire endpoint, returning a 500 error. The frontend caught the 500 error, defaulted to `[]` for history, and hence showed `0` for all stats.
- **Fix**: Removed `fetch_links=True` from the query. The endpoint already had fallback logic below it that lazily fetched the necessary problem data for each review using `.fetch()` inside a `try/except` block, naturally bypassing broken DBRefs without crashing the whole list.
- **Frontend Refactoring**: Refactored the monolithic 530-line `frontend/app/(protected)/dashboard/page.tsx` file by breaking it down into modular components: `DashboardNav`, `StatCard`, `HistoryList`, `LearningIntelligence`, and `MilestoneCard`.
- **Linting**: Fixed 62 ESLint errors across the frontend related to unused imports, any types, unescaped characters, and inline classes.

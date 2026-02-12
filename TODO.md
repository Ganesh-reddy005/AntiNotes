# Antinotes - To-Do List

**Date:** 2026-02-08  
**Current Status:** ✅ Backend production-ready with custom auth

---

## Priority 1: Quick Wins (30 minutes)

### ⚡ Import All Problems (5 min)
```bash
cd backend
# Edit scripts/import_problems.py - change limit=50 to limit=2641
python scripts/import_problems.py
```
**Impact:** 2,641 problems vs current 60

### 🔑 Get Production API Keys (25 min)
1. **DeepSeek** → https://platform.deepseek.com
   - For code reviews (better reasoning)
   - Cost: ~$0.003/review
   
2. **OpenAI** → https://platform.openai.com
   - For tutor hints (GPT-4o-mini)
   - Cost: ~$0.0002/message

3. **Update .env:**
```env
REVIEW_MODEL="deepseek-reasoner"
REVIEW_API_KEY="sk-..."
REVIEW_BASE_URL="https://api.deepseek.com/v1"

TUTOR_MODEL="gpt-4o-mini"
TUTOR_API_KEY="sk-..."
TUTOR_BASE_URL=""
```

---

## Priority 2: Frontend Development (1-2 weeks)

### 📱 Setup (Day 1)
- [ ] Create Next.js 14 project (App Router)
- [ ] Setup Tailwind CSS
- [ ] Install dependencies (axios, react-query, monaco-editor)
- [ ] Create folder structure

### 🔐 Authentication Pages (Day 2)
- [ ] Login page
- [ ] Register page
- [ ] JWT token storage (localStorage)
- [ ] Auth context/provider
- [ ] Protected route wrapper

### 📚 Problem Browser (Day 3-4)
- [ ] Problem list page
- [ ] Filter by difficulty (Easy/Medium/Hard)
- [ ] Filter by tags
- [ ] Search functionality
- [ ] Problem card component

### 💻 Code Editor (Day 5-7)
- [ ] Monaco editor integration
- [ ] Split view (problem description + editor)
- [ ] Language selector
- [ ] Submit button
- [ ] Test results display

### ⭐ Review Display (Day 8-9)
- [ ] Review feedback component
- [ ] Score visualization
- [ ] Strengths/weaknesses display
- [ ] Topics to revise section
- [ ] Thinking style indicator

### 📊 Revision Dashboard (Day 10-11)
- [ ] Due topics list
- [ ] Revision streak tracker
- [ ] Progress charts
- [ ] Recommended problems

### 🎨 Onboarding Flow (Day 12-13)
- [ ] Welcome screen
- [ ] 4-question form
- [ ] Progress indicator
- [ ] Submit and create profile

### ✨ Polish (Day 14)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications

---

## Priority 3: Deployment (1 day)

### Backend
- [ ] Deploy to Railway/Render/Fly.io
- [ ] Setup MongoDB Atlas (production)
- [ ] Configure environment variables
- [ ] Test API endpoints

### Frontend
- [ ] Deploy to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Connect to backend API
- [ ] Test auth flow

### CI/CD
- [ ] GitHub Actions for backend tests
- [ ] Auto-deploy on push to main
- [ ] Environment separation (dev/staging/prod)

---

## Priority 4: Background Jobs (Later)

- [ ] Setup Celery/RQ
- [ ] Async profile updates after review
- [ ] Daily revision email reminders
- [ ] Weekly learning summary generation
- [ ] Cleanup old sessions

---

## Priority 5: Polish & Features (After MVP)

### Security
- [ ] Rate limiting on auth endpoints
- [ ] Email verification (optional)
- [ ] Password reset flow (optional)
- [ ] CORS configuration

### Analytics
- [ ] User progress tracking
- [ ] Skill level evolution charts
- [ ] Most struggled topics
- [ ] Time spent per problem

### Additional Features
- [ ] Dark mode toggle
- [ ] Code templates/snippets
- [ ] Discussion forum per problem
- [ ] Leaderboard (optional)
- [ ] Badges/achievements

---

## Recommended Order

**Week 1:**
1. ✅ Import all problems (5 min)
2. ✅ Get API keys (25 min)
3. Frontend setup + Auth pages (2 days)
4. Problem browser (2 days)
5. Code editor (3 days)

**Week 2:**
1. Review display (2 days)
2. Revision dashboard (2 days)
3. Onboarding flow (2 days)
4. Polish + deploy (1 day)

**Week 3:**
1. User testing
2. Bug fixes
3. Background jobs (optional)
4. Marketing prep

---

## Current Stats

✅ **Backend:** Production-ready  
✅ **Auth:** Custom JWT ($0 cost)  
✅ **Problems:** 60 (can import 2,641)  
✅ **AI:** Multi-model configured  
✅ **Cost:** ~$1/user (80% margin on $5 pricing)  

**Next Milestone:** Launchable MVP with frontend! 🚀

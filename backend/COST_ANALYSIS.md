# Multi-Model Strategy - Cost Breakdown

## Budget: $5 per user/month

### Model Selection Strategy

| Task | Model | Cost | Rationale |
|------|-------|------|-----------|
| **Code Review** | DeepSeek Reasoner | $0.14-0.55/1M in, $0.55-2.19/1M out | Deep reasoning for analysis |
| **Code Review (Alt)** | GPT-4o-mini | $0.15/1M in, $0.60/1M out | Cheaper alternative |
| **Tutor** | GPT-4o-mini | $0.15/1M in, $0.60/1M out | Fast, conversational |
| **Summary** | GPT-4o-mini | $0.15/1M in, $0.60/1M out | Background tasks |

---

## Cost Per Action

### 1. Code Review (DeepSeek Reasoner)
- Input: ~400 tokens (lean prompt + profile + code)
- Output: ~1200 tokens (5-6 sentences detailed feedback)
- **Cost: ~$0.0027 per review**

### 2. Tutor Message (GPT-4o-mini)
- Input: ~200 tokens (context + question)
- Output: ~300 tokens (hint)
- **Cost: ~$0.0002 per message**

### 3. Background Summary (GPT-4o-mini)
- Input: ~500 tokens (review data)
- Output: ~200 tokens (summary)
- **Cost: ~$0.0001 per summary**

---

## Monthly Usage Estimate (100 problems)

| Activity | Count | Cost per | Total |
|----------|-------|----------|-------|
| Reviews | 100 | $0.0027 | **$0.27** |
| Tutor messages | 400 | $0.0002 | **$0.08** |
| Summaries | 20 | $0.0001 | **$0.002** |
| **Subtotal** | | | **$0.352** |
| **Safety margin (3x)** | | | **~$1.05** |

### Profitability Analysis

**Revenue:** $5.00/user  
**AI Cost:** ~$1.05/user  
**Gross Margin:** $3.95 (79%)

**Remaining for:**
- Server costs (~$0.50)
- Database (~$0.20)  
- Auth (Clerk) (~$0.10)
- Other services (~$0.20)

**Net Margin:** ~$3.00 (60%)

---

## Why Different Models?

### DeepSeek for Review
✅ Superior reasoning quality  
✅ Better at identifying thinking patterns  
✅ More nuanced analysis  
❌ Slightly more expensive (~$0.003 vs $0.0008)  
**Verdict:** Worth it - this is the core value prop

### GPT-4o-mini for Tutor
✅ Fast responses (~1-2s)  
✅ 10x cheaper than GPT-4  
✅ Good enough for hints  
**Verdict:** Perfect fit

### GPT-4o-mini for Summaries
✅ Background task (user doesn't see)  
✅ No need for expensive model  
**Verdict:** Cheapest option

---

## Alternative: All GPT-4o-mini

If DeepSeek is unavailable:
- Reviews: GPT-4o-mini @ $0.0008/review
- Monthly cost: ~$0.40 (100 problems + tutoring)
- Gross margin: 92%

**Trade-off:** Slightly less detailed analysis, but still profitable.

---

## Configuration

See `.env.example` for setup:

```env
# Review (choose one)
REVIEW_MODEL="deepseek-reasoner"
REVIEW_API_KEY="sk-..."
REVIEW_BASE_URL="https://api.deepseek.com/v1"

# Tutor
TUTOR_MODEL="gpt-4o-mini"
TUTOR_API_KEY="sk-..."

# Summary
SUMMARY_MODEL="gpt-4o-mini"
SUMMARY_API_KEY="sk-..."
```

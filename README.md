# AntiNotes - AI-Powered Self-Aware Developer Mentor

> **AWS AI for Bharat Hackathon Submission**  
> *Transforming how Indian students learn technology through personalized AI mentoring and automated note-taking*

---

## 🎯 Project Overview

AntiNotes is the first "Self-Aware" Developer Mentor that solves the critical problem of knowledge retention in engineering education. Unlike generic AI tutors, AntiNotes builds a **Living User Profile** and features an **Auto-Scribe Engine** that automatically generates structured, downloadable cheatsheets in real-time.

### 🔥 Core Innovation
- **Living User Profile**: Evolves with every interaction using quest-based learning
- **Auto-Scribe Engine**: Zero-effort documentation during conversations  
- **Revision Loop**: Implements Ebbinghaus forgetting curve for long-term retention
- **Hinglish Support**: Native Hindi+English code-switching for Indian students

---

## 🏆 Problem We're Solving

**70% of engineering students** in India suffer from poor concept retention despite consuming vast educational content. Current AI tools like ChatGPT/Gemini are:
- ❌ Context-blind (no user memory)
- ❌ Generic responses regardless of skill level
- ❌ Require manual note-taking
- ❌ No systematic revision system

**AntiNotes transforms this by making AI tutoring personal, permanent, and scientifically optimized.**

---

## 🚀 Key Features

### 1. **Three-Agent Architecture**
- **Profiler Agent**: Builds and updates user learning profile
- **Tutor Agent**: Delivers personalized explanations in Hinglish
- **Scribe Agent**: Automatically extracts key concepts into cheatsheets

### 2. **Intelligent Revision System**
- Calculates revision schedules using forgetting curve mathematics
- Detects prerequisite concepts needing review
- Contextually weaves revision into new learning

### 3. **Offline-First Design**
- Professional PDF export for bandwidth-constrained areas
- Works without constant internet connectivity
- Perfect for Tier-2/3 city students

---

## 🛠️ Technology Stack

### **AWS Services**
- **Amazon Bedrock**: Claude 3 Sonnet + Titan Embeddings
- **AWS Lambda**: Serverless compute with container images
- **Amazon S3**: PDF storage with lifecycle policies
- **AWS API Gateway**: RESTful APIs with JWT authentication
- **AWS Amplify**: Next.js frontend deployment

### **Development Stack**
- **Backend**: Python 3.11 + FastAPI + LangGraph
- **Frontend**: Next.js 14 + TailwindCSS + TypeScript
- **Database**: MongoDB Atlas + Qdrant Vector DB
- **AI Framework**: LangGraph for agent orchestration

---

## 📊 Market Impact

| Metric | Target | Market Size |
|--------|--------|-------------|
| **Students Served** | 10,000+ in Year 1 | 4.5M engineering students in India |
| **Market Size** | ₹50Cr+ ARR potential | ₹2.8B online education market |
| **Retention Rate** | 40%+ (vs 15% industry) | 60% students in Tier-2/3 underserved |
| **Conversion Rate** | 5%+ free-to-paid | ₹15,000 avg. annual spend per student |

---

## 🎯 Competitive Advantage

| Feature | AntiNotes | ChatGPT/Gemini | Existing EdTech |
|---------|-----------|----------------|-----------------|
| **User Memory** | ✅ Living profile | ❌ No context | ⚠️ Static profiles |
| **Personalization** | ✅ Adapts to style | ❌ Generic | ⚠️ Course-based |
| **Auto Notes** | ✅ Real-time generation | ❌ Manual copy-paste | ❌ Manual notes |
| **Revision System** | ✅ Ebbinghaus curve | ❌ None | ⚠️ Basic reminders |
| **Offline Access** | ✅ PDF export | ❌ Internet required | ⚠️ Limited |
| **Language** | ✅ Native Hinglish | ❌ English-centric | ❌ English only |

---

## 📁 Repository Structure

```
├── README.md              # This file
├── requirements.md         # Detailed functional & business requirements
├── design.md              # Complete technical architecture & implementation
├── user flow.png          # User experience flow diagram
├── design.md              # System design document
└── antiNotes-ppt.pdf      # Original presentation slides
```

---

## 📋 Documentation

### 📖 **[Requirements Document](./requirements.md)**
Comprehensive business and functional requirements including:
- Problem statement with market analysis
- Detailed functional requirements (FR-1 to FR-5)
- Non-functional requirements and success metrics
- Technology stack and competitive analysis
- Go-to-market strategy and risk mitigation

### 🏗️ **[System Design Document](./design.md)**
Complete technical architecture and implementation details:
- Micro-agent architecture with LangGraph orchestration
- AWS services integration (Bedrock, Lambda, S3, Amplify)
- Database schemas and API specifications
- Revision loop implementation with Ebbinghaus curve
- Scalability, security, and deployment strategies

---

## 🎯 AWS AI for Bharat Hackathon Alignment

### **Challenge Category**: AI-driven content creation, management, and personalization

### **How AntiNotes Fits**:
- ✅ **Creates Content**: Auto-generates personalized cheatsheets and explanations
- ✅ **Manages Content**: Organizes learning materials with intelligent categorization  
- ✅ **Personalizes Content**: Adapts to individual learning styles and skill levels
- ✅ **Enhances Workflows**: Transforms passive learning into active, retention-focused experience

### **AWS Services Utilized**:
- **Amazon Bedrock**: Core AI/ML capabilities for conversational AI
- **AWS Lambda**: Serverless compute for scalable agent execution
- **Amazon S3**: Content storage and delivery for offline access
- **AWS Amplify**: Frontend deployment and global distribution

---

## 🚀 Getting Started

### **For Judges/Reviewers**:
1. Read [Requirements Document](./requirements.md) for business context
2. Review [System Design](./design.md) for technical implementation
3. Check user flow diagram for UX understanding

### **Key Evaluation Points**:
- **Innovation**: Unique Auto-Scribe + Revision Loop combination
- **Technical Depth**: Production-ready AWS architecture
- **Market Fit**: Addresses real problems of 4.5M+ Indian students
- **Scalability**: Serverless design supports massive growth
- **Business Viability**: Clear monetization with ₹50Cr+ ARR potential

---

## 👥 Team

**Team Leader**: B Ganesh Reddy  
**Project**: AntiNotes - AI-Powered Self-Aware Developer Mentor  
**Hackathon**: AWS AI for Bharat Challenge  

---

## 🏆 Vision

**"Transform how Indian students learn technology by making AI tutoring personal, permanent, and scientifically optimized for long-term retention, while being accessible in their native language patterns and offline-capable for bandwidth-constrained environments."**

---

*Built with ❤️ for Bharat's future developers*
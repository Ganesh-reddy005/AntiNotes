/**
 * API Client — Axios instance with JWT auth interceptor
 * All API calls throughout the app should use this instance.
 */
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Ensure the base URL ends with a slash so relative paths append correctly
const baseURL = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;

const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("antinotes_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auto-redirect to /login on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("antinotes_token");
            localStorage.removeItem("antinotes_user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;

// ─── Typed API helpers ──────────────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    full_name: string;
    logic_elo: number;
    is_active: boolean;
}

export interface Profile {
    skill_level: string;
    primary_language: string;
    goal?: string;
    background?: string;
    additional_context?: string;
    onboarding_completed: boolean;
    preferred_explanation_style: string;
    thinking_style?: string;
    strengths: string[];
    weaknesses: string[];
    common_mistakes: string[];
    known_concepts: string[];
    unknown_concepts: string[];
    skill_levels: Record<string, number>;
    topics_to_revise: string[];
    revision_count: Record<string, number>;
    total_submissions: number;
    total_reviews: number;
    problems_solved: number;
    current_streak: number;
    updated_at: string;
}

export interface Problem {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    starter_code: string;
}

export interface Review {
    id: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    thinking_style: string;
    concept_gaps: string[];
    topics_to_revise: string[];
    detailed_feedback: string;
}

export interface RevisionTopic {
    topic: string;
    last_seen_days: number;
    interval_days: number;
    revision_number: number;
    score: number;
}

export interface SubmissionHistory {
    review_id: string;
    problem_slug: string;
    problem_title: string;
    difficulty: string;
    score: number;
    thinking_style: string;
    strengths: string[];
    weaknesses: string[];
    concept_gaps: string[];
    topics_to_revise: string[];
    detailed_feedback: string;
    solved_at: string;
}

export interface LearningMemory {
    summary: string;
    timeframe: string;
    topics_covered: string[];
    progress_trend: "improving" | "stagnant" | "regressing";
    key_breakthroughs: string[];
    persistent_struggles: string[];
    num_reviews_analyzed: number;
    created_at: string;
}

// Auth
export const authApi = {
    register: (data: { email: string; password: string; full_name: string }) =>
        api.post<{ access_token: string; token_type: string; user: User }>("auth/register", data),
    login: (email: string, password: string) =>
        api.post<{ access_token: string; token_type: string; user: User }>(
            "auth/login",
            new URLSearchParams({ username: email, password }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ),
    me: () => api.get<User>("auth/me"),
};

// Users & Profile
export const userApi = {
    me: () => api.get<User>("users/me"),
    profile: () => api.get<Profile>("users/me/profile"),
    updateProfile: (data: Partial<Profile>) => api.put<{ message: string }>("users/me/profile", data),
    history: () => api.get<SubmissionHistory[]>("users/me/history"),
    recommended: () => api.get<Problem[]>("users/me/recommended"),
    memory: () => api.get<LearningMemory | null>("users/me/memory"),
};

// Onboarding
export const onboardingApi = {
    submit: (data: {
        coding_level: string;
        goal: string;
        teaching_style: string;
        primary_language: string;
        background?: string;
        additional_context?: string;
    }) => api.post("onboarding/submit", data),
};

// Problems
export const problemsApi = {
    list: (params?: { difficulty?: string; tag?: string }) =>
        api.get<Problem[]>("problems/", { params }),
    get: (slug: string) => api.get<Problem>(`problems/${slug}`),
};

// Review
export const reviewApi = {
    submit: (data: {
        problem_slug: string;
        code: string;
        language: string;
        test_results?: string;
    }) => api.post<Review>("review/", data),
};

// Sessions
export const sessionApi = {
    create: (problem_slug: string) =>
        api.post<{ id: string; status: string }>("sessions/", { problem_slug }),
    get: (id: string) => api.get(`sessions/${id}`),
};

// Tutor
export const tutorApi = {
    ask: (data: {
        problem_slug: string;
        user_message: string;
        history: { role: string; content: string }[];
        session_id?: string;
    }) => api.post<{ reply: string }>("tutor/ask", data),
};

// Revision
export const revisionApi = {
    due: () => api.get<RevisionTopic[]>("revision/due"),
    suggestions: () => api.get<RevisionTopic[]>("revision/suggestions"),
    markRevised: (topic: string, data: { success: boolean; score: number; time_spent_minutes: number }) =>
        api.post(`revision/mark-revised/${encodeURIComponent(topic)}`, data),
};

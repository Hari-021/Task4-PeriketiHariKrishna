export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export type InterviewCategory =
  | 'Python'
  | 'Java'
  | 'C++'
  | 'JavaScript'
  | 'React'
  | 'SQL'
  | 'Machine Learning'
  | 'Cybersecurity'
  | 'Data Structures & Algorithms'
  | 'System Design';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  difficulty: Difficulty;
  question: string;
  expected_answer_points?: string[];
  created_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  category: InterviewCategory;
  difficulty: Difficulty;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  completed_at: string;
  created_at: string;
}

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_id: string;
  answer: string;
  score: number;
  feedback: string;
  created_at: string;
}

export interface DashboardStats {
  total_interviews: number;
  average_score: number;
  highest_score: number;
  category_breakdown: { category: string; count: number; avg_score: number }[];
  weekly_scores: { week: string; score: number }[];
  recent_sessions: InterviewSession[];
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  target_role?: string;
  experience_level?: string;
  created_at: string;
  updated_at: string;
}

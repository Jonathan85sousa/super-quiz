
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
}

export interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  lives: number;
  timePerQuestion: number;
  startTime: Date;
  endTime?: Date;
  answers: GameAnswer[];
  helps: {
    fiftyFifty: boolean;
    skip: boolean;
    hint: boolean;
  };
  isGameActive: boolean;
  isGameFinished: boolean;
}

export interface GameAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  helpUsed?: 'fiftyFifty' | 'skip' | 'hint';
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
  totalTime: number;
  averageTimePerQuestion: number;
  answers: GameAnswer[];
}

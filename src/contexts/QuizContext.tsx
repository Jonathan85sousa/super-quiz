
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Question, GameState, GameAnswer } from '@/types/quiz';

interface QuizContextType {
  gameState: GameState;
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  removeQuestion: (id: string) => void;
  startGame: (selectedQuestions: Question[]) => void;
  answerQuestion: (answerIndex: number, timeSpent: number, helpUsed?: string) => void;
  useHelp: (helpType: 'fiftyFifty' | 'skip' | 'hint') => void;
  nextQuestion: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

type QuizAction = 
  | { type: 'ADD_QUESTION'; payload: Omit<Question, 'id'> }
  | { type: 'REMOVE_QUESTION'; payload: string }
  | { type: 'START_GAME'; payload: Question[] }
  | { type: 'ANSWER_QUESTION'; payload: { answerIndex: number; timeSpent: number; helpUsed?: string } }
  | { type: 'USE_HELP'; payload: 'fiftyFifty' | 'skip' | 'hint' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' };

const initialGameState: GameState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  lives: 3,
  timePerQuestion: 30,
  startTime: new Date(),
  answers: [],
  helps: {
    fiftyFifty: true,
    skip: true,
    hint: true,
  },
  isGameActive: false,
  isGameFinished: false,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

function quizReducer(state: { gameState: GameState; questions: Question[] }, action: QuizAction) {
  switch (action.type) {
    case 'ADD_QUESTION':
      const newQuestion: Question = {
        ...action.payload,
        id: Date.now().toString(),
      };
      return {
        ...state,
        questions: [...state.questions, newQuestion],
      };

    case 'REMOVE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload),
      };

    case 'START_GAME':
      return {
        ...state,
        gameState: {
          ...initialGameState,
          questions: action.payload,
          startTime: new Date(),
          isGameActive: true,
          helps: { fiftyFifty: true, skip: true, hint: true },
        },
      };

    case 'ANSWER_QUESTION':
      const currentQuestion = state.gameState.questions[state.gameState.currentQuestionIndex];
      const isCorrect = action.payload.answerIndex === currentQuestion.correctAnswer;
      const newAnswer: GameAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: action.payload.answerIndex,
        isCorrect,
        timeSpent: action.payload.timeSpent,
        helpUsed: action.payload.helpUsed as any,
      };

      return {
        ...state,
        gameState: {
          ...state.gameState,
          score: isCorrect ? state.gameState.score + 100 : state.gameState.score,
          lives: isCorrect ? state.gameState.lives : state.gameState.lives - 1,
          answers: [...state.gameState.answers, newAnswer],
        },
      };

    case 'USE_HELP':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          helps: {
            ...state.gameState.helps,
            [action.payload]: false,
          },
        },
      };

    case 'NEXT_QUESTION':
      const nextIndex = state.gameState.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= state.gameState.questions.length;
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentQuestionIndex: nextIndex,
          isGameActive: !isLastQuestion && state.gameState.lives > 0,
          isGameFinished: isLastQuestion || state.gameState.lives <= 0,
          endTime: isLastQuestion || state.gameState.lives <= 0 ? new Date() : state.gameState.endTime,
        },
      };

    case 'FINISH_GAME':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isGameActive: false,
          isGameFinished: true,
          endTime: new Date(),
        },
      };

    case 'RESET_GAME':
      return {
        ...state,
        gameState: initialGameState,
      };

    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, {
    gameState: initialGameState,
    questions: [],
  });

  const addQuestion = (question: Omit<Question, 'id'>) => {
    dispatch({ type: 'ADD_QUESTION', payload: question });
  };

  const removeQuestion = (id: string) => {
    dispatch({ type: 'REMOVE_QUESTION', payload: id });
  };

  const startGame = (selectedQuestions: Question[]) => {
    // Embaralhar as perguntas para não repetir a ordem
    const shuffledQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5);
    dispatch({ type: 'START_GAME', payload: shuffledQuestions });
  };

  const answerQuestion = (answerIndex: number, timeSpent: number, helpUsed?: string) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { answerIndex, timeSpent, helpUsed } });
  };

  const useHelp = (helpType: 'fiftyFifty' | 'skip' | 'hint') => {
    dispatch({ type: 'USE_HELP', payload: helpType });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const finishGame = () => {
    dispatch({ type: 'FINISH_GAME' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <QuizContext.Provider
      value={{
        gameState: state.gameState,
        questions: state.questions,
        addQuestion,
        removeQuestion,
        startGame,
        answerQuestion,
        useHelp,
        nextQuestion,
        finishGame,
        resetGame,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

import { useState } from 'react';
import { QuizStart } from './components/QuizStart';
import { QuestionCard, Question } from './components/QuestionCard';
import { ScoreSummary, QuizResult } from './components/ScoreSummary';
import { QuizHistory, QuizHistoryEntry } from './components/QuizHistory';
import { History } from 'lucide-react';

type AppState = 'start' | 'quiz' | 'results';

interface QuizConfig {
  amount: number;
  category: number;
  difficulty: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const fetchQuizQuestions = async (
    amount: number,
    category: number,
    difficulty: string
  ) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
      );
      const data = await response.json();

      if (data.response_code === 0) {
        setQuestions(data.results);
        setQuizConfig({ amount, category, difficulty });
        setAppState('quiz');
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizResults([]);
      } else {
        setError(
          'Failed to fetch quiz questions. Please try different settings.'
        );
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Track result
    setQuizResults([
      ...quizResults,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correct_answer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(isCorrect ? score + 1 : score);
    }
  };

  const finishQuiz = (finalScore: number) => {
    setAppState('results');

    // Save to history
    const historyEntry: QuizHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: questions[0].category,
      difficulty: quizConfig?.difficulty || '',
      score: finalScore,
      totalQuestions: questions.length,
      percentage: Math.round((finalScore / questions.length) * 100),
    };

    const saved = localStorage.getItem('quizHistory');
    const history: QuizHistoryEntry[] = saved ? JSON.parse(saved) : [];
    history.unshift(historyEntry);

    // Keep only last 50 quizzes
    if (history.length > 50) {
      history.pop();
    }

    localStorage.setItem('quizHistory', JSON.stringify(history));
  };

  const handleRetakeQuiz = () => {
    if (quizConfig) {
      fetchQuizQuestions(
        quizConfig.amount,
        quizConfig.category,
        quizConfig.difficulty
      );
    }
  };

  const handleNewQuiz = () => {
    setAppState('start');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizResults([]);
    setQuizConfig(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleNewQuiz}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* History Button */}
        {appState === 'start' && (
          <button
            onClick={() => setShowHistory(true)}
            className="fixed top-4 right-4 z-40 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition"
          >
            <History className="w-6 h-6 text-indigo-600" />
          </button>
        )}

        {/* Main App States */}
        {appState === 'start' && <QuizStart onStartQuiz={fetchQuizQuestions} />}

        {appState === 'quiz' && questions[currentQuestionIndex] && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {appState === 'results' && (
          <ScoreSummary
            score={score}
            totalQuestions={questions.length}
            results={quizResults}
            onRetakeQuiz={handleRetakeQuiz}
            onNewQuiz={handleNewQuiz}
          />
        )}
      </div>

      {/* Quiz History Modal */}
      {showHistory && <QuizHistory onClose={() => setShowHistory(false)} />}
    </>
  );
}

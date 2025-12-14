import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';

export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
}

export function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Shuffle answers
    const allAnswers = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];
    setAnswers(shuffleArray(allAnswers));
    setSelectedAnswer('');
    setShowFeedback(false);
    setTimeLeft(30);
  }, [question]);

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
  }, [timeLeft, showFeedback]);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleSubmit = () => {
    if (!selectedAnswer && timeLeft > 0) return;
    
    const isCorrect = selectedAnswer === question.correct_answer;
    setShowFeedback(true);
    
    setTimeout(() => {
      onAnswer(isCorrect, selectedAnswer || 'No answer');
    }, 1500);
  };

  const getAnswerClass = (answer: string) => {
    if (!showFeedback) {
      return selectedAnswer === answer
        ? 'bg-indigo-100 border-indigo-500 border-2'
        : 'bg-white hover:bg-gray-50 border-gray-300';
    }

    if (answer === question.correct_answer) {
      return 'bg-green-100 border-green-500 border-2';
    }

    if (answer === selectedAnswer && answer !== question.correct_answer) {
      return 'bg-red-100 border-red-500 border-2';
    }

    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className={timeLeft <= 10 ? 'text-red-600' : ''}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {decodeHTML(question.category)}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">
                {question.difficulty}
              </span>
            </div>
            <h2 className="text-2xl text-gray-800">
              {decodeHTML(question.question)}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && setSelectedAnswer(answer)}
                disabled={showFeedback}
                className={`w-full text-left px-6 py-4 border rounded-lg transition ${getAnswerClass(
                  answer
                )} ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{decodeHTML(answer)}</span>
                  {showFeedback && answer === question.correct_answer && (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  )}
                  {showFeedback &&
                    answer === selectedAnswer &&
                    answer !== question.correct_answer && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!showFeedback && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-lg transition flex items-center justify-center gap-2 ${
                selectedAnswer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                selectedAnswer === question.correct_answer
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {selectedAnswer === question.correct_answer
                ? '🎉 Correct! Well done!'
                : `❌ Incorrect. The correct answer was: ${decodeHTML(
                    question.correct_answer
                  )}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

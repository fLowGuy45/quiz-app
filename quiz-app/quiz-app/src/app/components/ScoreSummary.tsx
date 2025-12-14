import { Trophy, RotateCcw, Home, TrendingUp } from 'lucide-react';

export interface QuizResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  results: QuizResult[];
  onRetakeQuiz: () => void;
  onNewQuiz: () => void;
}

export function ScoreSummary({
  score,
  totalQuestions,
  results,
  onRetakeQuiz,
  onNewQuiz,
}: ScoreSummaryProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! 🌟', color: 'text-green-600' };
    if (percentage >= 70) return { text: 'Great Job! 🎉', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'Good Effort! 👍', color: 'text-yellow-600' };
    return { text: 'Keep Practicing! 💪', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage();

  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="w-24 h-24 text-yellow-500" />
                {percentage >= 70 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 animate-bounce">
                    <span className="text-2xl">⭐</span>
                  </div>
                )}
              </div>
            </div>
            <h1 className={`text-4xl mb-2 ${performance.color}`}>
              {performance.text}
            </h1>
            <p className="text-gray-600 mb-6">Quiz Complete!</p>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-6xl text-indigo-600 mb-2">
                  {score}/{totalQuestions}
                </div>
                <p className="text-gray-600">Questions Correct</p>
              </div>
              <div className="text-center">
                <div className="text-6xl text-purple-600 mb-2">
                  {percentage}%
                </div>
                <p className="text-gray-600">Score</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={onRetakeQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
              <button
                onClick={onNewQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                New Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Review */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl text-gray-800">Quiz Review</h2>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      result.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">
                      {decodeHTML(result.question)}
                    </p>
                    <div className="space-y-1 text-sm">
                      {!result.isCorrect && (
                        <p className="text-red-700">
                          <span className="font-semibold">Your answer:</span>{' '}
                          {decodeHTML(result.selectedAnswer)}
                        </p>
                      )}
                      <p className="text-green-700">
                        <span className="font-semibold">Correct answer:</span>{' '}
                        {decodeHTML(result.correctAnswer)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {result.isCorrect ? (
                      <span className="text-2xl">✓</span>
                    ) : (
                      <span className="text-2xl">✗</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

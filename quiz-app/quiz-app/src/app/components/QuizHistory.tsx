import { useState, useEffect } from 'react';
import { History, TrendingUp, Target, Award, X } from 'lucide-react';

export interface QuizHistoryEntry {
  id: string;
  date: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

interface QuizHistoryProps {
  onClose: () => void;
}

export function QuizHistory({ onClose }: QuizHistoryProps) {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('quizHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your quiz history?')) {
      localStorage.removeItem('quizHistory');
      setHistory([]);
    }
  };

  const getStats = () => {
    if (history.length === 0) return null;

    const totalQuizzes = history.length;
    const averageScore =
      history.reduce((sum, entry) => sum + entry.percentage, 0) / totalQuizzes;
    const bestScore = Math.max(...history.map((entry) => entry.percentage));
    const totalQuestions = history.reduce(
      (sum, entry) => sum + entry.totalQuestions,
      0
    );

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      bestScore,
      totalQuestions,
    };
  };

  const stats = getStats();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-8 h-8" />
              <h2 className="text-3xl">Quiz History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <History className="w-5 h-5" />
                  <p className="text-sm opacity-90">Total Quizzes</p>
                </div>
                <p className="text-2xl">{stats.totalQuizzes}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <p className="text-sm opacity-90">Avg Score</p>
                </div>
                <p className="text-2xl">{stats.averageScore}%</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5" />
                  <p className="text-sm opacity-90">Best Score</p>
                </div>
                <p className="text-2xl">{stats.bestScore}%</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5" />
                  <p className="text-sm opacity-90">Questions</p>
                </div>
                <p className="text-2xl">{stats.totalQuestions}</p>
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No quiz history yet</p>
              <p className="text-gray-400">
                Complete a quiz to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-gray-800">{entry.category}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-indigo-600">
                        {entry.percentage}%
                      </div>
                      <p className="text-sm text-gray-500">
                        {entry.score}/{entry.totalQuestions}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">
                      {entry.difficulty}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          entry.percentage >= 70
                            ? 'bg-green-500'
                            : entry.percentage >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${entry.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-gray-200 p-4 flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              {history.length} quiz{history.length !== 1 ? 'zes' : ''} completed
            </p>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

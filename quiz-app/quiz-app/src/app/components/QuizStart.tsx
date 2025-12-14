import { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, Search } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface QuizStartProps {
  onStartQuiz: (amount: number, category: number, difficulty: string) => void;
}

export function QuizStart({ onStartQuiz }: QuizStartProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://opentdb.com/api_category.php');
      const data = await response.json();
      setCategories(data.trivia_categories);
      setLoading(false);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (questionCount < 1 || questionCount > 50) {
      setError('Please select between 1 and 50 questions.');
      return;
    }
    onStartQuiz(questionCount, selectedCategory, selectedDifficulty);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl mb-2 text-gray-800">Quiz Master</h1>
          <p className="text-gray-600">Test your knowledge across various topics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Category Selection with Search */}
          <div>
            <label className="block mb-2 text-gray-700">
              Select Category
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              {filteredCategories.length === 0 ? (
                <option disabled>No categories found</option>
              ) : (
                filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-500">
                Found {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
              </p>
            )}
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block mb-2 text-gray-700">
              Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-3 rounded-lg capitalize transition ${
                    selectedDifficulty === difficulty
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block mb-2 text-gray-700">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
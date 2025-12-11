import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, GroundingSource, QuizQuestion } from '../types';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/index';
// Ensure this service exports the api object we previously worked on.
import { api } from '../services/apiService.ts';

// The QuizView component is well-written and requires no changes.
// I've kept it here for completeness.
interface QuizViewProps {
  messageId: string;
  quiz: QuizQuestion;
  userAnswerIndex: number | undefined;
  onAnswer: (messageId: string, selectedIndex: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ messageId, quiz, userAnswerIndex, onAnswer }) => {
  const isAnswered = userAnswerIndex !== undefined;
  const { t } = useLanguage();

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-gray-50 border-gray-300';
    }
    if (index === quiz.correctAnswerIndex) {
      return 'bg-green-100 border-green-500 text-gray-900 font-bold';
    }
    if (index === userAnswerIndex) {
      return 'bg-red-100 border-red-500 text-gray-900 font-bold';
    }
    return 'bg-gray-50 border-gray-300 text-gray-600';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <p className="font-semibold text-gray-900 mb-4 text-lg">{quiz.question}</p>
      <div className="space-y-3">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(messageId, index)}
            disabled={isAnswered}
            className={`w-full text-left p-4 border-2 rounded-xl transition-colors duration-200 flex items-center text-md ${getButtonClass(index)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span className="font-mono mr-4 text-sm">{String.fromCharCode(65 + index)}.</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-5 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
          <h4 className="font-bold text-yellow-800">{t('explanation')}</h4>
          <p className="text-gray-600 mt-1">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};


const AskAiPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTutorMode, setIsTutorMode] = useState(false);
    const [answeredQuizzes, setAnsweredQuizzes] = useState<Record<string, number>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const initialized = useRef(false);

    // MODIFICATION 1: Use an empty dependency array to ensure this runs only once.
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const fetchHistory = async () => {
            try {
                const history = await api.get<ChatMessage[]>('/ai/chat/history');
                if (history && history.length > 0) {
                    setMessages(history);
                } else {
                    setMessages([{ id: 'initial-greeting', role: 'model', text: t('aiGreeting') }]);
                }
            } catch (error) {
                console.error("Failed to fetch chat history", error);
                setMessages([{ id: 'initial-greeting', role: 'model', text: t('aiGreeting') }]);
            }
        };
        fetchHistory();
    }, []); // Changed [t] to []

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // MODIFICATION 2: Create a helper function for generating more robust unique IDs.
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const handleToggleTutorMode = (enabled: boolean) => {
        setIsTutorMode(enabled);
        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            role: 'model',
            text: enabled ? t('tutorModeEnabledMessage') : t('tutorModeDisabledMessage'),
        }]);
    };

    const handleAnswerQuiz = (messageId: string, selectedIndex: number) => {
        setAnsweredQuizzes(prev => ({ ...prev, [messageId]: selectedIndex }));
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: generateUniqueId(), role: 'user', text: input };
        const currentInput = input;
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (isTutorMode && currentInput.toLowerCase().startsWith(t('quizMeOn').toLowerCase())) {
            try {
                const topic = currentInput.substring(t('quizMeOn').length).trim();
                const quizQuestion = await api.post<QuizQuestion>('/ai/quiz', { topic });
                const quizMessage: ChatMessage = {
                    id: generateUniqueId(),
                    role: 'model',
                    text: t('quizMessage', { topic }),
                    quiz: quizQuestion,
                };
                setMessages(prev => [...prev, quizMessage]);
            } catch (error) {
                 console.error("Quiz generation failed:", error);
                 setMessages(prev => [...prev, { id: generateUniqueId(), role: 'model', text: t('quizGenerationFailed') }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const response = await api.post<{ text: string; sources?: GroundingSource[] }>('/ai/chat', {
                prompt: currentInput,
                isTutorMode,
                history: messages.slice(-10)
            });
            
            const modelMessage: ChatMessage = {
                id: generateUniqueId(),
                role: 'model',
                text: response.text,
                sources: response.sources
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("AI chat failed:", error);
            setMessages(prev => [...prev, { id: generateUniqueId(), role: 'model', text: t('errorFetchingResponse') }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleQuickAction = (actionKey: 'quiz' | 'explain') => {
        setInput(t(actionKey));
    }

    return (
        // The JSX is well-structured and does not require changes.
        // ... (rest of your excellent JSX code)
        <div className="flex flex-col h-screen bg-gray-50">
             <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <Icon name="ai" className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-xl font-bold">{t('aiAssistant')}</h1>
                </div>
                 <div className="flex items-center space-x-2">
                    <span className={`text-md font-medium ${isTutorMode ? 'text-blue-600' : 'text-gray-600'}`}>{t('tutorMode')}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isTutorMode} onChange={(e) => handleToggleTutorMode(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    {messages.map((msg) => {
                        if (msg.role === 'user') {
                            return (
                                <div key={msg.id} className="flex justify-end">
                                    <div className="max-w-lg md:max-w-xl rounded-2xl p-4 text-lg bg-blue-600 text-white shadow-md">
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            );
                        } else { // 'model'
                            return (
                                <div key={msg.id} className="flex items-start space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Icon name="ai" className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className={`max-w-lg md:max-w-xl rounded-2xl ${msg.quiz ? 'w-full' : 'p-4 text-lg bg-white shadow-md'}`}>
                                        {msg.quiz ? (
                                            <QuizView messageId={msg.id} quiz={msg.quiz} userAnswerIndex={answeredQuizzes[msg.id]} onAnswer={handleAnswerQuiz} />
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    })}
                    {isLoading && messages[messages.length-1]?.role === 'user' && (
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <Icon name="ai" className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="max-w-lg md:max-w-xl rounded-2xl p-4 text-lg bg-white shadow-md">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 bg-transparent">
                <div className="max-w-4xl mx-auto">
                    {isTutorMode && (
                        <div className="flex items-center space-x-2 mb-3">
                           <button onClick={() => handleQuickAction('quiz')} className="text-sm bg-white text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-50 shadow-md">{t('quizMeOn')}...</button>
                           <button onClick={() => handleQuickAction('explain')} className="text-sm bg-white text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-50 shadow-md">{t('explainStepByStep')}...</button>
                        </div>
                    )}
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isTutorMode ? t('tutorPlaceholder') : t('assistantPlaceholder')}
                            className="flex-1 p-4 bg-white border-2 border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-md"
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="p-4 bg-blue-600 text-white rounded-full disabled:bg-gray-400 hover:bg-opacity-80 transition-all transform hover:scale-110 active:scale-100 shadow-md">
                            <Icon name="send" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskAiPage;
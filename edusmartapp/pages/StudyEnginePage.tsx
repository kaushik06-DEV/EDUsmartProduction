import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/index';
// Fix: Import api service instead of deprecated aiModel
import { api } from '../services/apiService';

const StudyEnginePage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionTopic, setSessionTopic] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Fix: Removed calls to deprecated aiModel. Session is managed implicitly by chat history.
    useEffect(() => {
        // This can be empty now.
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Fix: Removed calls to deprecated aiModel.
    const handleEndSession = () => {
        setMessages([{
            id: Date.now().toString(),
            role: 'model',
            text: t('sessionEnded'),
        }]);
        setSessionTopic(null);
    }

    // Fix: Replaced streaming logic with non-streaming API call to the backend proxy.
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        const currentInput = input;

        setMessages(prev => [...prev, userMessage]);
        
        if (!sessionTopic) {
            setSessionTopic(input);
        }

        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post<{ text: string }>('/ai/chat', {
                prompt: currentInput,
                isTutorMode: true, // Study engine is a form of tutor mode
                history: messages.slice(-10) // Send recent history for context
            });
            
            const modelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text,
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Study Engine failed:", error);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: t('errorFetchingResponse') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-ui-background">
             <header className="bg-white/80 backdrop-blur-lg border-b border-ui-border p-4 flex items-center justify-center sticky top-0 z-10">
                <div className="flex items-center">
                    <Icon name="studyEngine" className="h-8 w-8 text-ui-primary mr-3" />
                    <h1 className="text-xl font-bold">{t('studyEngine')}</h1>
                </div>
            </header>
            
            <div className="flex-1 overflow-hidden">
                <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
                    {/* Chat Column */}
                    <div className="lg:col-span-2 flex flex-col h-full bg-ui-card rounded-2xl shadow-apple p-4">
                        <div className="flex-1 overflow-y-auto pr-4">
                            <div className="max-w-4xl mx-auto space-y-4">
                                 {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-lg md:max-w-xl rounded-2xl p-4 text-lg ${msg.role === 'user' ? 'bg-ui-primary text-white' : 'bg-ui-hover'}`}>
                                           {/* Fix: Removed streaming-specific loading logic */}
                                           <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Fix: Added loading indicator for non-streaming response */}
                                {isLoading && messages[messages.length-1]?.role === 'user' && (
                                    <div className="flex justify-start">
                                        <div className="max-w-lg md:max-w-xl rounded-2xl p-4 text-lg bg-ui-hover">
                                            <span className="animate-pulse">...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                         <div className="py-4 border-t border-ui-border">
                            <div className="flex items-center space-x-3 max-w-4xl mx-auto">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('studyEnginePlaceholder')}
                                    className="flex-1 p-4 bg-ui-card border-2 border-ui-border rounded-full text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:border-ui-primary focus:ring-4 focus:ring-ui-primary/20 transition duration-200"
                                    disabled={isLoading}
                                />
                                <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="p-4 bg-ui-primary text-white rounded-full disabled:bg-gray-400 hover:bg-opacity-80 transition-transform hover:scale-110 active:scale-100">
                                    <Icon name="send" className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 hidden lg:block space-y-8">
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                            <h3 className="text-xl font-bold text-ui-text-primary mb-2 tracking-tight">{t('sessionTopic')}</h3>
                            <p className="text-ui-text-secondary italic text-lg">{sessionTopic || "No topic started yet."}</p>
                        </div>
                        <div className="bg-ui-card p-6 rounded-2xl shadow-apple">
                            <h3 className="text-xl font-bold text-ui-text-primary mb-3 tracking-tight">{t('studyTips')}</h3>
                            <ul className="space-y-3 list-disc list-inside text-ui-text-secondary text-md">
                                <li>{t('studyTip1')}</li>
                                <li>{t('studyTip2')}</li>
                            </ul>
                        </div>
                         <button onClick={handleEndSession} className="w-full bg-ui-red text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors">
                            {t('endSession')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyEnginePage;
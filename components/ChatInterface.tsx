import React, { useEffect, useRef, useState } from 'react';
import { Message, AppData } from '../types';
import { sendMessageToGemini, generateChatTitle } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  appData: AppData;
  onUpdateTitle?: (title: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, appData, onUpdateTitle }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    await processMessageSubmission(inputValue.trim(), messages);
  };

  const processMessageSubmission = async (text: string, currentHistory: Message[]) => {
    setInputValue('');
    setIsLoading(true);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    const updatedHistory = [...currentHistory, newUserMsg];
    setMessages(updatedHistory);

    // Generate smart title if this is the first message
    if (currentHistory.length === 0 && onUpdateTitle) {
      // We don't await this so it doesn't block the chat flow
      generateChatTitle(text).then((smartTitle) => {
        onUpdateTitle(smartTitle);
      });
    }

    try {
      const responseText = await sendMessageToGemini(text, updatedHistory, appData);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I'm having trouble connecting to the backend right now.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async () => {
    if (!editContent.trim()) return;
    
    // Find index of message being edited
    const msgIndex = messages.findIndex(m => m.id === editingId);
    if (msgIndex === -1) return;

    // Truncate history to remove this message and everything after it
    const historyBeforeEdit = messages.slice(0, msgIndex);
    
    setEditingId(null);
    setEditContent('');
    
    // Resubmit as if it were a new message with the truncated history
    await processMessageSubmission(editContent, historyBeforeEdit);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9fafb] dark:bg-[#0f172a] relative transition-colors duration-200">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-20">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mb-8">
               <i className="fa-solid fa-robot text-4xl text-indigo-500"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How can I help you?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg text-center leading-relaxed">
              Ask about server inventory, environment details, or troubleshooting steps for common errors.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
              }`}
            >
              {editingId === msg.id ? (
                <div className="w-full min-w-[200px] md:min-w-[400px]">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={cancelEditing}
                      className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveEdit}
                      className="text-xs px-3 py-1 bg-indigo-700 text-white rounded hover:bg-indigo-800"
                    >
                      Save & Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {msg.role === 'model' ? (
                     <div className="prose prose-sm max-w-none dark:prose-invert">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                     </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                  
                  <div className={`flex items-center justify-between mt-2 min-h-[1.25rem]`}>
                    <div className={`text-xs ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className={`text-xs p-1.5 rounded transition-colors ${msg.role === 'user' ? 'text-indigo-200 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Copy text"
                       >
                         {copiedId === msg.id ? (
                           <i className="fa-solid fa-check"></i>
                         ) : (
                           <i className="fa-regular fa-copy"></i>
                         )}
                       </button>
                       {msg.role === 'user' && (
                         <button
                          onClick={() => startEditing(msg)}
                          className="text-xs text-indigo-200 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"
                          title="Edit message"
                         >
                           <i className="fa-solid fa-pencil"></i>
                         </button>
                       )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="relative bg-white dark:bg-gray-800 rounded-[30px] border border-gray-200 dark:border-gray-700 p-2 pl-3 flex items-end gap-2 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-none transition-shadow duration-200 focus-within:shadow-[0_8px_25px_-5px_rgba(99,102,241,0.15)] focus-within:border-indigo-300 dark:focus-within:border-gray-600"
          >
            {/* Glass line highlight */}
            <div className="absolute top-[2px] left-[3px] right-[3px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none rounded-t-[30px]" />

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about inventory or an error..."
              className="flex-1 bg-transparent text-gray-900 dark:text-white px-4 py-3 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 resize-none min-h-[52px] max-h-[120px] leading-relaxed"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`mb-1 mr-1 w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                 !inputValue.trim() || isLoading 
                 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                 : 'bg-[#818cf8] hover:bg-[#6366f1] text-white shadow-md shadow-indigo-200 dark:shadow-none'
              }`}
            >
              {isLoading ? (
                 <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                 <i className="fa-solid fa-paper-plane text-sm ml-[-2px] mt-[1px]"></i>
              )}
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-400 dark:text-gray-600">
               Support AI may display inaccurate info. Please verify critical data.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
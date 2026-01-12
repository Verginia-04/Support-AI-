import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { AppData, ChatSession } from './types';
import { DUMMY_DATA } from './constants';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [appData] = useState<AppData>(DUMMY_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Initialize a session on mount if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleDeleteSession = (sessionId: string) => {
    const isDeletingCurrent = currentSessionId === sessionId;
    
    // Construct the new list first
    let updatedSessions = sessions.filter(s => s.id !== sessionId);
    let nextId = currentSessionId;

    if (updatedSessions.length === 0) {
      // If all deleted, create a new one immediately
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
      };
      updatedSessions = [newSession];
      nextId = newSession.id;
    } else if (isDeletingCurrent) {
      // If deleted current, switch to the first available
      nextId = updatedSessions[0].id;
    }

    setSessions(updatedSessions);
    setCurrentSessionId(nextId);
  };

  const handleClearAllHistory = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
  };

  const handleTitleUpdate = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <div className={`${theme} h-screen w-full flex flex-col overflow-hidden`}>
      <div className="flex h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-200">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={setCurrentSessionId}
          onNewChat={createNewSession}
          onDeleteSession={handleDeleteSession}
          onClearAllHistory={handleClearAllHistory}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                 {currentSession?.title || 'New Chat'}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
               >
                 {theme === 'dark' ? (
                   <i className="fa-solid fa-sun text-lg"></i>
                 ) : (
                   <i className="fa-solid fa-moon text-lg"></i>
                 )}
               </button>
            </div>
          </header>

          {currentSession ? (
            <ChatInterface
              messages={currentSession.messages}
              setMessages={(msgsOrFn) => {
                setSessions((prevSessions) => 
                  prevSessions.map((session) => {
                    if (session.id === currentSessionId) {
                      const newMessages = typeof msgsOrFn === 'function' 
                        ? msgsOrFn(session.messages) 
                        : msgsOrFn;

                      let title = session.title;
                      // Keep naive logic for instant feedback until AI updates it
                      if (session.messages.length === 0 && newMessages.length > 0) {
                        const firstMsg = newMessages.find(m => m.role === 'user');
                        if (firstMsg) {
                           title = firstMsg.content.slice(0, 30) + (firstMsg.content.length > 30 ? '...' : '');
                        }
                      }
                      return { ...session, messages: newMessages, title };
                    }
                    return session;
                  })
                );
              }}
              appData={appData}
              onUpdateTitle={(title) => currentSessionId && handleTitleUpdate(currentSessionId, title)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Select or create a chat to begin.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
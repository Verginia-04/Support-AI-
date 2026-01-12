import React, { useState } from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAllHistory: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAllHistory,
  isOpen,
  toggleSidebar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to format date like "Jan 9"
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:relative inset-y-0 left-0 z-30 w-96 transform transition-transform duration-300 ease-in-out flex flex-col
        bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <i className="fa-solid fa-server text-lg"></i>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Support AI</h1>
              <p className="text-xs text-gray-500 font-medium">Support & Inventory</p>
            </div>
            <button onClick={toggleSidebar} className="md:hidden ml-auto text-gray-500">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-200 dark:shadow-none mb-4"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            New Conversation
          </button>

          {/* Search Bar */}
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-10">
              {searchTerm ? 'No results found.' : 'No chat history.'}
            </p>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`group w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all cursor-pointer ${
                  currentSessionId === session.id
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <i className={`fa-regular fa-message ${currentSessionId === session.id ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                  <span className="truncate font-medium">{session.title}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs text-gray-400 shrink-0 ${currentSessionId === session.id ? 'opacity-100' : 'group-hover:opacity-0'}`}>
                    {formatDate(session.createdAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('Delete this chat?')) onDeleteSession(session.id);
                    }}
                    className={`hidden group-hover:block p-1 text-gray-400 hover:text-red-500 transition-colors ${currentSessionId === session.id ? 'block' : ''}`}
                    title="Delete Chat"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              if (sessions.length > 0 && confirm('Are you sure you want to delete all chat history?')) {
                onClearAllHistory();
              }
            }}
            disabled={sessions.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm transition-colors ${
              sessions.length === 0 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <i className="fa-solid fa-trash-can"></i>
            Delete All History
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
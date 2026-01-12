export interface InventoryItem {
  AppName: string;
  Environment: string; // 'Dev' | 'Test' | 'UAT' | 'Support' | 'Prod'
  CPU: string;
  Memory: string;
  Version: string;
  LoginDetails: string;
  [key: string]: any; // Allow flexibility
}

export interface KnowledgeBaseItem {
  Error: string;
  Solution: string;
  ManagerContact: string;
  RootCause?: string;
  [key: string]: any; // Allow flexibility
}

export interface AppData {
  inventory: InventoryItem[];
  knowledgeBase: KnowledgeBaseItem[];
  rawText?: string; // For unstructured PDF/Text content
  isDefault?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
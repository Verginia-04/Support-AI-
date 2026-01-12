import { AppData } from './types';
import { KNOWLEDGE_BASE_DATA } from './data/knowledge_base';

export const DUMMY_DATA: AppData = {
  isDefault: true,
  inventory: [
    {
      AppName: "App Alpha",
      Environment: "Test",
      CPU: "4 vCPU",
      Memory: "16GB",
      Version: "v1.2.0",
      LoginDetails: "admin / alphaPass123"
    },
    {
      AppName: "App Alpha",
      Environment: "Prod",
      CPU: "16 vCPU",
      Memory: "64GB",
      Version: "v1.1.5",
      LoginDetails: "Vault access required"
    },
    {
      AppName: "Beta Service",
      Environment: "Dev",
      CPU: "2 vCPU",
      Memory: "4GB",
      Version: "v2.0.0-beta",
      LoginDetails: "dev / devPass"
    }
  ],
  knowledgeBase: KNOWLEDGE_BASE_DATA
};

export const GEMINI_MODEL = 'gemini-3-flash-preview';
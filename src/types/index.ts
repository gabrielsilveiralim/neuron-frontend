export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourcesUsed?: number;
  timestamp: Date;
}

export interface IngestForm {
  title: string;
  content: string;
  source: string;
}

export interface IngestResponse {
  message: string;
  documentId: string;
  chunksCreated: number;
}

export interface ChatResponse {
  answer: string;
  sourcesUsed: number;
}
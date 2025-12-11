export enum AgentType {
  COORDINATOR = 'COORDINATOR',
  RME = 'RME', // Rekam Medis Elektronik
  ADMIN = 'ADMIN', // Administrative / AIS
  CLINICAL = 'CLINICAL', // Clinical Decision Support
  EDUCATION = 'EDUCATION', // Patient Education
}

export interface AgentResponse {
  agentType: AgentType;
  reasoning: string;
  content: string;
  structuredData?: any; // For charts or specific formatted data
  timestamp: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentResponse?: AgentResponse;
}

// Data structures for visualization
export interface AgingScheduleItem {
  period: string;
  amount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface VitalsData {
  metric: string;
  value: string;
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface EducationPoint {
  topic: string;
  explanation: string;
  icon: string;
}
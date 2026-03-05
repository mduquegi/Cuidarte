// Tipos para los diferentes tests y almacenamiento de datos

export interface TestResult {
  id: string;
  testType: 'functional' | 'cognitive' | 'mental' | 'lifeSpace';
  date: string;
  score: number;
  maxScore: number;
  details: any;
}

export interface FunctionalTestResult {
  balanceTime: number; // segundos de equilibrio
  reactionTime: number; // milisegundos de reacción
  completed: boolean;
}

export interface CognitiveTestResult {
  wordsRemembered: number;
  totalWords: number;
  timeSpent: number;
  attempts: number;
}

export interface MentalTestResult {
  answers: number[]; // 0-3 para cada pregunta GDS
  totalScore: number;
  riskLevel: 'bajo' | 'moderado' | 'alto';
}

export interface LifeSpaceResult {
  bedroom: boolean;
  house: boolean;
  outside: boolean;
  neighborhood: boolean;
  town: boolean;
  frequency: number[];
  assistance: number[];
}

export interface UserProfile {
  name: string;
  age: number;
  createdAt: string;
}

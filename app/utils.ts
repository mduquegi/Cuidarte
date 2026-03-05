import { TestResult, UserProfile } from './types';

// Almacenamiento local de resultados
export const storage = {
  // Guardar perfil del usuario
  saveProfile: (profile: UserProfile) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cuidarte_profile', JSON.stringify(profile));
    }
  },

  // Obtener perfil
  getProfile: (): UserProfile | null => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('cuidarte_profile');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  // Guardar resultado de test
  saveTestResult: (result: TestResult) => {
    if (typeof window !== 'undefined') {
      const results = storage.getAllResults();
      results.push(result);
      localStorage.setItem('cuidarte_results', JSON.stringify(results));
    }
  },

  // Obtener todos los resultados
  getAllResults: (): TestResult[] => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('cuidarte_results');
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Obtener resultados por tipo
  getResultsByType: (type: TestResult['testType']): TestResult[] => {
    return storage.getAllResults().filter(r => r.testType === type);
  },

  // Limpiar todos los datos
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cuidarte_results');
      localStorage.removeItem('cuidarte_profile');
    }
  }
};

// Síntesis de voz (sin necesidad de API key)
export const speak = (text: string, rate: number = 0.9) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Cancelar cualquier habla anterior
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate; // Más lento para adultos mayores
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  }
};

// Detener la voz
export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Formatear fecha
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Calcular nivel de riesgo
export const getRiskLevel = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return 'Excelente';
  if (percentage >= 60) return 'Bueno';
  if (percentage >= 40) return 'Regular';
  return 'Requiere atención';
};

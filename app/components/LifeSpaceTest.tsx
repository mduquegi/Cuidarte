'use client';

import React, { useState } from 'react';
import { Button, Card, VoiceButton, ProgressBar } from './UI';
import { storage, speak } from '../utils';
import { TestResult, LifeSpaceResult } from '../types';
import { ArrowLeft } from 'lucide-react';

const LIFE_SPACES = [
  {
    id: 'bedroom',
    level: 1,
    title: '🛏️ Habitación',
    description: '¿Ha salido de su habitación?',
    icon: '🛏️'
  },
  {
    id: 'house',
    level: 2,
    title: '🏠 Otras habitaciones de la casa',
    description: '¿Se movió por otras partes de su casa?',
    icon: '🏠'
  },
  {
    id: 'outside',
    level: 3,
    title: '🚪 Fuera de casa (jardín, patio)',
    description: '¿Salió al exterior de su casa?',
    icon: '🌳'
  },
  {
    id: 'neighborhood',
    level: 4,
    title: '🏘️ Su vecindario',
    description: '¿Se desplazó por su vecindario?',
    icon: '🏘️'
  },
  {
    id: 'town',
    level: 5,
    title: '🏙️ Fuera de su vecindario',
    description: '¿Fue a lugares fuera de su vecindario?',
    icon: '🏙️'
  }
];

const FREQUENCIES = [
  { value: 1, label: '1 vez', score: 1 },
  { value: 2, label: '2-3 veces', score: 2 },
  { value: 3, label: '4-6 veces', score: 3 },
  { value: 4, label: 'Diariamente', score: 4 }
];

const ASSISTANCE_LEVELS = [
  { value: 1, label: 'Sin ayuda', score: 2 },
  { value: 2, label: 'Con ayuda', score: 1 }
];

export const LifeSpaceTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSpace, setCurrentSpace] = useState(0);
  const [step, setStep] = useState<'access' | 'frequency' | 'assistance' | 'results'>('access');
  const [accessAnswers, setAccessAnswers] = useState<boolean[]>([]);
  const [frequencyAnswers, setFrequencyAnswers] = useState<number[]>([]);
  const [assistanceAnswers, setAssistanceAnswers] = useState<number[]>([]);

  const handleAccessAnswer = (answer: boolean) => {
    const newAnswers = [...accessAnswers, answer];
    setAccessAnswers(newAnswers);

    if (answer) {
      // Si respondió que sí, preguntar frecuencia
      setStep('frequency');
    } else {
      // Si respondió que no, pasar al siguiente espacio
      setFrequencyAnswers([...frequencyAnswers, 0]);
      setAssistanceAnswers([...assistanceAnswers, 0]);
      moveToNextSpace();
    }
  };

  const handleFrequencyAnswer = (score: number) => {
    setFrequencyAnswers([...frequencyAnswers, score]);
    setStep('assistance');
  };

  const handleAssistanceAnswer = (score: number) => {
    setAssistanceAnswers([...assistanceAnswers, score]);
    moveToNextSpace();
  };

  const moveToNextSpace = () => {
    if (currentSpace < LIFE_SPACES.length - 1) {
      setCurrentSpace(currentSpace + 1);
      setStep('access');
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    const totalScore = accessAnswers.reduce((sum, access, index) => {
      if (!access) return sum;
      const level = LIFE_SPACES[index].level;
      const frequency = frequencyAnswers[index];
      const assistance = assistanceAnswers[index];
      return sum + (level * frequency * assistance);
    }, 0);

    const maxPossibleScore = 120; // 5 niveles * 4 freq * 2 assist * 3 (promedio ponderado)

    const result: TestResult = {
      id: Date.now().toString(),
      testType: 'lifeSpace',
      date: new Date().toISOString(),
      score: totalScore,
      maxScore: maxPossibleScore,
      details: {
        bedroom: accessAnswers[0],
        house: accessAnswers[1],
        outside: accessAnswers[2],
        neighborhood: accessAnswers[3],
        town: accessAnswers[4],
        frequency: frequencyAnswers,
        assistance: assistanceAnswers
      } as LifeSpaceResult
    };

    storage.saveTestResult(result);
    setStep('results');
  };

  const calculateScore = () => {
    return accessAnswers.reduce((sum, access, index) => {
      if (!access) return sum;
      const level = LIFE_SPACES[index].level;
      const frequency = frequencyAnswers[index] || 0;
      const assistance = assistanceAnswers[index] || 0;
      return sum + (level * frequency * assistance);
    }, 0);
  };

  const getAutonomyLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'green', message: 'Alta movilidad y autonomía' };
    if (score >= 50) return { level: 'Buena', color: 'blue', message: 'Buena movilidad e independencia' };
    if (score >= 30) return { level: 'Moderada', color: 'yellow', message: 'Movilidad limitada - considerar intervenciones' };
    return { level: 'Limitada', color: 'red', message: 'Movilidad muy restringida - evaluación profesional recomendada' };
  };

  const currentSpaceData = LIFE_SPACES[currentSpace];
  const progress = currentSpace + 1;
  const totalScore = calculateScore();
  const autonomyLevel = getAutonomyLevel(totalScore);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              🌍 Test de Espacio Vital
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <VoiceButton 
              text={
                step === 'results'
                  ? `Test completado. Puntuación de espacio vital: ${totalScore} puntos. Nivel de autonomía: ${autonomyLevel.level}. ${autonomyLevel.message}`
                  : step === 'access'
                    ? `Nivel ${progress} de 5. ${currentSpaceData.title}. Durante la última semana, ${currentSpaceData.description}`
                    : step === 'frequency'
                      ? `¿Con qué frecuencia fue a ${currentSpaceData.title} durante la última semana?`
                      : `¿Necesitó ayuda de otra persona o equipo especial para ir a ${currentSpaceData.title}?`
              }
              autoPlay={step === 'access'}
            />
            <button 
              onClick={onComplete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-full hover:bg-primary-50 transition-colors font-semibold"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Volver</span>
            </button>
          </div>
        </div>

        {step !== 'results' && (
          <ProgressBar current={progress} total={LIFE_SPACES.length} />
        )}

        {step === 'access' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{currentSpaceData.icon}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentSpaceData.title}
              </h2>
              <p className="text-xl text-gray-600">
                Nivel {currentSpaceData.level} de 5
              </p>
            </div>

            <div className="bg-teal-50 p-8 rounded-xl border-2 border-teal-200">
              <p className="text-2xl text-gray-900 text-center font-medium mb-6">
                Durante la última semana:
              </p>
              <h3 className="text-3xl font-bold text-gray-900 text-center">
                {currentSpaceData.description}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <button
                onClick={() => handleAccessAnswer(true)}
                onMouseEnter={() => speak('Sí', 0.8)}
                className="p-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-4xl font-bold shadow-xl hover:scale-105 transition-all"
              >
                ✅ SÍ
              </button>
              <button
                onClick={() => handleAccessAnswer(false)}
                onMouseEnter={() => speak('No', 0.8)}
                className="p-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-4xl font-bold shadow-xl hover:scale-105 transition-all"
              >
                ❌ NO
              </button>
            </div>
          </div>
        )}

        {step === 'frequency' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentSpaceData.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentSpaceData.title}
              </h2>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                ¿Con qué frecuencia en la última semana?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => handleFrequencyAnswer(freq.score)}
                  className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-2xl font-bold shadow-lg hover:scale-105 transition-all"
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'assistance' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentSpaceData.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentSpaceData.title}
              </h2>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                ¿Necesitó ayuda de otra persona?
              </h3>
              <p className="text-lg text-gray-600 text-center">
                (Ayuda física, dispositivos como bastón/andador, etc.)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ASSISTANCE_LEVELS.map((assist) => (
                <button
                  key={assist.value}
                  onClick={() => handleAssistanceAnswer(assist.score)}
                  className={`p-12 rounded-2xl text-3xl font-bold shadow-xl hover:scale-105 transition-all ${
                    assist.value === 1
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {assist.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Resultados del Test
              </h2>
            </div>

            <div className={`bg-${autonomyLevel.color}-50 p-8 rounded-xl border-4 border-${autonomyLevel.color}-200`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Nivel de Movilidad: <span className={`text-${autonomyLevel.color}-600`}>
                  {autonomyLevel.level}
                </span>
              </h3>
              <div className="text-center">
                <p className="text-6xl font-bold mb-4">
                  {totalScore}
                </p>
                <p className="text-xl text-gray-700">
                  {autonomyLevel.message}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Espacios Alcanzados:</h3>
              <div className="space-y-3">
                {LIFE_SPACES.map((space, index) => (
                  <div 
                    key={space.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      accessAnswers[index]
                        ? 'bg-green-100 border-2 border-green-300'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{space.icon}</span>
                      <span className="text-lg font-medium">{space.title}</span>
                    </div>
                    <span className="text-2xl">
                      {accessAnswers[index] ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Recomendaciones:</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                {totalScore < 30 && (
                  <>
                    <li>• Consulte con un profesional sobre programas de movilidad</li>
                    <li>• Considere terapia física para mejorar independencia</li>
                    <li>• Evalúe adaptaciones en el hogar para mayor seguridad</li>
                  </>
                )}
                {totalScore >= 30 && totalScore < 50 && (
                  <>
                    <li>• Intente aumentar gradualmente sus salidas</li>
                    <li>• Considere actividades en grupos locales</li>
                    <li>• Mantenga rutinas de ejercicio regular</li>
                  </>
                )}
                {totalScore >= 50 && (
                  <>
                    <li>• ¡Excelente! Continúe con su nivel de actividad</li>
                    <li>• Mantenga conexiones sociales activas</li>
                    <li>• Considere explorar nuevas actividades</li>
                  </>
                )}
                <li>• Haga este test mensualmente para seguimiento</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <p className="text-lg text-gray-700">
                📌 <strong>Nota:</strong> Los resultados se han guardado. El seguimiento regular ayuda a detectar cambios en movilidad y autonomía.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={onComplete} variant="primary" speakText="Volver al menú principal">
                🏠 Volver al Menú
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, VoiceButton, ProgressBar } from './UI';
import { storage, speak } from '../utils';
import { TestResult, CognitiveTestResult } from '../types';
import { ArrowLeft } from 'lucide-react';

const WORD_LISTS = [
  ['CASA', 'GATO', 'ÁRBOL', 'MESA', 'LIBRO', 'FLOR'],
  ['SOL', 'MAR', 'PAN', 'SILLA', 'RELOJ', 'LUNA'],
  ['AGUA', 'PERRO', 'CARRO', 'PLATO', 'CIELO', 'PUERTA']
];

const DISTRACTOR_WORDS = ['AVE', 'LECHE', 'CAMINO', 'VENTANA', 'ESTRELLA', 'MONTAÑA', 'RÍO', 'TAZA'];

export const CognitiveTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  useEffect(() => {
    // Seleccionar lista al comenzar
    const randomList = WORD_LISTS[Math.floor(Math.random() * WORD_LISTS.length)];
    setCurrentWords(randomList);
  }, []);

  useEffect(() => {
    if (step === 1 && wordIndex < currentWords.length) {
      speak(currentWords[wordIndex], 0.8);
      const timer = setTimeout(() => {
        if (wordIndex < currentWords.length - 1) {
          setWordIndex(wordIndex + 1);
        } else {
          // Pasar a la fase de distracción después de mostrar todas las palabras
          setTimeout(() => setStep(2), 2000);
        }
      }, 3000); // Cada palabra se muestra 3 segundos
      return () => clearTimeout(timer);
    }
  }, [step, wordIndex, currentWords]);

  useEffect(() => {
    if (step === 3) {
      // Crear lista mezclada de palabras correctas y distractoras
      const mixedWords = [...currentWords, ...DISTRACTOR_WORDS.slice(0, 4)]
        .sort(() => Math.random() - 0.5);
      setTestWords(mixedWords);
      setStartTime(Date.now());
    }
  }, [step, currentWords]);

  const startTest = () => {
    setStep(1);
    setWordIndex(0);
  };

  const finishDistraction = () => {
    setStep(3);
  };

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const submitAnswers = () => {
    setEndTime(Date.now());
    const correctWords = selectedWords.filter(w => currentWords.includes(w)).length;
    const timeSpent = Date.now() - startTime;
    
    saveResults(correctWords, currentWords.length, timeSpent);
    setStep(4);
  };

  const saveResults = (correct: number, total: number, time: number) => {
    const score = Math.round((correct / total) * 100);

    const result: TestResult = {
      id: Date.now().toString(),
      testType: 'cognitive',
      date: new Date().toISOString(),
      score: score,
      maxScore: 100,
      details: {
        wordsRemembered: correct,
        totalWords: total,
        timeSpent: time,
        attempts: selectedWords.length
      } as CognitiveTestResult
    };

    storage.saveTestResult(result);
  };

  const correctCount = selectedWords.filter(w => currentWords.includes(w)).length;
  const incorrectCount = selectedWords.filter(w => !currentWords.includes(w)).length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              🧠 Test de Capacidad Cognitiva
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <VoiceButton 
              text={
                step === 0 ? "Test de memoria. Le mostraremos palabras que debe recordar." :
                step === 1 ? `Palabra número ${wordIndex + 1}: ${currentWords[wordIndex]}` :
                step === 2 ? "Ahora haremos una pequeña pausa antes de la prueba" :
                step === 3 ? "Seleccione las palabras que recuerda haber visto" :
                "Test completado. Aquí están sus resultados."
              }
              autoPlay={step === 0}
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

        <ProgressBar current={step} total={4} />

        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-900">📋 Instrucciones:</h3>
              <ul className="space-y-3 text-xl text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3">1.</span>
                  <span>Le mostraremos <strong>6 palabras</strong> de una en una.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">2.</span>
                  <span>Cada palabra aparecerá durante <strong>3 segundos</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">3.</span>
                  <span>Después de una breve pausa, debe <strong>seleccionar</strong> las palabras que recuerde.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">⏱️</span>
                  <span>Tiempo estimado: <strong>3-4 minutos</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
              <p className="text-lg text-gray-700">
                💡 <strong>Consejo:</strong> Intente crear una historia o imagen mental con las palabras para recordarlas mejor.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={startTest}
                variant="primary"
                speakText="Comenzar test de memoria"
              >
                ▶️ Comenzar Test
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              👀 Observe y recuerde esta palabra:
            </h2>
            
            <div className="bg-linear-to-r from-purple-100 to-blue-100 p-16 rounded-xl min-h-75 flex items-center justify-center">
              <div className="text-7xl font-bold text-purple-900 animate-pulse">
                {currentWords[wordIndex]}
              </div>
            </div>

            <div className="text-2xl text-gray-600">
              Palabra {wordIndex + 1} de {currentWords.length}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900">
              ⏸️ Momento de Pausa
            </h2>
            
            <div className="bg-blue-50 p-12 rounded-xl">
              <div className="text-6xl mb-6">☕</div>
              <p className="text-2xl text-gray-700 mb-6">
                Respire profundo y relájese unos segundos...
              </p>
              <p className="text-xl text-gray-600 mb-8">
                Esto ayuda a evaluar su memoria a corto plazo
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={finishDistraction}
                variant="primary"
                speakText="Continuar con la prueba"
              >
                ▶️ Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              ✅ Seleccione las palabras que vio antes
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xl text-gray-700 text-center">
                Haga clic en las palabras que recuerde haber visto
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {testWords.map((word, index) => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={index}
                    onClick={() => toggleWord(word)}
                    className={`p-6 text-2xl font-bold rounded-xl border-4 transition-all ${
                      isSelected
                        ? 'bg-green-500 text-white border-green-600 scale-105'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            <div className="bg-gray-100 p-4 rounded-xl text-center">
              <p className="text-xl text-gray-700">
                Palabras seleccionadas: <strong>{selectedWords.length}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={submitAnswers}
                variant="success"
                disabled={selectedWords.length === 0}
                speakText="Enviar respuestas"
              >
                ✅ Enviar Respuestas
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-6">
                ¡Test Completado!
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-2">✅ Correctas</h3>
                <p className="text-5xl font-bold text-green-600">
                  {correctCount}/{currentWords.length}
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-900 mb-2">❌ Incorrectas</h3>
                <p className="text-5xl font-bold text-red-600">
                  {incorrectCount}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3">📊 Evaluación:</h3>
              <p className="text-2xl font-bold text-blue-600">
                {correctCount === currentWords.length ? '¡Excelente memoria!' :
                 correctCount >= 4 ? 'Muy buena memoria' :
                 correctCount >= 3 ? 'Memoria normal' :
                 'Podría mejorar - considere consultar con un profesional'}
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <p className="text-lg text-gray-700">
                📌 <strong>Nota:</strong> Los resultados se han guardado. Repita este test regularmente para hacer seguimiento.
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

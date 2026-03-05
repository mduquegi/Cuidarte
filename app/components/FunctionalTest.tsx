'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, VoiceButton, ProgressBar } from './UI';
import { storage } from '../utils';
import { TestResult, FunctionalTestResult } from '../types';

export const FunctionalTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [balanceTime, setBalanceTime] = useState(0);
  const [balanceStartTime, setBalanceStartTime] = useState<number | null>(null);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [isHoldingButton, setIsHoldingButton] = useState(false);
  const [showReactionButton, setShowReactionButton] = useState(false);

  // Timer para el test de equilibrio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHoldingButton && balanceStartTime) {
      interval = setInterval(() => {
        setBalanceTime(Date.now() - balanceStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isHoldingButton, balanceStartTime]);

  // Test de reacción automático
  useEffect(() => {
    if (step === 2) {
      const randomDelay = 2000 + Math.random() * 3000; // Entre 2-5 segundos
      const timeout = setTimeout(() => {
        setShowReactionButton(true);
        setReactionStartTime(Date.now());
      }, randomDelay);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const startBalanceTest = () => {
    setIsHoldingButton(true);
    setBalanceStartTime(Date.now());
    setStep(1);
  };

  const stopBalanceTest = () => {
    setIsHoldingButton(false);
    const finalTime = balanceStartTime ? Date.now() - balanceStartTime : 0;
    setBalanceTime(finalTime);
    setStep(2);
  };

  const handleReactionClick = () => {
    if (reactionStartTime && showReactionButton) {
      const reaction = Date.now() - reactionStartTime;
      setReactionTime(reaction);
      saveResults(balanceTime, reaction);
      setStep(3);
    }
  };

  const saveResults = (balance: number, reaction: number) => {
    // Calcular puntuación
    const balanceScore = Math.min((balance / 1000) * 20, 50); // Máximo 50 puntos por 2.5+ segundos
    const reactionScore = Math.max(50 - (reaction / 100) * 5, 0); // Máximo 50 puntos
    const totalScore = Math.round(balanceScore + reactionScore);

    const result: TestResult = {
      id: Date.now().toString(),
      testType: 'functional',
      date: new Date().toISOString(),
      score: totalScore,
      maxScore: 100,
      details: {
        balanceTime: balance,
        reactionTime: reaction,
        completed: true
      } as FunctionalTestResult
    };

    storage.saveTestResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            📊 Test de Capacidad Funcional
          </h1>
          <VoiceButton 
            text={
              step === 0 ? "Test de capacidad funcional. Evaluará su equilibrio y tiempo de reacción." :
              step === 1 ? "Mantenga presionado el botón tanto tiempo como pueda." :
              step === 2 ? "Espere a que aparezca el botón verde y haga clic lo más rápido posible." :
              "Resultados del test completado."
            }
            autoPlay={step === 0}
          />
        </div>

        <ProgressBar current={step} total={3} />

        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">📋 Instrucciones:</h3>
              <ul className="space-y-3 text-xl text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3">1.</span>
                  <span><strong>Test de equilibrio:</strong> Mantendrá presionado un botón el mayor tiempo posible.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">2.</span>
                  <span><strong>Test de reacción:</strong> Debe hacer clic cuando aparezca un botón verde.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">⏱️</span>
                  <span>Tiempo estimado: <strong>2-3 minutos</strong></span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setStep(1)}
                variant="primary"
                speakText="Comenzar test de equilibrio"
              >
                ▶️ Comenzar Test
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              🧘 Test de Equilibrio
            </h2>
            <p className="text-2xl text-gray-700">
              Mantenga presionado el botón abajo el mayor tiempo posible
            </p>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="text-6xl font-bold text-blue-600 mb-6">
                {(balanceTime / 1000).toFixed(1)}s
              </div>
              
              <button
                onMouseDown={balanceStartTime ? undefined : startBalanceTest}
                onMouseUp={stopBalanceTest}
                onTouchStart={balanceStartTime ? undefined : startBalanceTest}
                onTouchEnd={stopBalanceTest}
                className={`w-64 h-64 rounded-full text-3xl font-bold shadow-2xl transition-all ${
                  isHoldingButton
                    ? 'bg-green-600 text-white scale-110'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isHoldingButton ? '✋ Mantenga presionado' : '👆 Presione aquí'}
              </button>
            </div>

            <p className="text-lg text-gray-600 italic">
              * Suelte cuando no pueda mantener más
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              ⚡ Test de Tiempo de Reacción
            </h2>
            <p className="text-2xl text-gray-700">
              {!showReactionButton 
                ? 'Espere... el botón aparecerá pronto'
                : '¡Haga clic ahora!'}
            </p>
            
            <div className="bg-gray-100 p-12 rounded-xl min-h-75 flex items-center justify-center">
              {!showReactionButton ? (
                <div className="text-6xl animate-pulse">⏳</div>
              ) : (
                <button
                  onClick={handleReactionClick}
                  className="w-64 h-64 rounded-full bg-green-500 hover:bg-green-600 text-white text-3xl font-bold shadow-2xl animate-pulse"
                >
                  ✅ ¡CLIC AQUÍ!
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-600 mb-6">
                ¡Test Completado!
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-2">🧘 Equilibrio</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {(balanceTime / 1000).toFixed(1)}s
                </p>
                <p className="text-gray-600 mt-2">
                  {balanceTime > 3000 ? 'Excelente' : balanceTime > 1500 ? 'Bueno' : 'Puede mejorar'}
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-2">⚡ Reacción</h3>
                <p className="text-4xl font-bold text-green-600">
                  {reactionTime}ms
                </p>
                <p className="text-gray-600 mt-2">
                  {reactionTime && reactionTime < 500 ? 'Excelente' : reactionTime && reactionTime < 800 ? 'Bueno' : 'Normal'}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <p className="text-lg text-gray-700">
                📌 <strong>Nota:</strong> Los resultados se han guardado. Puede ver su progreso en la sección "Mis Resultados".
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

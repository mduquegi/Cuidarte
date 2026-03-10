'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '../utils';
import { TestResult, FunctionalTestResult } from '../types';
import { ArrowLeft } from 'lucide-react';
import { VoiceButton } from './UI';
import { useLanguage } from '../LanguageContext';

export const FunctionalTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { t } = useLanguage();
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
    <section className="py-8 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📊 {t.functionalTest.title}</h1>
            <div className="flex items-center gap-3">
              <VoiceButton 
                text={
                  step === 0 ? t.functionalTest.voiceInstructions :
                  step === 1 ? t.functionalTest.voiceBalance :
                  step === 2 && !showReactionButton ? t.functionalTest.voiceReactionWait :
                  step === 2 && showReactionButton ? t.functionalTest.voiceReactionNow :
                  t.functionalTest.voiceComplete.replace('{balance}', (balanceTime / 1000).toFixed(1)).replace('{reaction}', reactionTime?.toString() || '0')
                }
                autoPlay={step === 0}
              />
              <button 
                onClick={onComplete}
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-full hover:bg-primary-50 transition-colors font-semibold"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{t.functionalTest.back}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 0: Instrucciones */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-primary-700">📋 {t.functionalTest.instructions}</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span><strong>{t.functionalTest.balanceTest}:</strong> {t.functionalTest.balanceDescription}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span><strong>{t.functionalTest.reactionTest}:</strong> {t.functionalTest.reactionDescription}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>⏱️ {t.functionalTest.estimatedTime}: <strong>2-3 {t.functionalTest.minutes}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-600 shadow-soft transition-all"
                >
                  ▶️ {t.functionalTest.startTest}
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Test de Equilibrio */}
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">🧘 {t.functionalTest.balanceTest}</h2>
              <p className="text-lg mb-6 text-gray-600">
                {t.functionalTest.balanceInstructions}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-8 mb-6">
                <div className="text-6xl font-bold text-primary-500 mb-6">
                  {(balanceTime / 1000).toFixed(1)}s
                </div>
                
                <button
                  onMouseDown={balanceStartTime ? undefined : startBalanceTest}
                  onMouseUp={stopBalanceTest}
                  onTouchStart={balanceStartTime ? undefined : startBalanceTest}
                  onTouchEnd={stopBalanceTest}
                  className={`w-64 h-64 rounded-full text-xl font-semibold shadow-2xl transition-all ${
                    isHoldingButton 
                      ? 'bg-green-500 hover:bg-green-600 text-white scale-95' 
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {isHoldingButton ? '✋ ' + t.functionalTest.holdButton : '👆 ' + t.functionalTest.holdButton}
                </button>
              </div>

              <p className="text-sm italic text-gray-500">
                * {t.functionalTest.releaseButton}
              </p>
            </div>
          )}

          {/* Step 2: Test de Reacción */}
          {step === 2 && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">⚡ {t.functionalTest.reactionTest}</h2>
              <p className="text-lg mb-6 text-gray-600">
                {!showReactionButton 
                  ? t.functionalTest.waitForGreen
                  : t.functionalTest.clickNow}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center" style={{ minHeight: '400px' }}>
                {!showReactionButton ? (
                  <div className="text-7xl animate-pulse">⏳</div>
                ) : (
                  <button
                    onClick={handleReactionClick}
                    className="w-64 h-64 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl font-semibold shadow-2xl animate-pulse"
                  >
                    ✅ {t.functionalTest.clickNow}!
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Resultados */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-green-600 mb-6">
                  {t.functionalTest.testComplete}!
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Resultado de Equilibrio */}
                <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-700 mb-2">🧘 {t.functionalTest.balanceTest}</h3>
                  <p className="text-5xl font-bold text-primary-600 mb-2">
                    {(balanceTime / 1000).toFixed(1)}s
                  </p>
                  <p className="text-gray-600">
                    {balanceTime > 3000 ? 'Excelente' : balanceTime > 1500 ? 'Bueno' : 'Puede mejorar'}
                  </p>
                </div>

                {/* Resultado de Reacción */}
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-green-700 mb-2">⚡ {t.functionalTest.reactionTest}</h3>
                  <p className="text-5xl font-bold text-green-600 mb-2">
                    {reactionTime}ms
                  </p>
                  <p className="text-gray-600">
                    {reactionTime && reactionTime < 500 ? 'Excelente' : reactionTime && reactionTime < 800 ? 'Bueno' : 'Normal'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-yellow-800">
                  📌 <strong>Nota:</strong> Los resultados se han guardado. Puede ver su progreso en la sección "Mis Resultados".
                </p>
              </div>

              <div className="text-center">
                <button 
                  onClick={onComplete}
                  className="px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-600 shadow-soft transition-all"
                >
                  🏠 {t.functionalTest.backToHome}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

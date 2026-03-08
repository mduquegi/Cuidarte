'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '../utils';
import { TestResult, FunctionalTestResult } from '../types';
import { ArrowLeft } from 'lucide-react';

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
    <section className="py-8 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📊 Test de Capacidad Funcional</h1>
            <button 
              onClick={onComplete}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
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
                <h3 className="text-xl font-bold mb-4 text-primary-700">📋 Instrucciones:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span><strong>Test de equilibrio:</strong> Mantendrá presionado un botón el mayor tiempo posible.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span><strong>Test de reacción:</strong> Debe hacer clic cuando aparezca un botón verde.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>⏱️ Tiempo estimado: <strong>2-3 minutos</strong></span>
                  </li>
                </ul>
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-600 shadow-soft transition-all"
                >
                  ▶️ Comenzar Test
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Test de Equilibrio */}
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">🧘 Test de Equilibrio</h2>
              <p className="text-lg mb-6 text-gray-600">
                Mantenga presionado el botón abajo el mayor tiempo posible
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
                  {isHoldingButton ? '✋ Mantenga presionado' : '👆 Presione aquí'}
                </button>
              </div>

              <p className="text-sm italic text-gray-500">
                * Suelte cuando no pueda mantener más
              </p>
            </div>
          )}

          {/* Step 2: Test de Reacción */}
          {step === 2 && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">⚡ Test de Tiempo de Reacción</h2>
              <p className="text-lg mb-6 text-gray-600">
                {!showReactionButton 
                  ? 'Espere... el botón aparecerá pronto'
                  : '¡Haga clic ahora!'}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center" style={{ minHeight: '400px' }}>
                {!showReactionButton ? (
                  <div className="text-7xl animate-pulse">⏳</div>
                ) : (
                  <button
                    onClick={handleReactionClick}
                    className="w-64 h-64 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl font-semibold shadow-2xl animate-pulse"
                  >
                    ✅ ¡CLIC AQUÍ!
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
                  ¡Test Completado!
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Resultado de Equilibrio */}
                <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-700 mb-2">🧘 Equilibrio</h3>
                  <p className="text-5xl font-bold text-primary-600 mb-2">
                    {(balanceTime / 1000).toFixed(1)}s
                  </p>
                  <p className="text-gray-600">
                    {balanceTime > 3000 ? 'Excelente' : balanceTime > 1500 ? 'Bueno' : 'Puede mejorar'}
                  </p>
                </div>

                {/* Resultado de Reacción */}
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-green-700 mb-2">⚡ Reacción</h3>
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
                  🏠 Volver al Menú
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
                </div>

                {step === 0 && (
                  <div>
                    <div className="bg-light p-4 rounded mb-4">
                      <h3 className="fs-4 fw-bold mb-3">📋 Instrucciones:</h3>
                      <ul className="fs-5">
                        <li className="mb-2">
                          <strong>Test de equilibrio:</strong> Mantendrá presionado un botón el mayor tiempo posible.
                        </li>
                        <li className="mb-2">
                          <strong>Test de reacción:</strong> Debe hacer clic cuando aparezca un botón verde.
                        </li>
                        <li className="mb-2">
                          ⏱️ Tiempo estimado: <strong>2-3 minutos</strong>
                        </li>
                      </ul>
                    </div>

                    <div className="text-center mt-5">
                      <button className="btn btn-lg btn-primary rounded-pill px-5" onClick={() => setStep(1)}>
                        ▶️ Comenzar Test
                      </button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="text-center">
                    <h2 className="fs-3 fw-bold mb-3">🧘 Test de Equilibrio</h2>
                    <p className="fs-5 mb-4">
                      Mantenga presionado el botón abajo el mayor tiempo posible
                    </p>
                    
                    <div className="bg-light p-5 rounded mb-4">
                      <div className="display-1 fw-bold text-primary mb-4">
                        {(balanceTime / 1000).toFixed(1)}s
                      </div>
                      
                      <button
                        onMouseDown={balanceStartTime ? undefined : startBalanceTest}
                        onMouseUp={stopBalanceTest}
                        onTouchStart={balanceStartTime ? undefined : startBalanceTest}
                        onTouchEnd={stopBalanceTest}
                        className={`btn btn-lg rounded-circle shadow-lg ${
                          isHoldingButton ? 'btn-success' : 'btn-primary'
                        }`}
                        style={{width: '250px', height: '250px', fontSize: '1.5rem'}}
                      >
                        {isHoldingButton ? '✋ Mantenga presionado' : '👆 Presione aquí'}
                      </button>
                    </div>

                    <p className="fst-italic text-muted">
                      * Suelte cuando no pueda mantener más
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center">
                    <h2 className="fs-3 fw-bold mb-3">⚡ Test de Tiempo de Reacción</h2>
                    <p className="fs-5 mb-4">
                      {!showReactionButton 
                        ? 'Espere... el botón aparecerá pronto'
                        : '¡Haga clic ahora!'}
                    </p>
                    
                    <div className="bg-light p-5 rounded" style={{minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {!showReactionButton ? (
                        <div className="display-1">⏳</div>
                      ) : (
                        <button
                          onClick={handleReactionClick}
                          className="btn btn-success btn-lg rounded-circle shadow-lg"
                          style={{width: '250px', height: '250px', fontSize: '1.5rem', animation: 'pulse 1s infinite'}}
                        >
                          ✅ ¡CLIC AQUÍ!
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="text-center mb-4">
                      <div className="display-1 mb-3">✅</div>
                      <h2 className="fs-3 fw-bold text-success mb-4">
                        ¡Test Completado!
                      </h2>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-primary">
                          <div className="card-body text-center">
                            <h3 className="fs-5 fw-bold text-primary mb-2">🧘 Equilibrio</h3>
                            <p className="display-4 fw-bold text-primary mb-2">
                              {(balanceTime / 1000).toFixed(1)}s
                            </p>
                            <p className="text-muted">
                              {balanceTime > 3000 ? 'Excelente' : balanceTime > 1500 ? 'Bueno' : 'Puede mejorar'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-success">
                          <div className="card-body text-center">
                            <h3 className="fs-5 fw-bold text-success mb-2">⚡ Reacción</h3>
                            <p className="display-4 fw-bold text-success mb-2">
                              {reactionTime}ms
                            </p>
                            <p className="text-muted">
                              {reactionTime && reactionTime < 500 ? 'Excelente' : reactionTime && reactionTime < 800 ? 'Bueno' : 'Normal'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-warning" role="alert">
                      📌 <strong>Nota:</strong> Los resultados se han guardado. Puede ver su progreso en la sección "Mis Resultados".
                    </div>

                    <div className="text-center mt-4">
                      <button className="btn btn-lg btn-primary rounded-pill px-5" onClick={onComplete}>
                        🏠 Volver al Menú
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

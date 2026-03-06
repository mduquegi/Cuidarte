'use client';

import React, { useState, useEffect } from 'react';
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
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="fw-bold mb-0">📊 Test de Capacidad Funcional</h1>
                  <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onComplete}>
                    ← Volver
                  </button>
                </div>

                {/* Progress */}
                <div className="progress mb-5" style={{height: '8px'}}>
                  <div className="progress-bar" role="progressbar" style={{width: `${(step / 3) * 100}%`}} aria-valuenow={step} aria-valuemin={0} aria-valuemax={3}></div>
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

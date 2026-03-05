'use client';

import React, { useState } from 'react';
import { Button, Card, VoiceButton, ProgressBar } from './UI';
import { storage, speak } from '../utils';
import { TestResult, MentalTestResult } from '../types';

const QUESTIONS = [
  {
    id: 1,
    question: '¿Está satisfecho/a con su vida?',
    positiveAnswer: 'Sí', // Respuesta saludable
    yesScore: 0,
    noScore: 1
  },
  {
    id: 2,
    question: '¿Ha abandonado muchas de sus actividades e intereses?',
    positiveAnswer: 'No',
    yesScore: 1,
    noScore: 0
  },
  {
    id: 3,
    question: '¿Siente que su vida está vacía?',
    positiveAnswer: 'No',
    yesScore: 1,
    noScore: 0
  },
  {
    id: 4,
    question: '¿Se siente aburrido/a a menudo?',
    positiveAnswer: 'No',
    yesScore: 1,
    noScore: 0
  },
  {
    id: 5,
    question: '¿Está de buen ánimo la mayor parte del tiempo?',
    positiveAnswer: 'Sí',
    yesScore: 0,
    noScore: 1
  }
];

export const MentalTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (isYes: boolean) => {
    const question = QUESTIONS[currentQuestion];
    const score = isYes ? question.yesScore : question.noScore;
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    const maxScore = 5;
    
    let riskLevel: 'bajo' | 'moderado' | 'alto';
    if (totalScore === 0) riskLevel = 'bajo';
    else if (totalScore <= 2) riskLevel = 'moderado';
    else riskLevel = 'alto';

    const result: TestResult = {
      id: Date.now().toString(),
      testType: 'mental',
      date: new Date().toISOString(),
      score: maxScore - totalScore, // Invertir: más alto = mejor
      maxScore: maxScore,
      details: {
        answers: finalAnswers,
        totalScore: totalScore,
        riskLevel: riskLevel
      } as MentalTestResult
    };

    storage.saveTestResult(result);
    setIsComplete(true);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const getRiskLevel = () => {
    if (totalScore === 0) return { level: 'Excelente', color: 'green', message: 'No se detectan síntomas de depresión' };
    if (totalScore <= 2) return { level: 'Leve', color: 'yellow', message: 'Algunos síntomas leves. Monitoreo recomendado' };
    return { level: 'Importante', color: 'red', message: 'Se recomienda consultar con un profesional de salud mental' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            💭 Test de Estado Mental
          </h1>
          <VoiceButton 
            text={
              !isComplete 
                ? `Pregunta ${currentQuestion + 1} de 5: ${QUESTIONS[currentQuestion].question}`
                : "Test completado. Aquí están sus resultados."
            }
            autoPlay={true}
          />
        </div>

        {!isComplete ? (
          <>
            <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />

            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
                <div className="text-center mb-4">
                  <span className="text-xl text-indigo-600 font-bold">
                    Pregunta {currentQuestion + 1} de {QUESTIONS.length}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  {QUESTIONS[currentQuestion].question}
                </h2>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <p className="text-lg text-gray-700 text-center">
                  💡 Responda con sinceridad según cómo se ha sentido durante la última semana
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <button
                  onClick={() => handleAnswer(true)}
                  onMouseEnter={() => speak('Sí', 0.8)}
                  className="p-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-4xl font-bold shadow-xl hover:scale-105 transition-all"
                >
                  ✅ SÍ
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  onMouseEnter={() => speak('No', 0.8)}
                  className="p-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-4xl font-bold shadow-xl hover:scale-105 transition-all"
                >
                  ❌ NO
                </button>
              </div>

              {currentQuestion > 0 && (
                <div className="text-center text-gray-500 mt-4">
                  <p className="text-lg">
                    Preguntas respondidas: {currentQuestion} de {QUESTIONS.length}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Resultados del Test
              </h2>
            </div>

            <div className={`bg-${getRiskLevel().color}-50 p-8 rounded-xl border-4 border-${getRiskLevel().color}-200`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Estado Emocional: <span className={`text-${getRiskLevel().color}-600`}>
                  {getRiskLevel().level}
                </span>
              </h3>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  {totalScore === 0 ? '😊' : totalScore <= 2 ? '😐' : '😟'}
                </div>
                <p className="text-xl text-gray-700">
                  Puntuación: <strong>{totalScore} de 5</strong>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3">📋 Interpretación:</h3>
              <p className="text-lg text-gray-700 mb-4">
                {getRiskLevel().message}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>0 puntos:</strong> Estado emocional saludable</li>
                <li>• <strong>1-2 puntos:</strong> Síntomas leves - monitoreo recomendado</li>
                <li>• <strong>3+ puntos:</strong> Consulta profesional recomendada</li>
              </ul>
            </div>

            {totalScore >= 2 && (
              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Recomendaciones:</h3>
                <ul className="space-y-2 text-gray-700 text-lg">
                  <li>• Consulte con su médico o un profesional de salud mental</li>
                  <li>• Mantenga contacto regular con familiares y amigos</li>
                  <li>• Realice actividades que le gusten</li>
                  <li>• Mantenga una rutina diaria saludable</li>
                  <li>• Considere actividades sociales o grupos de apoyo</li>
                </ul>
              </div>
            )}

            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
              <p className="text-lg text-gray-700">
                📌 <strong>Nota:</strong> Este test es una herramienta de detección, no un diagnóstico. Los resultados se han guardado para seguimiento longitudinal.
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

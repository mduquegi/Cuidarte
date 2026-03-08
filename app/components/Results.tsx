'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Card, VoiceButton } from './UI';
import { storage, formatDate } from '../utils';
import { TestResult } from '../types';

const TEST_NAMES = {
  functional: '📊 Capacidad Funcional',
  cognitive: '🧠 Capacidad Cognitiva',
  mental: '💭 Estado Mental',
  lifeSpace: '🌍 Espacio Vital'
};

const TEST_COLORS = {
  functional: '#3b82f6',
  cognitive: '#8b5cf6',
  mental: '#ec4899',
  lifeSpace: '#10b981'
};

export const Results: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const allResults = storage.getAllResults();
    setResults(allResults);
  };

  const getFilteredResults = () => {
    if (selectedType === 'all') return results;
    return results.filter(r => r.testType === selectedType);
  };

  const getChartData = () => {
    const filtered = getFilteredResults();
    return filtered.map(r => ({
      date: formatDate(r.date),
      fullDate: r.date,
      score: r.score,
      percentage: Math.round((r.score / r.maxScore) * 100),
      type: r.testType
    }));
  };

  const getLatestResults = () => {
    const types = ['functional', 'cognitive', 'mental', 'lifeSpace'] as const;
    return types.map(type => {
      const typeResults = results.filter(r => r.testType === type);
      const latest = typeResults.length > 0 ? typeResults[typeResults.length - 1] : null;
      return {
        type,
        name: TEST_NAMES[type],
        latest,
        count: typeResults.length,
        color: TEST_COLORS[type]
      };
    });
  };

  const getTotalTests = () => results.length;

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const avg = results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / results.length;
    return Math.round(avg);
  };

  const clearAllData = () => {
    if (confirm('¿Está seguro de que desea borrar todos los resultados? Esta acción no se puede deshacer.')) {
      storage.clearAll();
      setResults([]);
    }
  };

  const latestResults = getLatestResults();
  const chartData = getChartData();

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📈 Mis Resultados
            </h1>
            <p className="text-xl text-gray-600">
              Seguimiento longitudinal de su salud
            </p>
          </div>
          <VoiceButton 
            text="Panel de resultados. Aquí puede ver el historial de todos sus tests."
            autoPlay={false}
          />
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No hay resultados todavía
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Complete algunos tests para ver su progreso aquí
            </p>
            <Button onClick={onBack} variant="primary" speakText="Volver al menú">
              🏠 Volver al Menú
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Resumen General */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Total de Tests</h3>
                <p className="text-5xl font-bold text-blue-600">{getTotalTests()}</p>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-2">Promedio General</h3>
                <p className="text-5xl font-bold text-green-600">{getAverageScore()}%</p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-2">Tipos de Tests</h3>
                <p className="text-5xl font-bold text-purple-600">
                  {latestResults.filter(r => r.count > 0).length}
                </p>
              </div>
            </div>

            {/* Últimos Resultados por Tipo */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Últimos Resultados por Categoría
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {latestResults.map(({ type, name, latest, count, color }) => (
                  <div
                    key={type}
                    className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold" style={{ color }}>
                        {name}
                      </h3>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                        {count} test{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {latest ? (
                      <>
                        <div className="mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold" style={{ color }}>
                              {Math.round((latest.score / latest.maxScore) * 100)}%
                            </span>
                            <span className="text-lg text-gray-600">
                              ({latest.score}/{latest.maxScore})
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          📅 {formatDate(latest.date)}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400 italic">Sin resultados aún</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Gráfica de Evolución
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                    selectedType === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📊 Todos
                </button>
                {Object.entries(TEST_NAMES).map(([type, name]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                      selectedType === type
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    style={
                      selectedType === type
                        ? { backgroundColor: TEST_COLORS[type as keyof typeof TEST_COLORS] }
                        : {}
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Gráfico */}
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value}%`, 'Puntuación']}
                        labelFormatter={(label) => `Fecha: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke={selectedType === 'all' ? '#3b82f6' : TEST_COLORS[selectedType as keyof typeof TEST_COLORS]}
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                        name="Puntuación"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No hay datos para mostrar en el gráfico
                  </div>
                )}
              </div>
            </div>

            {/* Historial Detallado */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📜 Historial Completo
              </h2>
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-lg font-bold text-gray-900">Fecha</th>
                        <th className="px-6 py-3 text-left text-lg font-bold text-gray-900">Test</th>
                        <th className="px-6 py-3 text-left text-lg font-bold text-gray-900">Puntuación</th>
                        <th className="px-6 py-3 text-left text-lg font-bold text-gray-900">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...results].reverse().map((result, index) => {
                        const percentage = Math.round((result.score / result.maxScore) * 100);
                        return (
                          <tr key={result.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 text-lg text-gray-900">{formatDate(result.date)}</td>
                            <td className="px-6 py-4 text-lg font-medium text-gray-900">
                              {TEST_NAMES[result.testType]}
                            </td>
                            <td className="px-6 py-4 text-lg text-gray-900">
                              {result.score}/{result.maxScore}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-4 py-2 rounded-full font-bold text-lg ${
                                  percentage >= 80
                                    ? 'bg-green-100 text-green-800'
                                    : percentage >= 60
                                    ? 'bg-blue-100 text-blue-800'
                                    : percentage >= 40
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t-2">
              <Button onClick={onBack} variant="primary" speakText="Volver al menú">
                🏠 Volver al Menú
              </Button>
              
              <Button onClick={clearAllData} variant="danger" speakText="Borrar todos los datos">
                🗑️ Borrar Todos los Datos
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

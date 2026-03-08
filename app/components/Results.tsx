'use client';

import { useState, useEffect } from 'react';
import { storage } from '../utils';
import { TestResult } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Trash2, Download } from 'lucide-react';

interface ResultsProps {
  onBack: () => void;
}

export function Results({ onBack }: ResultsProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<'all' | 'functional' | 'cognitive' | 'mental' | 'lifeSpace'>('all');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const allResults = storage.getAllResults();
    setResults(allResults);
  };

  const filteredResults = selectedTest === 'all' 
    ? results 
    : results.filter(r => r.testType === selectedTest);

  const getTestName = (type: TestResult['testType']) => {
    const names = {
      functional: 'Test Funcional',
      cognitive: 'Test Cognitivo',
      mental: 'Estado Mental',
      lifeSpace: 'Espacio de Vida'
    };
    return names[type];
  };

  const getScorePercentage = (result: TestResult) => {
    return Math.round((result.score / result.maxScore) * 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const clearAllData = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los resultados? Esta acción no se puede deshacer.')) {
      storage.clearAll();
      setResults([]);
      alert('Todos los datos han sido eliminados.');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuidarte-resultados-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Preparar datos para gráfico de progreso
  const chartData = filteredResults.map((result, index) => ({
    name: `Test ${index + 1}`,
    fecha: new Date(result.date).toLocaleDateString('es-MX'),
    porcentaje: getScorePercentage(result),
    puntuacion: result.score
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Volver"
            >
              <ArrowLeft className="text-primary-600" size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-primary-600">Mis Resultados</h1>
              <p className="text-gray-600 mt-2">Historial de evaluaciones y progreso</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={exportData}
              disabled={results.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={20} />
              Exportar
            </button>
            <button
              onClick={clearAllData}
              disabled={results.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={20} />
              Limpiar Datos
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedTest('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedTest === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({results.length})
          </button>
          <button
            onClick={() => setSelectedTest('functional')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedTest === 'functional'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Funcional ({results.filter(r => r.testType === 'functional').length})
          </button>
          <button
            onClick={() => setSelectedTest('cognitive')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedTest === 'cognitive'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cognitivo ({results.filter(r => r.testType === 'cognitive').length})
          </button>
          <button
            onClick={() => setSelectedTest('mental')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedTest === 'mental'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mental ({results.filter(r => r.testType === 'mental').length})
          </button>
          <button
            onClick={() => setSelectedTest('lifeSpace')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedTest === 'lifeSpace'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Espacio de Vida ({results.filter(r => r.testType === 'lifeSpace').length})
          </button>
        </div>

        {/* Contenido */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay resultados aún</h3>
            <p className="text-gray-500">Completa algunas evaluaciones para ver tu progreso aquí</p>
          </div>
        ) : (
          <>
            {/* Gráfico de progreso */}
            {chartData.length >= 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progreso en el Tiempo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="porcentaje" 
                      stroke="#007bff" 
                      strokeWidth={3}
                      name="Porcentaje (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tabla de resultados */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                      <th className="px-6 py-4 text-left font-semibold">Test</th>
                      <th className="px-6 py-4 text-left font-semibold">Puntuación</th>
                      <th className="px-6 py-4 text-left font-semibold">Porcentaje</th>
                      <th className="px-6 py-4 text-left font-semibold">Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => {
                      const percentage = getScorePercentage(result);
                      return (
                        <tr key={result.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900">
                            {new Date(result.date).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {getTestName(result.testType)}
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {result.score} / {result.maxScore}
                          </td>
                          <td className={`px-6 py-4 font-bold ${getScoreColor(percentage)}`}>
                            {percentage}%
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="text-primary-500 hover:text-primary-700 font-medium"
                              onClick={() => alert(JSON.stringify(result.details, null, 2))}
                            >
                              Ver más
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-gray-600 font-semibold mb-2">Total de Evaluaciones</h4>
                <p className="text-4xl font-bold text-primary-600">{filteredResults.length}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-gray-600 font-semibold mb-2">Promedio General</h4>
                <p className="text-4xl font-bold text-primary-600">
                  {filteredResults.length > 0
                    ? Math.round(
                        filteredResults.reduce((acc, r) => acc + getScorePercentage(r), 0) /
                          filteredResults.length
                      )
                    : 0}%
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-gray-600 font-semibold mb-2">Última Evaluación</h4>
                <p className="text-lg font-bold text-primary-600">
                  {filteredResults.length > 0
                    ? new Date(filteredResults[filteredResults.length - 1].date).toLocaleDateString('es-MX')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

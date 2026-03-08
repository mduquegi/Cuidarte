'use client';

import { useState, useEffect } from 'react';
import { storage } from '../utils';
import { TestResult, UserProfile } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

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
    const profile = storage.getProfile();
    const doc = new jsPDF();
    
    // Colores de CuidArte
    const primaryColor = [0, 123, 255]; // #007bff
    const accentColor = [255, 128, 0];  // #ff8000
    
    // Header con logo y título
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CuidArte', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Evaluaciones de Salud', 105, 30, { align: 'center' });
    
    // Información del paciente
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Paciente', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    if (profile) {
      doc.text(`Nombre: ${profile.name}`, 20, 65);
      doc.text(`Edad: ${profile.age} años`, 20, 72);
    }
    doc.text(`Fecha del reporte: ${new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, 79);
    doc.text(`Total de evaluaciones: ${results.length}`, 20, 86);
    
    // Línea separadora
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 92, 190, 92);
    
    // Resumen de resultados
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Evaluaciones', 20, 105);
    
    let yPosition = 115;
    const testsGrouped = {
      functional: results.filter(r => r.testType === 'functional'),
      cognitive: results.filter(r => r.testType === 'cognitive'),
      mental: results.filter(r => r.testType === 'mental'),
      lifeSpace: results.filter(r => r.testType === 'lifeSpace')
    };
    
    const testNames = {
      functional: '📊 Test Funcional',
      cognitive: '🧠 Test Cognitivo',
      mental: '💭 Estado Mental',
      lifeSpace: '🌍 Espacio Vital'
    };
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    
    Object.entries(testsGrouped).forEach(([type, tests]) => {
      if (tests.length > 0) {
        const testName = testNames[type as keyof typeof testNames];
        const avgScore = tests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / tests.length;
        
        doc.setFont('helvetica', 'bold');
        doc.text(testName, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`Realizados: ${tests.length}`, 110, yPosition);
        doc.text(`Promedio: ${avgScore.toFixed(0)}%`, 160, yPosition);
        
        yPosition += 8;
      }
    });
    
    // Detalle de resultados
    yPosition += 10;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial Detallado', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(...primaryColor);
    doc.rect(20, yPosition - 5, 170, 8, 'F');
    doc.text('Fecha', 22, yPosition);
    doc.text('Test', 60, yPosition);
    doc.text('Puntuación', 115, yPosition);
    doc.text('%', 155, yPosition);
    
    yPosition += 8;
    doc.setTextColor(60, 60, 60);
    
    results.slice(0, 15).forEach((result, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const percentage = Math.round((result.score / result.maxScore) * 100);
      const bgColor = index % 2 === 0 ? [245, 247, 250] : [255, 255, 255];
      
      doc.setFillColor(...bgColor);
      doc.rect(20, yPosition - 5, 170, 7, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(result.date).toLocaleDateString('es-MX'), 22, yPosition);
      doc.text(getTestName(result.testType), 60, yPosition);
      doc.text(`${result.score} / ${result.maxScore}`, 115, yPosition);
      
      // Color del porcentaje según resultado
      if (percentage >= 80) doc.setTextColor(34, 197, 94); // verde
      else if (percentage >= 60) doc.setTextColor(234, 179, 8); // amarillo
      else doc.setTextColor(239, 68, 68); // rojo
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${percentage}%`, 155, yPosition);
      doc.setTextColor(60, 60, 60);
      
      yPosition += 7;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `CuidArte - Plataforma de Evaluación de Salud | Página ${i} de ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }
    
    // Guardar PDF
    doc.save(`CuidArte-Reporte-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Preparar datos para gráfico de progreso
  const chartData = filteredResults.map((result, index) => ({
    name: `Test ${index + 1}`,
    fecha: new Date(result.date).toLocaleDateString('es-MX'),
    porcentaje: getScorePercentage(result),
    puntuacion: result.score
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-white py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Volver"
            >
              <ArrowLeft className="text-primary-600" size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold text-primary-600">Mis Resultados</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Historial de evaluaciones</p>
            </div>
          </div>
          
          {/* Botones de acción en móvil */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={exportData}
              disabled={results.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={clearAllData}
              disabled={results.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Limpiar Datos</span>
              <span className="sm:hidden">Limpiar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedTest('all')}
            className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
              selectedTest === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({results.length})
          </button>
          <button
            onClick={() => setSelectedTest('functional')}
            className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
              selectedTest === 'functional'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="hidden sm:inline">Funcional</span>
            <span className="sm:hidden">📊</span> ({results.filter(r => r.testType === 'functional').length})
          </button>
          <button
            onClick={() => setSelectedTest('cognitive')}
            className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
              selectedTest === 'cognitive'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="hidden sm:inline">Cognitivo</span>
            <span className="sm:hidden">🧠</span> ({results.filter(r => r.testType === 'cognitive').length})
          </button>
          <button
            onClick={() => setSelectedTest('mental')}
            className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
              selectedTest === 'mental'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="hidden sm:inline">Mental</span>
            <span className="sm:hidden">💭</span> ({results.filter(r => r.testType === 'mental').length})
          </button>
          <button
            onClick={() => setSelectedTest('lifeSpace')}
            className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base col-span-2 sm:col-span-1 ${
              selectedTest === 'lifeSpace'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="hidden sm:inline">Espacio de Vida</span>
            <span className="sm:hidden">🌍 Espacio</span> ({results.filter(r => r.testType === 'lifeSpace').length})
          </button>
        </div>

        {/* Contenido */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📊</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No hay resultados aún</h3>
            <p className="text-sm sm:text-base text-gray-500">Completa algunas evaluaciones para ver tu progreso aquí</p>
          </div>
        ) : (
          <>
            {/* Gráfico de progreso */}
            {chartData.length >= 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Progreso en el Tiempo</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="fecha" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
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

            {/* Vista de tarjetas para móvil */}
            <div className="block sm:hidden space-y-3">
              {filteredResults.map((result) => {
                const percentage = getScorePercentage(result);
                return (
                  <div key={result.id} className="bg-white rounded-xl shadow-md p-4 border-l-4" style={{
                    borderLeftColor: percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#eab308' : '#ef4444'
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base">{getTestName(result.testType)}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.date).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                          {percentage}%
                        </div>
                        <p className="text-xs text-gray-600">
                          {result.score} / {result.maxScore}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabla para desktop */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                      <th className="px-6 py-4 text-left font-semibold">Test</th>
                      <th className="px-6 py-4 text-left font-semibold">Puntuación</th>
                      <th className="px-6 py-4 text-left font-semibold">Porcentaje</th>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
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

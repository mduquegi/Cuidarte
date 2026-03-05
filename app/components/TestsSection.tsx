'use client';

import React from 'react';
import { speak } from '../utils';

interface TestsSectionProps {
  onSelectTest: (testType: 'functional' | 'cognitive' | 'mental' | 'lifeSpace') => void;
}

export const TestsSection: React.FC<TestsSectionProps> = ({ onSelectTest }) => {
  const tests = [
    {
      id: 'functional',
      name: 'Evaluación Funcional',
      icon: '🏃',
      description: 'Test de equilibrio y tiempo de reacción',
      color: '#5cb3fd'
    },
    {
      id: 'cognitive',
      name: 'Evaluación Cognitiva',
      icon: '🧠',
      description: 'Test de memoria y función cognitiva',
      color: '#fd5c94'
    },
    {
      id: 'mental',
      name: 'Evaluación Mental',
      icon: '💭',
      description: 'Test de salud mental (GDS)',
      color: '#ffc107'
    },
    {
      id: 'lifeSpace',
      name: 'Espacio de Vida',
      icon: '🏠',
      description: 'Evaluación de movilidad y autonomía',
      color: '#28a745'
    }
  ];

  const handleTestClick = (testType: any, testName: string) => {
    speak(`Iniciando ${testName}`);
    onSelectTest(testType);
  };

  return (
    <section className="py-5" id="tests">
      <div className="container">
        <div className="row">
          <div className="col-12 py-3">
            <div 
              className="bg-holder bg-size" 
              style={{
                backgroundImage: 'url(/assets/img/gallery/bg-departments.png)',
                backgroundPosition: 'top center',
                backgroundSize: 'contain'
              }}
            ></div>
            <h1 className="text-center">EVALUACIONES DISPONIBLES</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row py-5 align-items-center justify-content-center justify-content-lg-evenly">
          {tests.map((test) => (
            <div key={test.id} className="col-auto col-md-6 col-lg-3 text-xl-start mb-4">
              <div className="d-flex flex-column align-items-center">
                <div 
                  className="icon-box text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTestClick(test.id, test.name)}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: test.color,
                      fontSize: '3rem',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {test.icon}
                  </div>
                  <h5 className="fs-1 fs-xxl-2 text-center fw-bold">{test.name}</h5>
                  <p className="text-center text-muted">{test.description}</p>
                  <button 
                    className="btn btn-outline-primary rounded-pill mt-2"
                    onClick={() => handleTestClick(test.id, test.name)}
                  >
                    Iniciar Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

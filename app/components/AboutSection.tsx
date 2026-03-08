'use client';

import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <>
      <section className="pb-0" id="about">
        <div className="container">
          <div className="row">
            <div className="col-12 py-3">
              <div 
                className="bg-holder bg-size" 
                style={{
                  backgroundImage: 'url(/assets/img/gallery/about-us.png)',
                  backgroundPosition: 'top center',
                  backgroundSize: 'contain'
                }}
              ></div>
              <h1 className="text-center">ACERCA DE CUIDARTE</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div 
          className="bg-holder bg-size" 
          style={{
            backgroundImage: 'url(/assets/img/gallery/about-bg.png)',
            backgroundPosition: 'top center',
            backgroundSize: 'contain'
          }}
        ></div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 order-lg-1 mb-5 mb-lg-0 d-flex justify-content-center">
              <img 
                className="fit-cover rounded-circle" 
                src="/assets/img/gallery/health-care.png" 
                alt="Cuidado de la salud"
                style={{maxWidth: '70%', height: 'auto'}}
              />
            </div>
            <div className="col-md-6 text-center text-md-start">
              <h2 className="fw-bold mb-4">
                Desarrollamos un sistema de<br className="d-none d-sm-block" /> 
                seguimiento de salud centrado en ti
              </h2>
              <p className="mb-4">
                Creemos que todos los adultos mayores merecen acceso a evaluaciones 
                de salud de calidad. Nuestro objetivo es hacer el proceso tan simple 
                como sea posible y ofrecer monitoreo continuo desde la comodidad de tu hogar.
              </p>
              <p className="mb-4">
                <strong>CuidArte</strong> utiliza tests clínicos validados científicamente para 
                evaluar diferentes aspectos de tu salud:
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <span className="text-primary">✓</span> <strong>Función Física:</strong> Evaluamos tu equilibrio y tiempo de reacción
                </li>
                <li className="mb-2">
                  <span className="text-primary">✓</span> <strong>Función Cognitiva:</strong> Monitoreamos tu memoria y capacidades mentales
                </li>
                <li className="mb-2">
                  <span className="text-primary">✓</span> <strong>Salud Mental:</strong> Detectamos signos tempranos de depresión con el GDS
                </li>
                <li className="mb-2">
                  <span className="text-primary">✓</span> <strong>Movilidad:</strong> Evaluamos tu espacio de vida y autonomía
                </li>
              </ul>
              <div className="py-3">
                <button className="btn btn-lg btn-outline-primary rounded-pill" type="button">
                  Conocer Más
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

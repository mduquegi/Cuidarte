'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <section className="bg-primary py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold text-light mb-3">💙 CuidArte</h2>
            <p className="text-light">
              Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores 
              mediante tests clínicos validados. Tu bienestar es nuestra prioridad.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-6 col-md-4 mb-3">
                <h5 className="text-light mb-3">Evaluaciones</h5>
                <ul className="list-unstyled">
                  <li><a href="#tests" className="text-light text-decoration-none">Test Funcional</a></li>
                  <li><a href="#tests" className="text-light text-decoration-none">Test Cognitivo</a></li>
                  <li><a href="#tests" className="text-light text-decoration-none">Test Mental</a></li>
                  <li><a href="#tests" className="text-light text-decoration-none">Espacio de Vida</a></li>
                </ul>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <h5 className="text-light mb-3">Información</h5>
                <ul className="list-unstyled">
                  <li><a href="#about" className="text-light text-decoration-none">Acerca de</a></li>
                  <li><a href="#home" className="text-light text-decoration-none">Inicio</a></li>
                  <li><a href="#results" className="text-light text-decoration-none">Resultados</a></li>
                </ul>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <h5 className="text-light mb-3">Soporte</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-light text-decoration-none">Ayuda</a></li>
                  <li><a href="#" className="text-light text-decoration-none">Privacidad</a></li>
                  <li><a href="#" className="text-light text-decoration-none">Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-light my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-light mb-0">
              &copy; 2026 CuidArte. Todos los derechos reservados. | Desarrollado con ❤️ para el cuidado de adultos mayores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

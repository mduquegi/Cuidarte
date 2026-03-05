'use client';

import React from 'react';
import { VoiceButton } from './UI';

interface HeroSectionProps {
  profile?: { name: string; age: number } | null;
  onStartTests?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onStartTests }) => {
  return (
    <section className="py-xxl-10 pb-0" id="home" style={{ marginTop: '80px' }}>
      <div 
        className="bg-holder bg-size" 
        style={{
          backgroundImage: 'url(/assets/img/gallery/hero-bg.png)',
          backgroundPosition: 'top center',
          backgroundSize: 'cover'
        }}
      ></div>

      <div className="container">
        <div className="row min-vh-xl-100 min-vh-xxl-25">
          <div className="col-md-5 col-xl-6 col-xxl-7 order-0 order-md-1 text-end">
            <img 
              className="pt-7 pt-md-0 w-100" 
              src="/assets/img/gallery/hero.png" 
              alt="Cuidado de salud" 
            />
          </div>
          <div className="col-md-7 col-xl-6 col-xxl-5 text-md-start text-center py-6">
            {profile ? (
              <>
                <h1 className="fw-light font-base fs-6 fs-xxl-7">
                  Hola <strong>{profile.name}</strong>, 
                  <br />¡Bienvenido de vuelta!
                </h1>
                <p className="fs-1 mb-5">
                  Continúa monitoreando tu salud con nuestras evaluaciones especializadas. 
                  Cada test te ayuda a mantener tu bienestar.
                </p>
                <div className="mb-4">
                  <VoiceButton 
                    text={`Hola ${profile.name}, bienvenido de vuelta a Cuidarte. Puedes realizar tus evaluaciones cuando estés listo.`}
                    autoPlay={true}
                  />
                </div>
                {onStartTests && (
                  <a 
                    className="btn btn-lg btn-primary rounded-pill" 
                    href="#tests" 
                    role="button"
                    onClick={onStartTests}
                  >
                    Realizar Evaluaciones
                  </a>
                )}
              </>
            ) : (
              <>
                <h1 className="fw-light font-base fs-6 fs-xxl-7">
                  Comprometidos con tu <strong>bienestar</strong> y 
                  <br />una <strong>mejor calidad de vida</strong>
                </h1>
                <p className="fs-1 mb-5">
                  Evaluaciones especializadas disponibles 24/7 para el cuidado de tu salud. 
                  Monitoreamos tu bienestar con tests validados científicamente.
                </p>
                <a 
                  className="btn btn-lg btn-primary rounded-pill" 
                  href="#about" 
                  role="button"
                >
                  Conocer Más
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

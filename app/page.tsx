'use client';

import React, { useState, useEffect } from 'react';
import { FunctionalTest } from './components/FunctionalTest';
import { CognitiveTest } from './components/CognitiveTest';
import { MentalTest } from './components/MentalTest';
import { LifeSpaceTest } from './components/LifeSpaceTest';
import { Results } from './components/Results';
import { storage } from './utils';
import { UserProfile } from './types';

type Page = 'home' | 'functional' | 'cognitive' | 'mental' | 'lifeSpace' | 'results';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSignIn = () => {
    setShowProfileModal(true);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      const newProfile: UserProfile = {
        name,
        age: parseInt(age),
        createdAt: new Date().toISOString()
      };
      storage.saveProfile(newProfile);
      setProfile(newProfile);
      setShowProfileModal(false);
      setName('');
      setAge('');
    }
  };

  const handleTestSelect = (test: Page) => {
    if (!profile) {
      setShowProfileModal(true);
      return;
    }
    setCurrentPage(test);
  };

  const goToHome = () => setCurrentPage('home');

  // Si estamos en un test, mostrarlo
  if (currentPage !== 'home' && currentPage !== 'results') {
    return (
      <div className="min-h-screen" style={{background: 'linear-gradient(to bottom right, #e0f2fe, #f3e8ff, #fce7f3)', padding: '2rem'}}>
        {currentPage === 'functional' && <FunctionalTest onComplete={goToHome} />}
        {currentPage === 'cognitive' && <CognitiveTest onComplete={goToHome} />}
        {currentPage === 'mental' && <MentalTest onComplete={goToHome} />}
        {currentPage === 'lifeSpace' && <LifeSpaceTest onComplete={goToHome} />}
      </div>
    );
  }

  return (
    <main className="main" id="top">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3 d-block" data-navbar-on-scroll="data-navbar-on-scroll">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#top">
            <span className="fs-3 fw-bold text-primary">💙 CuidArte</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"> </span>
          </button>
          <div className="collapse navbar-collapse border-top border-lg-0 mt-4 mt-lg-0" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto pt-2 pt-lg-0 font-base">
              <li className="nav-item px-2"><a className="nav-link" href="#home">Inicio</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#tests">Evaluaciones</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#about">Nosotros</a></li>
              {profile && (
                <li className="nav-item px-2">
                  <a className="nav-link" href="#!" onClick={(e) => { e.preventDefault(); setCurrentPage('results'); }}>
                    Mis Resultados
                  </a>
                </li>
              )}
            </ul>
            {profile ? (
              <span className="btn btn-sm btn-primary rounded-pill order-1 order-lg-0 ms-lg-4">
                Hola, {profile.name}
              </span>
            ) : (
              <button className="btn btn-sm btn-outline-primary rounded-pill order-1 order-lg-0 ms-lg-4" onClick={handleSignIn}>
                Ingresar
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Resultados */}
      {currentPage === 'results' && profile && (
        <div style={{marginTop: '100px', padding: '2rem'}}>
          <Results onBack={goToHome} />
        </div>
      )}

      {/* Página principal */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="py-xxl-10 pb-0" id="home">
            <div className="bg-holder bg-size" style={{backgroundImage: 'url(/assets/img/gallery/hero-bg.png)', backgroundPosition: 'top center', backgroundSize: 'cover'}}></div>
            
            <div className="container">
              <div className="row min-vh-xl-100 min-vh-xxl-25">
                <div className="col-md-5 col-xl-6 col-xxl-7 order-0 order-md-1 text-end">
                  <img className="pt-7 pt-md-0 w-100" src="/assets/img/gallery/hero.png" alt="hero-header" />
                </div>
                <div className="col-md-75 col-xl-6 col-xxl-5 text-md-start text-center py-6">
                  <h1 className="fw-light font-base fs-6 fs-xxl-7">
                    Hola <strong>{profile?.name || 'Mariana'}</strong>,<br />
                    <strong>¡Bienvenido de vuelta!</strong>
                  </h1>
                  <p className="fs-1 mb-5">
                    Continúa monitoreando tu salud con nuestras evaluaciones especializadas. 
                    Cada test te ayuda a mantener tu bienestar.
                  </p>
                  <a className="btn btn-lg btn-primary rounded-pill" href="#tests" role="button">
                    Realizar Evaluaciones
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Tests Section */}
          <section className="py-5" id="tests">
            <div className="container">
              <div className="row">
                <div className="col-12 py-3">
                  <div className="bg-holder bg-size" style={{backgroundImage: 'url(/assets/img/gallery/bg-departments.png)', backgroundPosition: 'top center', backgroundSize: 'contain'}}></div>
                  <h1 className="text-center">NUESTRAS EVALUACIONES</h1>
                </div>
              </div>
            </div>
          </section>

          <section className="py-0">
            <div className="container">
              <div className="row py-5 align-items-center justify-content-center justify-content-lg-evenly">
                <div className="col-auto col-md-4 col-lg-auto text-xl-start">
                  <div className="d-flex flex-column align-items-center">
                    <div className="icon-box text-center">
                      <a className="text-decoration-none" href="#!" onClick={(e) => { e.preventDefault(); handleTestSelect('functional'); }}>
                        <div className="mb-3" style={{fontSize: '64px'}}>📊</div>
                        <p className="fs-1 fs-xxl-2 text-center">Test Funcional</p>
                        <p className="text-600 small">Equilibrio y movilidad</p>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-auto col-md-4 col-lg-auto text-xl-start">
                  <div className="d-flex flex-column align-items-center">
                    <div className="icon-box text-center">
                      <a className="text-decoration-none" href="#!" onClick={(e) => { e.preventDefault(); handleTestSelect('cognitive'); }}>
                        <div className="mb-3" style={{fontSize: '64px'}}>🧠</div>
                        <p className="fs-1 fs-xxl-2 text-center">Test Cognitivo</p>
                        <p className="text-600 small">Memoria y atención</p>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-auto col-md-4 col-lg-auto text-xl-start">
                  <div className="d-flex flex-column align-items-center">
                    <div className="icon-box text-center">
                      <a className="text-decoration-none" href="#!" onClick={(e) => { e.preventDefault(); handleTestSelect('mental'); }}>
                        <div className="mb-3" style={{fontSize: '64px'}}>💭</div>
                        <p className="fs-1 fs-xxl-2 text-center">Estado Mental</p>
                        <p className="text-600 small">Bienestar emocional</p>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-auto col-md-4 col-lg-auto text-xl-start">
                  <div className="d-flex flex-column align-items-center">
                    <div className="icon-box text-center">
                      <a className="text-decoration-none" href="#!" onClick={(e) => { e.preventDefault(); handleTestSelect('lifeSpace'); }}>
                        <div className="mb-3" style={{fontSize: '64px'}}>🌍</div>
                        <p className="fs-1 fs-xxl-2 text-center">Espacio de Vida</p>
                        <p className="text-600 small">Movilidad y autonomía</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="pb-0" id="about">
            <div className="container">
              <div className="row">
                <div className="col-12 py-3">
                  <div className="bg-holder bg-size" style={{backgroundImage: 'url(/assets/img/gallery/about-us.png)', backgroundPosition: 'top center', backgroundSize: 'contain'}}></div>
                  <h1 className="text-center">NOSOTROS</h1>
                </div>
              </div>
            </div>
          </section>

          <section className="py-5">
            <div className="bg-holder bg-size" style={{backgroundImage: 'url(/assets/img/gallery/about-bg.png)', backgroundPosition: 'top center', backgroundSize: 'contain'}}></div>
            
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6 order-lg-1 mb-5 mb-lg-0">
                  <img className="fit-cover rounded-circle w-100" src="/assets/img/gallery/health-care.png" alt="..." />
                </div>
                <div className="col-md-6 text-center text-md-start">
                  <h2 className="fw-bold mb-4">
                    Sistema de monitoreo de salud<br className="d-none d-sm-block" />
                    para adultos mayores
                  </h2>
                  <p>
                    CuidArte es una plataforma diseñada para el seguimiento longitudinal<br className="d-none d-sm-block" />
                    de la salud mediante tests clínicos validados. Permiteobservar la<br className="d-none d-sm-block" />
                    evolución en el tiempo y compartir resultados con profesionales<br className="d-none d-sm-block" />
                    de la salud.
                  </p>
                  <div className="py-3">
                    <button className="btn btn-lg btn-outline-primary rounded-pill" type="button" onClick={() => handleTestSelect('functional')}>
                      Comenzar Evaluación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="bg-primary py-5">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-lg-6 mb-4 order-0 order-sm-0">
                  <div className="text-decoration-none">
                    <h2 className="fw-bold text-light mb-3">💙 CuidArte</h2>
                    <p className="text-light">
                      Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores 
                      mediante tests clínicos validados.
                    </p>
                  </div>
                </div>
                <div className="col-6 col-sm-4 col-lg-2 mb-3 order-2 order-sm-1">
                  <h5 className="lh-lg fw-bold mb-4 text-light font-sans-serif">Evaluaciones</h5>
                  <ul className="list-unstyled mb-md-4 mb-lg-0">
                    <li className="lh-lg"><a className="footer-link text-light" href="#tests">Test Funcional</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#tests">Test Cognitivo</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#tests">Estado Mental</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#tests">Espacio de Vida</a></li>
                  </ul>
                </div>
                <div className="col-6 col-sm-4 col-lg-2 mb-3 order-3 order-sm-2">
                  <h5 className="lh-lg fw-bold text-light mb-4 font-sans-serif">Legal</h5>
                  <ul className="list-unstyled mb-md-4 mb-lg-0">
                    <li className="lh-lg"><a className="footer-link text-light" href="#!">Privacidad</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#!">Términos</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#!">Cookies</a></li>
                  </ul>
                </div>
                <div className="col-6 col-sm-4 col-lg-2 mb-3 order-3 order-sm-2">
                  <h5 className="lh-lg fw-bold text-light mb-4 font-sans-serif">Soporte</h5>
                  <ul className="list-unstyled mb-md-4 mb-lg-0">
                    <li className="lh-lg"><a className="footer-link text-light" href="#about">Nosotros</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#!">Contacto</a></li>
                    <li className="lh-lg"><a className="footer-link text-light" href="#!">Ayuda</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Modal de Perfil */}
      {showProfileModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bienvenido a CuidArte</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">Por favor, ingresa tus datos para comenzar</p>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">¿Cuál es tu nombre?</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">¿Cuál es tu edad?</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="50"
                      max="120"
                      placeholder="Ingresa tu edad"
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={!name || !age}>
                      Comenzar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

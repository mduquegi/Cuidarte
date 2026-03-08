'use client';

import React, { useState, useEffect } from 'react';
import { FunctionalTest } from './components/FunctionalTest';
import { CognitiveTest } from './components/CognitiveTest';
import { MentalTest } from './components/MentalTest';
import { LifeSpaceTest } from './components/LifeSpaceTest';
import { Results } from './components/Results';
import { storage, speak } from './utils';
import { UserProfile } from './types';
import { X } from 'lucide-react';

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
    } else {
      // Mostrar modal si no hay perfil guardado
      setShowProfileModal(true);
    }
  }, []);

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
      <>
        {currentPage === 'functional' && <FunctionalTest onComplete={goToHome} />}
        {currentPage === 'cognitive' && <CognitiveTest onComplete={goToHome} />}
        {currentPage === 'mental' && <MentalTest onComplete={goToHome} />}
        {currentPage === 'lifeSpace' && <LifeSpaceTest onComplete={goToHome} />}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/assets/img/logo-cuidarte.png" alt="CuidArte" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-primary-500">CuidArte</span>
            </div>
            <div className="flex items-center gap-3">
              {profile ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:block">Hola, <strong>{profile.name}</strong></span>
                  <button
                    onClick={() => setCurrentPage('results')}
                    className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm"
                  >
                    📊 Resultados
                  </button>
                  <button
                    onClick={() => {
                      setName(profile.name);
                      setAge(profile.age.toString());
                      setShowProfileModal(true);
                    }}
                    className="px-4 py-2 border border-primary-500 text-primary-500 rounded-full hover:bg-primary-50 transition-colors text-sm"
                  >
                    👤 Mi Perfil
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Resultados */}
      {currentPage === 'results' && profile && (
        <div className="p-8">
          <Results onBack={goToHome} />
        </div>
      )}

      {/* Página principal */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Texto */}
                <div className="text-center md:text-left animate-fade-in">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                    Estamos <strong className="font-bold text-gradient">comprometidos</strong> con<br />
                    tu <strong className="font-bold text-gradient">bienestar.</strong>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-8">
                    Continúa monitoreando tu salud con nuestras evaluaciones especializadas. 
                    Cada test te ayuda a mantener tu bienestar.
                  </p>
                  <a 
                    href="#tests" 
                    className="inline-block px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-600 shadow-soft shadow-soft-hover transition-all"
                  >
                    Realizar Evaluaciones
                  </a>
                </div>

                {/* Logo */}
                <div className="flex justify-center md:justify-end animate-fade-in">
                  <img 
                    src="/assets/img/logo-cuidarte.png" 
                    alt="CuidArte Logo" 
                    className="w-full max-w-md lg:max-w-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tests Section */}
          <section className="py-16 px-4 bg-gray-50" id="tests">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-primary-700">
                NUESTRAS EVALUACIONES
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Test Funcional */}
                <button
                  onClick={() => handleTestSelect('functional')}
                  onMouseEnter={() => speak('Test Funcional: Equilibrio y movilidad', 0.8)}
                  className="bg-white p-8 rounded-2xl shadow-soft shadow-soft-hover text-center transition-all group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Test Funcional</h3>
                  <p className="text-sm text-gray-600">Equilibrio y movilidad</p>
                </button>

                {/* Test Cognitivo */}
                <button
                  onClick={() => handleTestSelect('cognitive')}
                  onMouseEnter={() => speak('Test Cognitivo: Memoria y atención', 0.8)}
                  className="bg-white p-8 rounded-2xl shadow-soft shadow-soft-hover text-center transition-all group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Test Cognitivo</h3>
                  <p className="text-sm text-gray-600">Memoria y atención</p>
                </button>

                {/* Estado Mental */}
                <button
                  onClick={() => handleTestSelect('mental')}
                  onMouseEnter={() => speak('Test de Estado Mental: Bienestar emocional', 0.8)}
                  className="bg-white p-8 rounded-2xl shadow-soft shadow-soft-hover text-center transition-all group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💭</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Estado Mental</h3>
                  <p className="text-sm text-gray-600">Bienestar emocional</p>
                </button>

                {/* Espacio de Vida */}
                <button
                  onClick={() => handleTestSelect('lifeSpace')}
                  onMouseEnter={() => speak('Test de Espacio de Vida: Movilidad y autonomía', 0.8)}
                  className="bg-white p-8 rounded-2xl shadow-soft shadow-soft-hover text-center transition-all group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Espacio de Vida</h3>
                  <p className="text-sm text-gray-600">Movilidad y autonomía</p>
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-primary-500 text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Descripción */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/assets/img/logo-cuidarte.png" alt="CuidArte" className="h-12 w-auto brightness-0 invert" />
                    <span className="text-2xl font-bold">CuidArte</span>
                  </div>
                  <p className="text-primary-100">
                    Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores 
                    mediante tests clínicos validados.
                  </p>
                </div>

                {/* Evaluaciones */}
                <div>
                  <h5 className="font-bold text-lg mb-4">Evaluaciones</h5>
                  <ul className="space-y-2">
                    <li><a href="#tests" className="text-primary-100 hover:text-white transition-colors">Test Funcional</a></li>
                    <li><a href="#tests" className="text-primary-100 hover:text-white transition-colors">Test Cognitivo</a></li>
                    <li><a href="#tests" className="text-primary-100 hover:text-white transition-colors">Estado Mental</a></li>
                    <li><a href="#tests" className="text-primary-100 hover:text-white transition-colors">Espacio de Vida</a></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h5 className="font-bold text-lg mb-4">Legal</h5>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Privacidad</a></li>
                    <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Términos</a></li>
                    <li><a href="#" className="text-primary-100 hover:text-white transition-colors">Cookies</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary-400 text-center text-primary-100">
                <p>&copy; {new Date().getFullYear()} CuidArte. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modal de Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img src="/assets/img/logo-cuidarte.png" alt="CuidArte" className="h-10 w-auto" />
                <h2 className="text-2xl font-bold text-primary-600">Bienvenido</h2>
              </div>
              {profile && (
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">
              {profile 
                ? 'Actualiza tus datos si lo deseas' 
                : 'Para comenzar a usar CuidArte, necesitamos conocerte un poco'}
            </p>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuál es tu nombre? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  required
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuál es tu edad? <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="50"
                  max="120"
                  placeholder="Ingresa tu edad"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!name || !age}
                className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
              >
                {profile ? 'Actualizar Perfil' : 'Comenzar mi evaluación'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

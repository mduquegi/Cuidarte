'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, VoiceButton } from './components/UI';
import { FunctionalTest } from './components/FunctionalTest';
import { CognitiveTest } from './components/CognitiveTest';
import { MentalTest } from './components/MentalTest';
import { LifeSpaceTest } from './components/LifeSpaceTest';
import { Results } from './components/Results';
import { storage, speak } from './utils';
import { UserProfile } from './types';

type Page = 'home' | 'functional' | 'cognitive' | 'mental' | 'lifeSpace' | 'results' | 'profile';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setShowWelcome(false);
    }
  }, []);

  const createProfile = (name: string, age: number) => {
    const newProfile: UserProfile = {
      name,
      age,
      createdAt: new Date().toISOString()
    };
    storage.saveProfile(newProfile);
    setProfile(newProfile);
    setShowWelcome(false);
    speak(`Bienvenido ${name} a Cuidarte`);
  };

  const goToHome = () => setCurrentPage('home');

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 p-4 flex items-center justify-center">
        <ProfileSetup onComplete={createProfile} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 p-4 py-8">
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} profile={profile} />}
      {currentPage === 'functional' && <FunctionalTest onComplete={goToHome} />}
      {currentPage === 'cognitive' && <CognitiveTest onComplete={goToHome} />}
      {currentPage === 'mental' && <MentalTest onComplete={goToHome} />}
      {currentPage === 'lifeSpace' && <LifeSpaceTest onComplete={goToHome} />}
      {currentPage === 'results' && <Results onBack={goToHome} />}
    </div>
  );
}

const ProfileSetup: React.FC<{ onComplete: (name: string, age: number) => void }> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      onComplete(name, parseInt(age));
    }
  };

  return (
    <Card className="max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          💙 CuidArte
        </h1>
        <p className="text-2xl text-gray-600">
          Plataforma de seguimiento de salud para adultos mayores
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl mb-8">
        <VoiceButton 
          text="Bienvenido a Cuidarte. Por favor, ingrese su información para comenzar."
          autoPlay={true}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-2xl font-bold text-gray-900 mb-3">
            ¿Cuál es su nombre?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Ingrese su nombre"
            required
          />
        </div>

        <div>
          <label className="block text-2xl font-bold text-gray-900 mb-3">
            ¿Cuál es su edad?
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="50"
            max="120"
            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Ingrese su edad"
            required
          />
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {}}
            variant="primary"
            disabled={!name || !age}
            speakText="Comenzar a usar Cuidarte"
          >
            ▶️ Comenzar
          </Button>
        </div>
      </form>
    </Card>
  );
};

const HomePage: React.FC<{ onNavigate: (page: Page) => void; profile: UserProfile | null }> = ({ 
  onNavigate, 
  profile 
}) => {
  const results = storage.getAllResults();
  const lastTest = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              💙 Cuidarte
            </h1>
            {profile && (
              <p className="text-2xl text-gray-600">
                Bienvenido/a, <strong>{profile.name}</strong>
              </p>
            )}
          </div>
          <VoiceButton 
            text="Menú principal de Cuidarte. Seleccione un test para evaluar su salud."
            autoPlay={false}
          />
        </div>

        <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            📋 Acerca de esta aplicación
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Cuidarte es una herramienta diseñada para ayudar a adultos mayores y cuidadores a 
            realizar seguimiento de la salud mediante tests validados clínicamente. Los resultados 
            se guardan automáticamente para observar la evolución en el tiempo.
          </p>
        </div>
            
        {lastTest && (
          <div className="bg-green-50 p-6 rounded-xl mb-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-2">
              ✅ Último test realizado
            </h3>
            <p className="text-lg text-gray-700">
              {new Date(lastTest.date).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🧪 Seleccione un Test
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TestCard
            icon="📊"
            title="Capacidad Funcional"
            description="Evalúa equilibrio y tiempo de reacción"
            duration="2-3 min"
            onClick={() => onNavigate('functional')}
            color="blue"
          />

          <TestCard
            icon="🧠"
            title="Capacidad Cognitiva"
            description="Prueba de memoria y atención"
            duration="3-4 min"
            onClick={() => onNavigate('cognitive')}
            color="purple"
          />

          <TestCard
            icon="💭"
            title="Estado Mental"
            description="Evaluación del bienestar emocional"
            duration="2-3 min"
            onClick={() => onNavigate('mental')}
            color="pink"
          />

          <TestCard
            icon="🌍"
            title="Espacio Vital"
            description="Análisis de movilidad y autonomía"
            duration="3-4 min"
            onClick={() => onNavigate('lifeSpace')}
            color="green"
          />
        </div>

        <div className="border-t-2 border-gray-200 pt-6">
          <Button
            onClick={() => onNavigate('results')}
            variant="secondary"
            size="medium"
            speakText="Ver mis resultados históricos"
            className="w-full"
          >
            📈 Ver Mis Resultados ({results.length} tests realizados)
          </Button>
        </div>

        <div className="mt-8 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-900 mb-3">
            💡 Consejos de uso
          </h3>
          <ul className="space-y-2 text-lg text-gray-700">
            <li>• Use el botón de voz 🔊 para escuchar las instrucciones</li>
            <li>• Realice los tests en un ambiente tranquilo</li>
            <li>• Se recomienda hacer seguimiento mensual</li>
            <li>• Comparta los resultados con su médico</li>
            <li>• La sesión completa toma menos de 15 minutos</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

const TestCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  duration: string;
  onClick: () => void;
  color: string;
}> = ({ icon, title, description, duration, onClick, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => speak(title)}
      className={`bg-linear-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-left`}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-lg mb-4 text-white/90">{description}</p>
      <div className="flex items-center text-sm text-white/80">
        <span>⏱️ {duration}</span>
      </div>
    </button>
  );
}

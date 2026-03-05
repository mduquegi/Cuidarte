'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, VoiceButton } from './components/UI';
import { FunctionalTest } from './components/FunctionalTest';
import { CognitiveTest } from './components/CognitiveTest';
import { MentalTest } from './components/MentalTest';
import { LifeSpaceTest } from './components/LifeSpaceTest';
import { Results } from './components/Results';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TestsSection } from './components/TestsSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
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
      <div className="min-h-screen d-flex align-items-center justify-content-center" 
           style={{background: 'linear-gradient(to bottom right, #e0f2fe, #f3e8ff, #fce7f3)', padding: '2rem'}}>
        <ProfileSetup onComplete={createProfile} />
      </div>
    );
  }

  // Si estamos en un test, mostrarlo con el estilo antiguo
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

  // Página principal con diseño LiveDoc
  return (
    <main className="main" id="top">
      <Navbar profile={profile} />
      
      {currentPage === 'home' && (
        <>
          <HeroSection profile={profile} onStartTests={() => {}} />
          <TestsSection onSelectTest={setCurrentPage as any} />
          <AboutSection />
          <Footer />
        </>
      )}
      
      {currentPage === 'results' && (
        <div style={{marginTop: '100px', padding: '2rem'}}>
          <Results onBack={goToHome} />
        </div>
      )}
    </main>
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

'use client';

import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-gray-700"
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="text-base sm:text-lg">{language === 'es' ? '🇺🇸' : '🇪🇸'}</span>
      <span className="hidden sm:inline font-semibold">
        {language === 'es' ? 'EN' : 'ES'}
      </span>
    </button>
  );
}

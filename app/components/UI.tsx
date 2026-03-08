'use client';

import React from 'react';
import { speak, stopSpeaking } from '../utils';
import { Volume2, VolumeX } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  speakText?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  speakText,
  className = ''
}) => {
  const baseClasses = 'font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  const sizeClasses = {
    small: 'px-6 py-3 text-lg',
    medium: 'px-8 py-4 text-xl',
    large: 'px-10 py-6 text-2xl'
  };

  const handleClick = () => {
    if (speakText) {
      speak(speakText);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 border-4 border-gray-200 ${className}`}>
      {title && <h2 className="text-3xl font-bold mb-6 text-gray-900">{title}</h2>}
      {children}
    </div>
  );
};

interface VoiceButtonProps {
  text: string;
  autoPlay?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ text, autoPlay = false }) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  React.useEffect(() => {
    if (autoPlay && text) {
      handleSpeak();
    }
  }, [autoPlay, text]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speak(text);
      setIsSpeaking(true);
      // Auto-reset después de hablar
      setTimeout(() => setIsSpeaking(false), text.length * 50);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className="p-4 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
      title={isSpeaking ? "Detener lectura" : "Leer en voz alta"}
    >
      {isSpeaking ? <VolumeX size={32} /> : <Volume2 size={32} />}
    </button>
  );
};

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
      <div
        className="bg-primary-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
        style={{ width: `${percentage}%` }}
      >
        <span className="text-white font-bold text-sm px-2">
          {current}/{total}
        </span>
      </div>
    </div>
  );
};

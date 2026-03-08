'use client';

import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile | null;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onNavigate }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top py-0" data-navbar-on-scroll="data-navbar-on-scroll">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center py-2" href="#home">
          <span style={{ fontSize: '1rem' }} className="fw-bold text-primary d-flex align-items-center gap-1">
            <span style={{ fontSize: '1.2rem' }}>💙</span> CuidArte
          </span>
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse border-top border-lg-0 mt-2 mt-lg-0" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto pt-1 pt-lg-0" style={{ fontSize: '0.9rem' }}>
            <li className="nav-item px-2">
              <a className="nav-link py-1" href="#home">Inicio</a>
            </li>
            <li className="nav-item px-2">
              <a className="nav-link py-1" href="#tests">Evaluaciones</a>
            </li>
            <li className="nav-item px-2">
              <a className="nav-link py-1" href="#about">Acerca de</a>
            </li>
            {profile && (
              <li className="nav-item px-2">
                <a className="nav-link py-1" href="#results">Mis Resultados</a>
              </li>
            )}
          </ul>
          {profile && (
            <span className="btn btn-sm btn-outline-primary rounded-pill order-1 order-lg-0 ms-lg-3 py-1 px-3" style={{ fontSize: '0.85rem' }}>
              <span style={{ fontSize: '0.9rem' }}>👤</span> {profile.name}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

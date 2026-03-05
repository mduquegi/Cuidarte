'use client';

import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile | null;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onNavigate }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3 d-block" data-navbar-on-scroll="data-navbar-on-scroll">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#home">
          <span className="fs-2 fw-bold text-primary">💙 CuidArte</span>
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
        <div className="collapse navbar-collapse border-top border-lg-0 mt-4 mt-lg-0" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto pt-2 pt-lg-0 font-base">
            <li className="nav-item px-2">
              <a className="nav-link" href="#home">Inicio</a>
            </li>
            <li className="nav-item px-2">
              <a className="nav-link" href="#tests">Evaluaciones</a>
            </li>
            <li className="nav-item px-2">
              <a className="nav-link" href="#about">Acerca de</a>
            </li>
            {profile && (
              <li className="nav-item px-2">
                <a className="nav-link" href="#results">Mis Resultados</a>
              </li>
            )}
          </ul>
          {profile && (
            <span className="btn btn-sm btn-outline-primary rounded-pill order-1 order-lg-0 ms-lg-4">
              👤 {profile.name}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

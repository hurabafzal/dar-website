"use client";

import { useState } from 'react';
import Modal from './modal';
import Login from './login/login';
import Signup from './signup/signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialView = 'login' 
}) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  const handleViewToggle = (newView: 'login' | 'signup') => {
    setView(newView);
  };

  const handleSuccessfulSignup = () => {
    setView('login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {view === 'login' ? (
        <Login onSignupClick={() => handleViewToggle('signup')} />
      ) : (
        <Signup onLoginClick={() => handleViewToggle('login')} onClose={handleSuccessfulSignup}/>
      )}
    </Modal>
  );
};

export default AuthModal;
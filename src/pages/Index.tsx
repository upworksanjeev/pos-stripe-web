import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PinLogin from '@/components/pos/PinLogin';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    navigate('/pos');
  };

  if (!isAuthenticated) {
    return <PinLogin onAuthenticate={handleAuthenticate} />;
  }

  return null; // No rendering here, redirect happens on authentication
};

export default Index;

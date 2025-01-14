import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterModal } from './RegisterModal';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface UserInfo {
  id: number;
  name: string;
  isReviewer: boolean;
  address: string;
  phone?: string;
  avatar?: string;
  description?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  // Get user info from localStorage
  const mockFetchUserInfo = async (address: string): Promise<UserInfo | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a default reviewer user
    const defaultReviewer: UserInfo = {
      id: 1,
      name: "Necklace",
      isReviewer: true,
      address: address,
      phone: "13800138000",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
      description: "Senior reviewer focused on product quality control"
    };

    // Save to localStorage
    localStorage.setItem('userInfo', JSON.stringify(defaultReviewer));
    return defaultReviewer;
  };

  const handleConnectWallet = async (walletType: 'nabox' | 'metamask') => {
    // Simulate wallet connection
    const mockAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    setConnectedAddress(mockAddress);

    try {
      const userInfo = await mockFetchUserInfo(mockAddress);
      
      if (userInfo) {
        // User exists, proceed with login
        login(userInfo);
        onSuccess();
      } else {
        // User doesn't exist, show registration form
        setShowRegister(true);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleRegister = (data: any) => {
    // Create new user
    const newUser = {
      id: Date.now(),
      name: data.nickname,
      isReviewer: true,
      address: data.address,
      phone: data.phone,
      avatar: data.avatar,
      description: data.description
    };

    // Save to localStorage
    localStorage.setItem('userInfo', JSON.stringify(newUser));
    
    // Login
    login(newUser);
    onSuccess();
  };

  if (showRegister) {
    return (
      <RegisterModal
        onClose={onClose}
        onRegister={handleRegister}
        walletAddress={connectedAddress}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-4">
          <button
            onClick={() => handleConnectWallet('nabox')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl flex items-center justify-between hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">NaBox</span>
            </div>
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">
              Recommended
            </span>
          </button>

          <button
            onClick={() => handleConnectWallet('metamask')}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">MetaMask</span>
            </div>
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">
              Popular
            </span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            By connecting a wallet, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
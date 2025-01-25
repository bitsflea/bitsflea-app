import React, { useState } from 'react';
import { Menu, X, User, LogOut, Home, Shield, ClipboardCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onUserClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  onReviewerClick: () => void;
  onProductReviewClick: () => void;
  showUserCenter?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onUserClick, 
  onLogout, 
  onHomeClick,
  onReviewerClick,
  onProductReviewClick,
  showUserCenter = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    onHomeClick();
    setIsMenuOpen(false);
  };

  const handleReviewerClick = () => {
    onReviewerClick();
    setIsMenuOpen(false);
  };

  const handleProductReviewClick = () => {
    onProductReviewClick();
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: 'Home', icon: Home, onClick: handleHomeClick, show: 'always' },
    { name: 'Reviewer Election', icon: Shield, onClick: handleReviewerClick, show: 'always' },
    { 
      name: 'Review Products', 
      icon: ClipboardCheck, 
      onClick: handleProductReviewClick, 
      show: 'reviewer',
      disabled: !user?.isReviewer
    },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.show === 'always' || 
    (item.show === 'reviewer' && isAuthenticated)
  );

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <div className="relative">
                <img src="/logo.png" className="h-6 w-6 text-primary-600 animate-pulse" />
                <div className="absolute inset-0 bg-primary-100 rounded-full blur-lg opacity-30"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                BitsFlea
              </span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {visibleMenuItems.map(({ name, icon: Icon, onClick, disabled }) => (
              <button
                key={name}
                onClick={onClick}
                disabled={disabled}
                className={`flex items-center gap-2 transition-colors ${
                  disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={onUserClick}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.nickname}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onUserClick}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {showUserCenter ? (
              <button
                onClick={handleHomeClick}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={onUserClick}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleMenuItems.map(({ name, icon: Icon, onClick, disabled }) => (
                <button
                  key={name}
                  onClick={onClick}
                  disabled={disabled}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors w-full ${
                    disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </button>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 transition-colors w-full text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
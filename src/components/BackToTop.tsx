import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show button when scrolling up and page is scrolled down more than 200px
      if (currentScrollY > 200) {
        setShow(currentScrollY < lastScrollY);
      } else {
        setShow(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-4 md:right-8 bg-white shadow-lg rounded-full p-3 text-gray-600 hover:text-primary-600 hover:scale-110 transition-all duration-300 z-50 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
      } ${
        // 在移动端时，根据是否在用户中心调整按钮位置
        window.location.pathname.includes('user')
          ? 'bottom-32 md:bottom-8' // 用户中心页面（有底部导航栏）
          : 'bottom-16 md:bottom-8' // 其他页面
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};
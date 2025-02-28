import React from 'react';
import { FaXTwitter, FaTelegram, FaGithub } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="text-primary-600 font-bold text-xl">BitsFlea</div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/BitsFleaX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://t.me/bitsflea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <FaTelegram className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/bitsflea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <FaGithub className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} BitsFlea. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
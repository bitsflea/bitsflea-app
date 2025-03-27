import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

interface SaleBtnProps {
    onPublish?: () => void
    onLogin?: () => void
}

export const SaleBtn: React.FC<SaleBtnProps> = ({ onPublish, onLogin }) => {

    const { isAuthenticated } = useAuth();

    const handleClick = () => {
        if (isAuthenticated) {
            if (onPublish) onPublish()
        } else {
            if (onLogin) onLogin()
        }
    }
    return (
        <button onClick={handleClick} className="fixed bg-primary-600 bottom-5 left-5 w-50 h-50 text-white px-6 py-3 rounded-full transition flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Listing</span>
        </button>
    )
}
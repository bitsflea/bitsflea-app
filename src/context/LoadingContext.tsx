import React, { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
    showLoading: () => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
                        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
                        <span className="text-gray-600 font-medium">Loading...</span>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
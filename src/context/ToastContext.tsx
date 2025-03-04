import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import EventEmitter from 'events';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastEmitter = new EventEmitter();

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        // 监听全局事件，并显示 Toast 消息
        const showToastListener = (message: string) => {
            try {
                const obj = JSON.parse(message)
                showToast(obj.type, obj.message)
            } catch { }
        };

        toastEmitter.on('showToast', showToastListener)

        // 清理事件监听
        return () => {
            toastEmitter.off('showToast', showToastListener)
        };
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => removeToast(id), 5000); // Auto dismiss after 5 seconds
    }, [removeToast]);

    const getToastIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5" />;
            case 'error':
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-600 border-green-200';
            case 'error':
                return 'bg-red-50 text-red-600 border-red-200';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-slide-up ${getToastStyles(toast.type)}`}
                    >
                        {getToastIcon(toast.type)}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const showToastGlobal = (type: ToastType, message: string) => {
    toastEmitter.emit('showToast', JSON.stringify({ type, message }))
}
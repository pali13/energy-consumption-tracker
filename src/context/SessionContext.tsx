import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from './WebSocketContext';
import { useAuth } from './AuthContext';

// Definición de las propiedades del contexto de sesión
interface SessionContextProps {
    handleLogout: () => Promise<void>;
}

// Crear el contexto
export const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const { logout } = useAuth(); // Accede a la función logout de AuthProvider
    const { disconnectWebSocket } = useWebSocket(); // Accede a la función disconnectWebSocket

    // Lógica de cierre de sesión
    const handleLogout = async () => {
        disconnectWebSocket(); // Desconectar WebSocket
        await logout(); // Cerrar sesión en AuthProvider
    };

    return (
        <SessionContext.Provider value={{ handleLogout }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
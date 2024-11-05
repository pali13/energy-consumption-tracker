import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import Spinner from '../component/elements/Spinner';
import { useAuth } from './AuthContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface WebSocketContextProps {
    wsocket: WebSocket | null;
    consumptionData: number;
    updateConsumptionData: (newData: number) => void; // Método para actualizar consumptionData
    disconnectWebSocket: () => void; // Agregamos la función de desconexión
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [wsocket, setWsocket] = useState<WebSocket | null>(null);
    const [consumptionData, setConsumptionData] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const { userId, isAuthenticated } = useAuth();
    const [waitingws, setWaitingws] = useState(false);
    const sessionId = useRef<string>(uuidv4());  // Generar un UUID único para la sesión actual
    let isLoggingOut = false;

    // Función para iniciar la conexión WebSocket
    const connectWebSocket = () => {
        const socket = new WebSocket('wss://energy-consumption-tracker.onrender.com/ws/consumption');
        socket.onopen = () => {
            console.log('WebSocket connection opened');
            if (userId) {
                socket.send(JSON.stringify({ userId, sessionId: sessionId.current }));
            }
        };

        socket.onmessage = (event) => {
            setLoading(false);
            console.log('WebSocket connection message');
            const data = parseFloat(event.data);
            setConsumptionData(data);
        };

        socket.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed, attempting to reconnect...');
            setLoading(true);
            // Intentamos reconectar después de 3 segundos
            if (isAuthenticated && !isLoggingOut && wsocket === null) {
                setLoading(true);
                setTimeout(() => connectWebSocket(), 3000);
            } else {
                setLoading(false);
                isLoggingOut = false;
            }
        };
        console.log("No llega?");
        
        setWsocket(socket);
    };

    // Función para desconectar el WebSocket
    const disconnectWebSocket = () => {
        if (isAuthenticated) {
            setWaitingws(true);
            const checkWebSocket = setInterval(() => {
                console.log("WS: ", wsocket);
                if (wsocket) {
                    console.log("Entra");
                    isLoggingOut = true; // Indicamos que estamos en proceso de logout
                    wsocket.send(JSON.stringify({ userId, sessionId: sessionId.current, action: 'logout' })); // Enviar mensaje de logout
                    wsocket.close();
                    setWsocket(null); // Resetear wsocket a null cuando se desconecta
                    setWaitingws(false); // Ocultar el spinner cuando ws esté disponible
                    isLoggingOut = false;

                    clearInterval(checkWebSocket); // Limpiar el intervalo cuando se haya desconectado
                }
            }, 100); // Verificar cada 100 ms (ajusta el tiempo según lo que necesites)
        }
    };

    useEffect(() => {
        if (wsocket) {
            setWaitingws(false); // Ocultar el spinner cuando ws esté disponible
        }
    }, [wsocket]); // Observa los cambios en wsocket

    // Iniciar conexión WebSocket al cargar el componente
    useEffect(() => {
        if (isAuthenticated) {
            connectWebSocket();
        } else {
            disconnectWebSocket(); // Cierra el WebSocket si el usuario no está autenticado
            setLoading(false); // Evita mostrar el spinner indefinidamente
        }

        return () => {
            disconnectWebSocket(); // Asegúrate de cerrar el WebSocket al desmontar el componente
        };
    }, [isAuthenticated, userId]);

    if (loading) {
        return <Spinner message={'Cargando datos de consumo...'} />;
    }
    if (waitingws) {
        return <Spinner message={'Cerrando sesión...'} />;
    }

    // Función para actualizar manualmente el consumptionData
    const updateConsumptionData = (newData: number) => {
        setConsumptionData(prevData => prevData + newData);
    };
    const filteredChildren = React.Children.toArray(children).filter(child => {
        return typeof child !== 'string' || child.trim() !== '';
    });

    return (
        <WebSocketContext.Provider value={{ wsocket, consumptionData, updateConsumptionData, disconnectWebSocket }}>
            {filteredChildren}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextProps => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
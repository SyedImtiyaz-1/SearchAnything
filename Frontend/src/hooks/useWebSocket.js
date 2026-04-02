import { useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws/explore';

export function useWebSocket({ onEvent }) {
  const wsRef = useRef(null);
  const onEventRef = useRef(onEvent);

  // Keep the callback ref up to date
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(({ task, folder }) => {
    // Close any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      onEventRef.current({ type: '_ws_open' });
      ws.send(JSON.stringify({ task, folder }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEventRef.current(data);
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onerror = () => {
      onEventRef.current({ type: '_ws_error' });
    };

    ws.onclose = () => {
      onEventRef.current({ type: '_ws_close' });
    };
  }, []);

  const sendAnswer = useCallback((answer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'human_answer', answer }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { connect, sendAnswer, disconnect };
}

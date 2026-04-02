import { useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import TraceFeed from './components/TraceFeed';
import AnswerPanel from './components/AnswerPanel';
import { PanelLeftClose, PanelLeftOpen, Cpu, Globe } from 'lucide-react';

export default function App() {
  const [folder, setFolder] = useState('');
  const [indexStatus, setIndexStatus] = useState('not_indexed');
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [answerPanelOpen, setAnswerPanelOpen] = useState(false);

  const handleEvent = useCallback((event) => {
    const { type, data } = event;
    const payload = data?.data || data;
    
    switch (type) {
      case '_ws_open':
        setIsConnected(true);
        setIsThinking(true);
        break;
      case '_ws_error':
        setIsThinking(false);
        setEvents(prev => [...prev, { type: 'error', message: 'WebSocket connection failed' }]);
        break;
      case '_ws_close':
        setIsConnected(false);
        setIsThinking(false);
        break;
      case 'complete':
        setIsThinking(false);
        setFinalAnswer(data);
        setAnswerPanelOpen(true);
        setEvents(prev => [...prev, { type: 'complete', ...data }]);
        break;
      case 'tool_call':
      case 'go_deeper':
      case 'ask_human':
        setIsThinking(false);
        setEvents(prev => [...prev, { type, ...data }]);
        if (type === 'ask_human') break;
        setIsThinking(true);
        break;
      default:
        if (type && !type.startsWith('_')) {
          setEvents(prev => [...prev, { type, ...data }]);
        }
    }
  }, []);

  const { connect, sendAnswer } = useWebSocket({ onEvent: handleEvent });

  const handleSubmit = useCallback((query) => {
    setEvents([]);
    setFinalAnswer(null);
    setAnswerPanelOpen(false);
    setIsThinking(false);
    connect({ 
      task: query, 
      folder, 
      use_index: indexStatus === 'indexed',
      enable_semantic: indexStatus === 'indexed',
      enable_metadata: indexStatus === 'indexed'
    });
  }, [connect, folder]);

  const handleHumanAnswer = useCallback((answer) => {
    sendAnswer(answer);
    setIsThinking(true);
    setEvents(prev => [...prev, { type: 'human_answer', answer }]);
  }, [sendAnswer]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Sidebar container */}
      <div
        className={`
          flex-shrink-0 transition-all duration-500 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-80' : 'w-0'}
        `}
      >
        <Sidebar
          folder={folder}
          setFolder={setFolder}
          indexStatus={indexStatus}
          setIndexStatus={setIndexStatus}
        />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-[#050505] relative">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-900 bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-white animate-ping opacity-20"></div>
              </div>
              <h1 className="text-[12px] font-mono font-bold tracking-[0.4em] uppercase text-white">
                SearchAnything
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border border-gray-800 rounded-full">
              <Globe className={`w-3 h-3 ${isConnected ? 'text-white' : 'text-gray-700'}`} />
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isConnected ? 'text-gray-300' : 'text-gray-700'}`}>
                {isConnected ? 'Network Active' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-700" />
              <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Instance_01</span>
            </div>
          </div>
        </header>

        {/* Search Input Section */}
        <section className="px-8 py-8 border-b border-gray-900 bg-black/20">
          <div className="max-w-4xl mx-auto">
             <SearchBar onSubmit={handleSubmit} isThinking={isThinking} />
          </div>
        </section>

        {/* Trace Feed Section */}
        <main className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full">
            <TraceFeed
              events={events}
              isThinking={isThinking}
              onHumanAnswer={handleHumanAnswer}
            />
          </div>
        </main>
      </div>

      {/* Answer Panel Container */}
      <div
        className={`
          flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden
          ${answerPanelOpen ? 'w-[450px]' : 'w-0'}
        `}
      >
        {finalAnswer && (
          <AnswerPanel answer={finalAnswer} />
        )}
      </div>
    </div>
  );
}

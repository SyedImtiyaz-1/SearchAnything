import { useEffect, useRef } from 'react';
import { Terminal, Cpu, Zap } from 'lucide-react';
import TraceEvent from './TraceEvent';

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 animate-fade-in group">
       <div className="relative">
          <div className="w-5 h-5 border-2 border-gray-800 rounded-full"></div>
          <div className="absolute inset-0 w-5 h-5 border-2 border-t-white rounded-full animate-spin"></div>
       </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-mono text-white uppercase tracking-[0.2em] font-bold">
          Processing
        </span>
        <span className="text-[10px] font-mono text-gray-600 animate-pulse">
          Agent is analyzing documents...
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 select-none p-12">
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-gray-800 rotate-12 flex items-center justify-center">
            <Terminal className="w-10 h-10 text-gray-800 -rotate-12" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center animate-bounce">
            <Zap className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="text-center space-y-3 max-w-xs">
        <h3 className="text-sm font-mono text-white uppercase tracking-[0.3em] font-bold">System Idle</h3>
        <p className="text-[11px] font-mono text-gray-600 leading-relaxed">
          The SearchAnything agent is ready to explore your filesystem. Set a base path and initialize the index to begin.
        </p>
      </div>

      <div className="flex items-center gap-2 font-mono text-[10px] text-gray-800 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-900">
        <Cpu className="w-3 h-3" />
        <span>V1.0.4 CORE_LINK_ESTABLISHED</span>
      </div>
    </div>
  );
}

export default function TraceFeed({ events, isThinking, onHumanAnswer }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, isThinking]);

  const isEmpty = events.length === 0 && !isThinking;

  return (
    <div
      ref={containerRef}
      className={`
        h-full overflow-y-auto py-4
        ${isThinking ? 'animate-pulse-glow' : ''}
      `}
      style={{
        boxShadow: isThinking
          ? 'inset 0 0 40px rgba(255,255,255,0.02)'
          : 'none',
        transition: 'box-shadow 0.6s ease',
      }}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="space-y-1 pb-12">
          {events.length > 0 && (
            <div className="px-6 py-6 mb-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-900" />
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">
                  Session Start — {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
              </div>
              <div className="h-px flex-1 bg-gray-900" />
            </div>
          )}

          {events.map((event, index) => (
            <TraceEvent
              key={index}
              event={event}
              onHumanAnswer={onHumanAnswer}
            />
          ))}

          {isThinking && <ThinkingIndicator />}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

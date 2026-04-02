import { useState } from 'react';
import { Settings, Play, HelpCircle, CheckCircle2, AlertCircle, User, CornerDownRight } from 'lucide-react';

export default function TraceEvent({ event, onHumanAnswer }) {
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);

  const handleSendAnswer = () => {
    if (!answer.trim() || answered) return;
    onHumanAnswer(answer.trim());
    setAnswered(true);
  };

  switch (event.type) {
    case 'tool_call':
      return (
        <div className="animate-fade-in flex items-start gap-4 px-6 py-3 hover:bg-gray-900/40 rounded-lg transition-all duration-300 group">
          <div className="mt-1 p-1 bg-gray-900 border border-gray-800 rounded group-hover:border-gray-600 transition-colors">
            <Settings className="w-3 h-3 text-gray-500 group-hover:text-white" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
               <span className="text-[12px] font-mono text-white font-medium">
                {event.tool || event.name || 'unknown_tool'}
              </span>
              {event.args && (
                <span className="text-[10px] font-mono text-gray-600 truncate max-w-[300px]">
                  ({JSON.stringify(event.args).replace(/^{|}$/g, '')})
                </span>
              )}
            </div>
            {event.reason && (
              <span className="text-[11px] text-gray-500 italic opacity-80">— {event.reason}</span>
            )}
          </div>
        </div>
      );

    case 'go_deeper':
      return (
        <div className="animate-fade-in flex items-center gap-3 ml-12 pr-6 py-2.5 hover:bg-gray-900/40 rounded-lg transition-all">
          <Play className="w-3 h-3 text-gray-700 fill-gray-700" />
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
            Navigating into{' '}
            <span className="text-white bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
              {event.path || event.folder || '/'}
            </span>
          </span>
        </div>
      );

    case 'ask_human':
      return (
        <div className="animate-fade-in mx-6 my-4 bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[10px] font-mono text-white uppercase tracking-[0.2em] font-bold">Agent Query</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
            <p className="text-[13px] text-gray-200 font-mono leading-relaxed bg-black/40 p-4 rounded-lg border border-gray-800">
              {event.question || event.message || 'The agent needs your input.'}
            </p>
          </div>
          {!answered ? (
            <div className="px-6 py-4 bg-black flex gap-3">
              <input
                id={`human-answer-input-${Date.now()}`}
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendAnswer()}
                placeholder="Type your response..."
                className="
                  flex-1 px-4 py-2.5 text-[12px] font-mono
                  bg-gray-900 border border-gray-800 rounded-lg
                  text-white placeholder-gray-700
                  focus:outline-none focus:border-gray-500
                  transition-all duration-300
                "
              />
              <button
                onClick={handleSendAnswer}
                className="
                  px-5 py-2.5 text-[11px] font-mono uppercase tracking-widest
                  bg-white text-black rounded-lg font-bold
                  hover:bg-gray-200 transition-all
                  cursor-pointer whitespace-nowrap active:scale-95
                "
              >
                Send
              </button>
            </div>
          ) : (
            <div className="px-6 py-3.5 bg-gray-900/30 flex items-center gap-3">
              <CornerDownRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Confirmed:</span>
              <span className="text-[12px] font-mono text-gray-300">{answer}</span>
            </div>
          )}
        </div>
      );

    case 'human_answer':
      return (
        <div className="animate-fade-in flex items-center gap-3 ml-12 pr-6 py-2 text-[11px] font-mono text-gray-600 italic">
          <CornerDownRight className="w-4 h-4 text-gray-700" />
          <span className="opacity-60">Response recorded:</span>
          <span className="text-gray-400 font-normal not-italic">{event.answer}</span>
        </div>
      );

    case 'complete':
      return (
        <div className="animate-fade-in flex items-center gap-4 px-6 py-6 border-t border-gray-900 mt-4 bg-gradient-to-b from-transparent to-gray-950/20">
          <div className="p-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <CheckCircle2 className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-mono text-white uppercase tracking-[0.3em] font-bold">
              Exploration Terminated
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-mono text-gray-600">
                {event.docs_read ? `${event.docs_read} files analyzed` : 'Success'}
              </span>
              <div className="w-1 h-1 bg-gray-800 rounded-full" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Verified</span>
            </div>
          </div>
        </div>
      );

    case 'error':
      return (
        <div className="animate-fade-in flex items-center gap-3 px-6 py-4 bg-red-950/5 border-l-2 border-red-900/50">
          <AlertCircle className="w-4 h-4 text-gray-600" />
          <span className="text-[12px] font-mono text-gray-500 uppercase tracking-wider">{event.message || 'System fault detected'}</span>
        </div>
      );

    default:
      return null;
  }
}

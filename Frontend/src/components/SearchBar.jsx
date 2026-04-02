import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

export default function SearchBar({ onSubmit, isThinking }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isThinking) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      <div className="relative flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-white">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask anything about your documents…"
          disabled={isThinking}
          className="
            w-full pl-11 pr-4 py-3.5
            bg-gray-900 border border-gray-800
            rounded-xl text-[14px] font-mono text-white
            placeholder-gray-700
            focus:outline-none focus:border-gray-500 focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          "
        />
        {isThinking && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
      </div>

      <button
        id="search-submit-btn"
        type="submit"
        disabled={!query.trim() || isThinking}
        className="
          group px-6 py-3.5 rounded-xl text-[12px] font-mono uppercase tracking-[0.2em]
          bg-white text-black
          hover:bg-gray-200
          disabled:opacity-10 disabled:cursor-not-allowed
          active:scale-[0.97]
          transition-all duration-200 cursor-pointer
          whitespace-nowrap font-bold flex items-center gap-2
        "
      >
        {isThinking ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Search
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

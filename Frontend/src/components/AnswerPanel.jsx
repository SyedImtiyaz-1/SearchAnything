import { useState } from 'react';
import { FileText, Database, DollarSign, ChevronDown, CheckCircle2, Bookmark } from 'lucide-react';

function CitationBadge({ citation, index }) {
  return (
    <span
      key={index}
      className="
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-lg
        bg-gray-900 border border-gray-800
        text-[10px] font-mono text-gray-400
        hover:border-gray-600 hover:text-white transition-all
        cursor-default group
      "
    >
      <Bookmark className="w-3 h-3 text-gray-700 group-hover:text-gray-400" />
      {citation}
    </span>
  );
}

function FileTraceSection({ files }) {
  const [open, setOpen] = useState(false);

  if (!files || files.length === 0) return null;

  return (
    <div className="border-t border-gray-800 mt-6 pt-4">
      <button
        id="file-trace-toggle"
        onClick={() => setOpen(v => !v)}
        className="
          w-full flex items-center justify-between
          px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest
          hover:text-gray-300 transition-colors cursor-pointer
        "
      >
        <span className="flex items-center gap-2">
          Analyzed Sources ({files.length})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="px-4 py-4 space-y-2 max-h-64 overflow-y-auto mt-2 bg-black/40 rounded-lg border border-gray-900">
          {files.map((file, i) => (
            <li
              key={i}
              className="text-[10px] font-mono text-gray-600 flex items-center gap-3 hover:text-gray-400 transition-colors"
            >
              <div className="w-1 h-1 bg-gray-800 rounded-full" />
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnswerPanel({ answer }) {
  if (!answer) return null;

  const {
    final_result,
    stats = {},
    trace = {},
  } = answer;

  const text = final_result || 'The agent completed the exploration.';
  const citations = trace.cited_sources || [];
  const files_accessed = trace.referenced_documents || [];
  const docs_read = stats.documents_scanned || 0;
  const tokens = stats.total_tokens || 0;
  const cost = stats.estimated_cost || 0;

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden border-l border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-800 bg-gray-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
            <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-white font-bold">
              Final Synthesis
            </h3>
          </div>
          <div className="px-2 py-0.5 rounded border border-gray-800 text-[9px] font-mono text-gray-600 uppercase tracking-tighter">
            Resolved
          </div>
        </div>
      </div>

      {/* Answer Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Main answer card */}
        <div className="relative group">
           <div className="absolute -inset-2 bg-gradient-to-r from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
           <div className="text-[14px] text-gray-200 leading-[1.8] font-mono whitespace-pre-wrap selection:bg-white selection:text-black">
              {text || 'The agent completed the exploration. See file trace for details.'}
           </div>
        </div>

        {/* Citations */}
        {citations.length > 0 && (
          <div className="mt-8">
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-3">Verification Sources</p>
            <div className="flex flex-wrap gap-2">
              {citations.map((c, i) => (
                <CitationBadge key={i} citation={c} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* File Trace */}
        <FileTraceSection files={files_accessed} />

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
              Intelligence Read
            </div>
            <span className="text-[11px] font-mono text-gray-400 font-bold">{docs_read} files</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <Database className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
              Token Volatility
            </div>
            <span className="text-[11px] font-mono text-gray-400 font-bold">
              {typeof tokens === 'number' ? tokens.toLocaleString() : tokens}
            </span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <DollarSign className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
              Resource Cost
            </div>
            <span className="text-[11px] font-mono text-white font-bold">
              ${typeof cost === 'number' ? cost.toFixed(4) : cost}
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="p-6 bg-black flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity border-t border-gray-900">
          <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span className="text-[8px] font-mono text-white uppercase tracking-[0.5em]">System Secure</span>
          </div>
      </div>
    </div>
  );
}

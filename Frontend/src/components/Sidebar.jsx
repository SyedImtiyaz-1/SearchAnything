import { useState, useRef } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, Info, Check, RefreshCw } from 'lucide-react';

const MOCK_TREE = [
  { name: 'Documents', expanded: false, children: ['Reports', 'Contracts'] },
  { name: 'Downloads', expanded: false, children: ['PDFs', 'Archives'] },
  { name: 'Projects', expanded: false, children: ['SearchAnything', 'DataLake'] },
];

export default function Sidebar({ folder, setFolder, indexStatus, setIndexStatus }) {
  const [tree, setTree] = useState(MOCK_TREE);
  const [indexProgress, setIndexProgress] = useState(0);
  const inputRef = useRef(null);

  const toggleNode = (index) => {
    setTree(prev =>
      prev.map((node, i) =>
        i === index ? { ...node, expanded: !node.expanded } : node
      )
    );
  };

  const handleIndex = async () => {
    if (!folder) return;
    setIndexStatus('indexing');
    setIndexProgress(0);

    let prog = 0;
    const timer = setInterval(() => {
      prog += Math.random() * 15 + 5;
      setIndexProgress(Math.min(prog, 95));
      if (prog >= 95) {
        clearInterval(timer);
        fetch('http://localhost:8000/api/index', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder }),
        })
          .then(() => {
            setIndexProgress(100);
            setTimeout(() => {
              setIndexStatus('indexed');
              setIndexProgress(0);
            }, 500);
          })
          .catch(() => {
            setIndexStatus('indexed');
            setIndexProgress(0);
          });
      }
    }, 180);
  };

  const selectFolder = (name) => {
    setFolder(name);
    setIndexStatus('not_indexed');
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden select-none border-r border-gray-800">
      {/* Header */}
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-4 h-4 text-gray-500" />
          <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
            Base Folder
          </h2>
        </div>

        {/* Path Input */}
        <div className="flex gap-2 group">
          <div className="relative flex-1">
            <input
              id="folder-path-input"
              ref={inputRef}
              type="text"
              value={folder}
              onChange={e => { setFolder(e.target.value); setIndexStatus('not_indexed'); }}
              placeholder="/path/to/docs"
              className="
                w-full pl-3 pr-3 py-2
                bg-gray-900 border border-gray-800
                rounded-md text-[11px] font-mono text-white placeholder-gray-600
                focus:outline-none focus:border-gray-500 focus:ring-0
                transition-all duration-200
              "
            />
          </div>
          <button
            id="set-folder-btn"
            onClick={() => inputRef.current?.focus()}
            className="
              px-3 py-2 text-[10px] font-mono uppercase tracking-wider
              bg-gray-800 border border-gray-700 rounded-md
              text-gray-400 hover:text-white hover:bg-gray-700
              transition-all duration-200 cursor-pointer
            "
          >
            Set
          </button>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center gap-2">
          {indexStatus === 'indexed' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white text-white">
              <Check className="w-3 h-3" />
              <span className="text-[9px] font-mono uppercase tracking-widest font-bold">INDEXED</span>
            </div>
          ) : indexStatus === 'indexing' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-700 text-gray-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-[9px] font-mono uppercase tracking-widest">INDEXING</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-800 text-gray-600">
              <Info className="w-3 h-3" />
              <span className="text-[9px] font-mono uppercase tracking-widest">NOT INDEXED</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {indexStatus === 'indexing' && (
          <div className="mt-3 h-[2px] w-full bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${indexProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Directory Tree */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <div className="w-1 h-1 bg-gray-700 rounded-full" />
          Filesystem Explorer
        </p>

        <ul className="space-y-1">
          {tree.map((node, i) => (
            <li key={node.name}>
              <button
                id={`dir-node-${node.name.toLowerCase()}`}
                onClick={() => { toggleNode(i); selectFolder(node.name); }}
                className="
                  w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md
                  text-left text-[12px] font-mono text-gray-400
                  hover:bg-gray-900 hover:text-white transition-all
                  cursor-pointer group
                "
              >
                {node.expanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
                )}
                {node.name}
              </button>

              {node.expanded && (
                <ul className="ml-5 space-y-1 mt-1 border-l border-gray-800">
                  {node.children.map(child => (
                    <li key={child}>
                      <button
                        onClick={() => selectFolder(`${node.name}/${child}`)}
                        className="
                          w-full flex items-center gap-2.5 px-4 py-1.5
                          text-left text-[11px] font-mono text-gray-600
                          hover:text-white transition-all
                          cursor-pointer
                        "
                      >
                        <span className="text-gray-800">—</span>
                        {child}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Index Button */}
      <div className="px-5 py-5 border-t border-gray-800 bg-black">
        <button
          id="index-folder-btn"
          onClick={handleIndex}
          disabled={!folder || indexStatus === 'indexing' || indexStatus === 'indexed'}
          className="
            w-full py-3 rounded-md text-[10px] font-mono uppercase tracking-[0.2em]
            transition-all duration-300 cursor-pointer
            disabled:opacity-20 disabled:cursor-not-allowed
            bg-white text-black hover:bg-gray-200
            flex items-center justify-center gap-2
            font-bold active:scale-[0.98]
          "
        >
          {indexStatus === 'indexing' ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Indexing
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Index Documents
            </>
          )}
        </button>
      </div>
    </div>
  );
}

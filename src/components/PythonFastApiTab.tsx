import React, { useState, useEffect } from 'react';
import { 
  Code2, Copy, Check, Database, Layers, Sparkles, 
  Terminal, FileCode, CheckCircle2, Download
} from 'lucide-react';

export const PythonFastApiTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('models.py');
  const [filesContent, setFilesContent] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fastapi-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFilesContent(data.files);
        }
      })
      .catch((err) => console.error('Error fetching python files:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    const text = filesContent[selectedFile] || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileTabs = [
    { key: 'models.py', name: 'models.py (SQLAlchemy 2.0)', desc: '16 сущностей и метки из ТЗ' },
    { key: 'schemas.py', name: 'schemas.py (Pydantic v2)', desc: 'DTO и валидация запросов' },
    { key: 'gemini_proxy.py', name: 'gemini_proxy.py', desc: 'Прослойка Proxy API для РФ' },
    { key: 'main.py', name: 'main.py (FastAPI Routes)', desc: 'Эндпоинты, поиск и логика' },
    { key: 'parsers/avito_cian.py', name: 'parsers/avito_cian.py', desc: 'Парсер площадок с AI-тегами' },
    { key: 'requirements.txt', name: 'requirements.txt', desc: 'Зависимости Python' },
    { key: 'README.md', name: 'README.md', desc: 'Инструкция по развертыванию' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Python FastAPI & База данных</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Архитектура бэкенда на FastAPI + SQLAlchemy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Спроектированная база данных со всеми 16 сущностями, прослойка через Proxy API и готовый для копирования/развертывания код.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Скопировано в буфер!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Скопировать {selectedFile}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Domain Entities Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Реализованные метки и таблицы в базе данных (16 из 16):</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            'Предпочтения пользователя', 'Район и локация', 'Новостройки', 'Льготные ипотеки',
            'Рынок аренды', 'Геоданные', 'Генеральный план', 'Открытые данные',
            'Анализ района', 'Будущая инфраструктура', 'Сравнение новостроек', 'Покупка vs аренда',
            'Аренда ближе/дальше', 'Объяснение и источники', 'Отчёт', 'Неопределённость'
          ].map((tag, i) => (
            <div key={i} className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* File Tabs */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 block px-1">Файлы проекта:</span>
          {fileTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFile(tab.key)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedFile === tab.key
                  ? 'bg-slate-800 text-white border-indigo-500/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <FileCode className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{tab.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6 line-clamp-1">{tab.desc}</p>
            </button>
          ))}
        </div>

        {/* Code Editor Preview */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>backend_fastapi/{selectedFile}</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>Копировать</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-xs font-mono text-slate-200 leading-relaxed">
            {loading ? (
              <div className="py-20 text-center text-slate-500">Загрузка файлов...</div>
            ) : (
              <pre className="whitespace-pre">
                {filesContent[selectedFile] || '# Файл пуст или загружается'}
              </pre>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { FileSpreadsheet, Download, Printer, Upload } from 'lucide-react';

interface ExecutiveHeaderProps {
  onOpenImport: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  onOpenImport,
  onExportExcel,
  onPrint,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark / Brand title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            AT
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              Avaliação Talks
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Dashboard Executivo de Conteúdo e Satisfação (NPS)
            </p>
          </div>
        </div>

        {/* Zone 2 & 3: Primary Actions (Single-line controls) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Importar Excel</span>
            <span className="sm:hidden">Importar</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Exportar dados consolidados em planilha Excel"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Exportar Excel</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Imprimir ou salvar como PDF executivo em página única"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Imprimir / PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};

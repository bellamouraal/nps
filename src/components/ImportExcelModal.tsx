import React, { useState, useRef } from 'react';
import { parseExcelWorkbook, downloadSampleTemplate } from '../utils/excelParser';
import { CompanyTalk } from '../types/dashboard';
import { Upload, FileSpreadsheet, Download, X, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (talks: CompanyTalk[]) => void;
  onResetDefault: () => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onResetDefault,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const buffer = await file.arrayBuffer();
      const parsedTalks = parseExcelWorkbook(buffer);

      if (parsedTalks.length === 0) {
        throw new Error('Nenhuma empresa ou talk encontrado na planilha.');
      }

      setSuccessInfo({
        count: parsedTalks.length,
        filename: file.name,
      });

      // Apply data
      onDataLoaded(parsedTalks);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      console.error('Erro ao ler Excel:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao processar o arquivo Excel.';
      setErrorMessage(msg);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Carregar Planilha &ldquo;Avaliação Talks&rdquo;
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Importe sua planilha oficial em formato <span className="font-semibold text-slate-700">.xlsx, .xls ou .csv</span>. Os cálculos de NPS, taxas de resposta e distribuições serão atualizados imediatamente.
        </p>

        {/* Dropzone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={onFileInputChange}
          />
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Clique ou arraste seu arquivo Excel aqui
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Suporta formato consolidado (notas 1 a 5) ou lista individual de respondentes
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Erro ao importar:</span> {errorMessage}
            </div>
          </div>
        )}

        {successInfo && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <strong>{successInfo.count} talks</strong> importados com sucesso de {successInfo.filename}!
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium py-1.5 px-2.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Modelo (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResetDefault();
              onClose();
            }}
            className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium py-1.5 px-2.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Dados Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
};

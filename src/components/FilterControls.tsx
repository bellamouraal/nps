import React from 'react';
import { SortOption, FilterZone } from '../types/dashboard';
import { Search, ArrowUpDown, LayoutGrid, Table } from 'lucide-react';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterZone;
  onFilterChange: (zone: FilterZone) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  totalFiltered: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 no-print">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar empresa ou tema..."
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            ×
          </button>
        )}
      </div>

      {/* Segmented Filter by NPS Zone (interactive buttons) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs shrink-0">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-2.5 py-1 font-medium rounded-md transition-colors shrink-0 ${
            activeFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todos ({totalFiltered})
        </button>
        <button
          onClick={() => onFilterChange('excelencia')}
          className={`px-2.5 py-1 font-medium rounded-md transition-colors shrink-0 ${
            activeFilter === 'excelencia'
              ? 'bg-white text-emerald-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Excelência (≥ 75)
        </button>
        <button
          onClick={() => onFilterChange('qualidade')}
          className={`px-2.5 py-1 font-medium rounded-md transition-colors shrink-0 ${
            activeFilter === 'qualidade'
              ? 'bg-white text-teal-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Qualidade (50–74)
        </button>
        <button
          onClick={() => onFilterChange('aperfeicoamento')}
          className={`px-2.5 py-1 font-medium rounded-md transition-colors shrink-0 ${
            activeFilter === 'aperfeicoamento'
              ? 'bg-white text-amber-800 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Aperfeiçoamento (&lt; 50)
        </button>
      </div>

      {/* Sorting & View Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="nps-desc">NPS (Maior para Menor)</option>
            <option value="nps-asc">NPS (Menor para Maior)</option>
            <option value="evaluations-desc">Mais Avaliações</option>
            <option value="participants-desc">Mais Participantes</option>
            <option value="responseRate-desc">Maior Taxa de Resposta</option>
            <option value="name-asc">Nome da Empresa (A-Z)</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Visualização em Cards"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Visualização em Tabela Executiva"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

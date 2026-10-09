/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CompanyTalk, CalculatedCompanyTalk, SortOption, FilterZone } from './types/dashboard';
import { INITIAL_TALKS_DATA } from './data/defaultData';
import { calculateCompanyMetrics, calculateOverallKPIs } from './utils/npsCalculator';
import { exportTalksToExcel } from './utils/excelParser';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { KPICards } from './components/KPICards';
import { NPSRankingChart } from './components/NPSRankingChart';
import { CompanyCard } from './components/CompanyCard';
import { FilterControls } from './components/FilterControls';
import { ExecutiveTable } from './components/ExecutiveTable';
import { ImportExcelModal } from './components/ImportExcelModal';
import { TalkDetailModal } from './components/TalkDetailModal';

export default function App() {
  const [talksData, setTalksData] = useState<CompanyTalk[]>(INITIAL_TALKS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterZone>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nps-desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTalk, setSelectedTalk] = useState<CalculatedCompanyTalk | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Calculate all metrics for all talks
  const calculatedTalks: CalculatedCompanyTalk[] = useMemo(() => {
    return talksData.map(calculateCompanyMetrics);
  }, [talksData]);

  // Overall KPIs
  const overallKPIs = useMemo(() => {
    return calculateOverallKPIs(calculatedTalks);
  }, [calculatedTalks]);

  // Filter and sort talks
  const filteredAndSortedTalks = useMemo(() => {
    let result = [...calculatedTalks];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.companyName.toLowerCase().includes(q) ||
          (t.talkTitle && t.talkTitle.toLowerCase().includes(q))
      );
    }

    // Filter by zone
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.npsZone === activeFilter);
    }

    // Sort order
    result.sort((a, b) => {
      switch (sortBy) {
        case 'nps-desc':
          return b.nps - a.nps;
        case 'nps-asc':
          return a.nps - b.nps;
        case 'evaluations-desc':
          return b.totalEvaluations - a.totalEvaluations;
        case 'participants-desc':
          return b.participants - a.participants;
        case 'responseRate-desc':
          return b.responseRate - a.responseRate;
        case 'name-asc':
          return a.companyName.localeCompare(b.companyName);
        default:
          return b.nps - a.nps;
      }
    });

    return result;
  }, [calculatedTalks, searchQuery, activeFilter, sortBy]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportTalksToExcel(calculatedTalks);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Executive Top Bar */}
      <ExecutiveHeader
        onOpenImport={() => setIsImportModalOpen(true)}
        onExportExcel={handleExport}
        onPrint={handlePrint}
      />

      {/* Main Single Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Top Indicators (4 KPIs + Rule Bar) */}
        <section aria-label="Indicadores Principais">
          <KPICards kpis={overallKPIs} />
        </section>

        {/* NPS Ranking Chart by Company */}
        <section aria-label="Ranking de NPS por Empresa">
          <NPSRankingChart
            talks={calculatedTalks}
            onSelectTalk={(talk) => setSelectedTalk(talk)}
            selectedTalkId={selectedTalk?.id}
          />
        </section>

        {/* Filter and View Controls */}
        <section aria-label="Filtros e Controles">
          <FilterControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFiltered={filteredAndSortedTalks.length}
          />
        </section>

        {/* Main Content Area: Cards por Empresa or Executive Table */}
        <section aria-label="Cards por Empresa">
          {filteredAndSortedTalks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                Nenhum talk encontrado para os filtros selecionados.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedTalks.map((talk, idx) => (
                <CompanyCard
                  key={talk.id}
                  talk={talk}
                  rank={idx + 1}
                  onOpenDetail={(t) => setSelectedTalk(t)}
                />
              ))}
            </div>
          ) : (
            <ExecutiveTable
              talks={filteredAndSortedTalks}
              onSelectTalk={(t) => setSelectedTalk(t)}
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Avaliação Talks · Metodologia NPS adaptada (Promotores: 4-5 · Neutros: 3 · Detratores: 1-2)
          </span>
          <span className="font-mono tabular-nums text-[11px] text-slate-500">
            Escala −100 a +100 · {calculatedTalks.length} empresas avaliadas
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onDataLoaded={(newTalks) => {
          setTalksData(newTalks);
        }}
        onResetDefault={() => {
          setTalksData(INITIAL_TALKS_DATA);
        }}
      />

      <TalkDetailModal
        talk={selectedTalk}
        onClose={() => setSelectedTalk(null)}
        overallNps={overallKPIs.overallNps}
      />
    </div>
  );
}

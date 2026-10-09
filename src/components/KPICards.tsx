import React from 'react';
import { OverallKPIs } from '../types/dashboard';
import { formatNps, getNpsColor } from '../utils/npsCalculator';
import { Users, FileCheck2, Percent, TrendingUp, AlertCircle, CheckCircle2, Minus } from 'lucide-react';

interface KPICardsProps {
  kpis: OverallKPIs;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const npsStyle = getNpsColor(kpis.overallNps);

  return (
    <div className="space-y-3">
      {/* 4 Primary Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: NPS Geral dos Talks */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              NPS Geral dos Talks
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Escala -100 a +100</span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight tabular-nums font-mono ${npsStyle.text}`}>
              {formatNps(kpis.overallNps)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {kpis.overallNps >= 75 ? 'Zona de Excelência' : kpis.overallNps >= 50 ? 'Zona de Qualidade' : kpis.overallNps >= 0 ? 'Zona de Aperfeiçoamento' : 'Zona Crítica'}
            </span>
          </div>

          {/* Breakdown Promoters / Detractors */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-medium">
              {kpis.overallPromotersPct.toFixed(0)}% Promotores (4-5)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">
              {kpis.overallNeutralsPct.toFixed(0)}% Neutros (3)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-rose-700 font-medium">
              {kpis.overallDetractorsPct.toFixed(0)}% Detratores (1-2)
            </span>
          </div>
        </div>

        {/* KPI 2: Total de Participantes */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Total de Participantes
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Público presente</span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight tabular-nums font-mono text-slate-900">
              {kpis.totalParticipants.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-slate-500">participantes</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{kpis.totalCompanies} empresas / talks</span>
            <span className="text-slate-400">
              Média ~{kpis.totalCompanies > 0 ? Math.round(kpis.totalParticipants / kpis.totalCompanies) : 0} por sala
            </span>
          </div>
        </div>

        {/* KPI 3: Total de Avaliações */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              Total de Avaliações
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Amostra válida</span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight tabular-nums font-mono text-slate-900">
              {kpis.totalEvaluations.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-slate-500">avaliações válidas</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Respondentes de conteúdo</span>
            <span className="text-slate-400">Escala de 1 a 5</span>
          </div>
        </div>

        {/* KPI 4: Taxa Geral de Resposta */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-violet-600" />
              Taxa Geral de Resposta
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Avaliações / Participantes</span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight tabular-nums font-mono text-slate-900">
              {kpis.overallResponseRate.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">de engajamento</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-violet-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, kpis.overallResponseRate))}%` }} 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Formula Context Bar */}
      <div className="bg-slate-100/80 rounded-lg px-3.5 py-2 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Regra de Cálculo:</span>
          <span>NPS = % Promotores (notas 4 e 5) − % Detratores (notas 1 e 2)</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-500 hidden md:inline">Neutros (nota 3) não compõem a diferença</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" /> Promotores: {kpis.overallPromotersPct.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <Minus className="w-3 h-3" /> Neutros: {kpis.overallNeutralsPct.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <AlertCircle className="w-3 h-3" /> Detratores: {kpis.overallDetractorsPct.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

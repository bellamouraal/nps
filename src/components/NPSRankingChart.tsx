import React from 'react';
import { CalculatedCompanyTalk } from '../types/dashboard';
import { formatNps, getNpsColor } from '../utils/npsCalculator';
import { CompanyLogo } from './CompanyLogo';
import { Trophy } from 'lucide-react';

interface NPSRankingChartProps {
  talks: CalculatedCompanyTalk[];
  onSelectTalk?: (talk: CalculatedCompanyTalk) => void;
  selectedTalkId?: string | null;
}

export const NPSRankingChart: React.FC<NPSRankingChartProps> = ({
  talks,
  onSelectTalk,
  selectedTalkId,
}) => {
  // Always sorted from highest NPS to lowest NPS
  const sortedTalks = [...talks].sort((a, b) => b.nps - a.nps);

  // Maximum absolute score to scale visual bar (at least 100 for true NPS scale)
  const maxScale = 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Ranking Comparativo de NPS por Empresa
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block"></span>
            Excelência (≥ 75)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 inline-block"></span>
            Qualidade (50–74)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span>
            Aperfeiçoamento (0–49)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block"></span>
            Crítica (&lt; 0)
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {sortedTalks.map((talk, idx) => {
          const colors = getNpsColor(talk.nps);
          const isPositive = talk.nps >= 0;
          const barWidthPercent = Math.min(100, Math.max(2, (Math.abs(talk.nps) / maxScale) * 100));
          const isSelected = selectedTalkId === talk.id;

          return (
            <div
              key={talk.id}
              onClick={() => onSelectTalk?.(talk)}
              className={`group p-2 rounded-lg border transition-all cursor-pointer ${
                isSelected 
                  ? 'border-indigo-400 bg-indigo-50/40 ring-1 ring-indigo-400/30' 
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                {/* Company Name & Rank */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 text-center text-xs font-mono font-semibold tabular-nums shrink-0 ${
                    idx === 0 ? 'text-amber-600' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>
                  
                  <CompanyLogo companyName={talk.companyName} color={talk.logoColor} className="w-6 h-6 text-[10px]" />

                  <div className="min-w-0 truncate">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {talk.companyName}
                    </span>
                    {talk.talkTitle && (
                      <span className="text-[11px] text-slate-400 ml-2 hidden md:inline truncate">
                        — {talk.talkTitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mandated Format: NPS +XX | XX avaliações | XX participantes */}
                <div className="flex items-center gap-2 self-end sm:self-auto text-xs shrink-0">
                  <span className={`font-mono font-bold tabular-nums px-1.5 py-0.5 rounded text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
                    NPS {formatNps(talk.nps)}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-mono tabular-nums text-[11px]">
                    {talk.totalEvaluations} avaliações
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 font-mono tabular-nums text-[11px]">
                    {talk.participants} participantes
                  </span>
                  <span className="text-slate-300 hidden lg:inline">|</span>
                  <span className="text-slate-500 font-mono tabular-nums text-[11px] hidden lg:inline">
                    {talk.responseRate.toFixed(0)}% resposta
                  </span>
                </div>
              </div>

              {/* Visual Relative NPS Scale Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidthPercent}%`,
                    backgroundColor: colors.barColor,
                  }}
                  title={`NPS: ${formatNps(talk.nps)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

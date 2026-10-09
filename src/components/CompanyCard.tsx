import React from 'react';
import { CalculatedCompanyTalk } from '../types/dashboard';
import { formatNps, getNpsColor, RATING_SCALE_CONFIG } from '../utils/npsCalculator';
import { CompanyLogo } from './CompanyLogo';
import { Users, FileCheck, Percent, Info } from 'lucide-react';

interface CompanyCardProps {
  talk: CalculatedCompanyTalk;
  rank: number;
  onOpenDetail?: (talk: CalculatedCompanyTalk) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ talk, rank, onOpenDetail }) => {
  const colors = getNpsColor(talk.nps);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Logo + Company Name & Rank + NPS Badge in Highlight */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <CompanyLogo 
                companyName={talk.companyName} 
                color={talk.logoColor} 
                className="w-10 h-10" 
              />
              <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-900 text-[10px] font-mono text-white flex items-center justify-center font-bold">
                {rank}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate leading-tight">
                {talk.companyName}
              </h3>
              {talk.talkTitle && (
                <p className="text-xs text-slate-500 truncate mt-0.5" title={talk.talkTitle}>
                  {talk.talkTitle}
                </p>
              )}
            </div>
          </div>

          {/* NPS do conteúdo em destaque */}
          <div className="text-right shrink-0">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
              NPS Conteúdo
            </div>
            <div className={`inline-flex items-baseline px-2.5 py-1 rounded-md border font-mono font-bold text-base tabular-nums ${colors.bg} ${colors.text} ${colors.border}`}>
              <span>NPS</span>
              <span className="ml-1 text-lg">{formatNps(talk.nps)}</span>
            </div>
          </div>
        </div>

        {/* Mandated Format Header Row: NPS +72 | 45 avaliações | 120 participantes */}
        <div className="mt-2.5 py-1.5 px-2 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 font-mono tabular-nums">
            NPS {formatNps(talk.nps)}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-mono tabular-nums">
            {talk.totalEvaluations} avaliações
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-mono tabular-nums">
            {talk.participants} participantes
          </span>
        </div>

        {/* 3 Metrics: Participantes, Avaliações, Taxa de Resposta */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Users className="w-3 h-3 text-slate-400" />
              <span>Participantes</span>
            </div>
            <div className="mt-1 font-mono font-semibold text-slate-900 tabular-nums text-sm">
              {talk.participants}
            </div>
            <div className="text-[10px] text-slate-400">em sala</div>
          </div>

          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <FileCheck className="w-3 h-3 text-slate-400" />
              <span>Avaliações</span>
            </div>
            <div className="mt-1 font-mono font-semibold text-slate-900 tabular-nums text-sm">
              {talk.totalEvaluations}
            </div>
            <div className="text-[10px] text-slate-400">respostas válidas</div>
          </div>

          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Percent className="w-3 h-3 text-slate-400" />
              <span>Taxa Resposta</span>
            </div>
            <div className="mt-1 font-mono font-semibold text-slate-900 tabular-nums text-sm">
              {talk.responseRate.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">de adesão</div>
          </div>
        </div>

        {/* Visual Distribution of Ratings 1 to 5 */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Distribuição das Notas (1 a 5)</span>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              Total: {talk.totalEvaluations} respostas
            </span>
          </div>

          {/* Stacked Proportional Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/50 shadow-2xs">
            {talk.totalEvaluations > 0 ? (
              <>
                <div 
                  style={{ width: `${talk.ratingPcts[1]}%` }} 
                  className="bg-rose-500 h-full transition-all" 
                  title={`1 - Totalmente inútil: ${talk.ratings.score1} (${talk.ratingPcts[1].toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${talk.ratingPcts[2]}%` }} 
                  className="bg-orange-400 h-full transition-all" 
                  title={`2 - Pouco útil: ${talk.ratings.score2} (${talk.ratingPcts[2].toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${talk.ratingPcts[3]}%` }} 
                  className="bg-slate-400 h-full transition-all" 
                  title={`3 - Indiferente: ${talk.ratings.score3} (${talk.ratingPcts[3].toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${talk.ratingPcts[4]}%` }} 
                  className="bg-sky-400 h-full transition-all" 
                  title={`4 - Útil: ${talk.ratings.score4} (${talk.ratingPcts[4].toFixed(1)}%)`} 
                />
                <div 
                  style={{ width: `${talk.ratingPcts[5]}%` }} 
                  className="bg-emerald-500 h-full transition-all" 
                  title={`5 - Totalmente útil: ${talk.ratings.score5} (${talk.ratingPcts[5].toFixed(1)}%)`} 
                />
              </>
            ) : (
              <div className="w-full h-full bg-slate-200 text-slate-400 text-[10px] text-center">Sem avaliações</div>
            )}
          </div>

          {/* Detailed 1-5 scale legend with numbers and percentages */}
          <div className="mt-2.5 grid grid-cols-5 gap-1 text-[11px] font-mono tabular-nums text-center">
            <div className="p-1 rounded bg-rose-50/60 border border-rose-100/80">
              <div className="text-[10px] text-rose-700 font-sans font-semibold">1 · Inútil</div>
              <div className="font-bold text-rose-900 mt-0.5">{talk.ratings.score1}</div>
              <div className="text-[9px] text-rose-600">{talk.ratingPcts[1].toFixed(0)}%</div>
            </div>

            <div className="p-1 rounded bg-orange-50/60 border border-orange-100/80">
              <div className="text-[10px] text-orange-700 font-sans font-semibold">2 · Pouco</div>
              <div className="font-bold text-orange-900 mt-0.5">{talk.ratings.score2}</div>
              <div className="text-[9px] text-orange-600">{talk.ratingPcts[2].toFixed(0)}%</div>
            </div>

            <div className="p-1 rounded bg-slate-100/70 border border-slate-200/70">
              <div className="text-[10px] text-slate-600 font-sans font-semibold">3 · Neutro</div>
              <div className="font-bold text-slate-800 mt-0.5">{talk.ratings.score3}</div>
              <div className="text-[9px] text-slate-500">{talk.ratingPcts[3].toFixed(0)}%</div>
            </div>

            <div className="p-1 rounded bg-sky-50/60 border border-sky-100/80">
              <div className="text-[10px] text-sky-700 font-sans font-semibold">4 · Útil</div>
              <div className="font-bold text-sky-900 mt-0.5">{talk.ratings.score4}</div>
              <div className="text-[9px] text-sky-600">{talk.ratingPcts[4].toFixed(0)}%</div>
            </div>

            <div className="p-1 rounded bg-emerald-50/60 border border-emerald-100/80">
              <div className="text-[10px] text-emerald-700 font-sans font-semibold">5 · Total</div>
              <div className="font-bold text-emerald-900 mt-0.5">{talk.ratings.score5}</div>
              <div className="text-[9px] text-emerald-600">{talk.ratingPcts[5].toFixed(0)}%</div>
            </div>
          </div>

          {/* Grouped NPS balance: Promotores vs Detratores */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-dashed border-slate-200 pt-1.5">
            <span className="text-emerald-700 font-medium font-mono tabular-nums">
              Promotores (4-5): {talk.promotersPct.toFixed(1)}%
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-rose-700 font-medium font-mono tabular-nums">
              Detratores (1-2): {talk.detractorsPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {onOpenDetail && (
        <button
          onClick={() => onOpenDetail(talk)}
          className="mt-3.5 w-full py-1.5 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Ver Análise Detalhada</span>
        </button>
      )}
    </div>
  );
};

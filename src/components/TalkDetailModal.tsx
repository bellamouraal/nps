import React from 'react';
import { CalculatedCompanyTalk } from '../types/dashboard';
import { formatNps, getNpsColor, RATING_SCALE_CONFIG } from '../utils/npsCalculator';
import { CompanyLogo } from './CompanyLogo';
import { X, Users, FileCheck2, Percent, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface TalkDetailModalProps {
  talk: CalculatedCompanyTalk | null;
  onClose: () => void;
  overallNps: number;
}

export const TalkDetailModal: React.FC<TalkDetailModalProps> = ({
  talk,
  onClose,
  overallNps,
}) => {
  if (!talk) return null;

  const colors = getNpsColor(talk.nps);
  const diffFromOverall = talk.nps - overallNps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <CompanyLogo companyName={talk.companyName} color={talk.logoColor} className="w-12 h-12" />
          <div className="min-w-0 pr-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {talk.companyName}
            </h2>
            {talk.talkTitle && (
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{talk.talkTitle}</p>
            )}
            {talk.speaker && (
              <p className="text-[11px] text-slate-400 mt-0.5">Palestrante: {talk.speaker}</p>
            )}
          </div>
        </div>

        {/* Highlight Summary String */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between font-mono tabular-nums">
          <span className="font-bold text-slate-900">
            NPS {formatNps(talk.nps)}
          </span>
          <span className="text-slate-300">|</span>
          <span>{talk.totalEvaluations} avaliações</span>
          <span className="text-slate-300">|</span>
          <span>{talk.participants} participantes</span>
          <span className="text-slate-300">|</span>
          <span>{talk.responseRate.toFixed(1)}% resposta</span>
        </div>

        {/* NPS Score Card & Comparison */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              NPS do Conteúdo
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${colors.text}`}>
              NPS {formatNps(talk.nps)}
            </div>
            <div className="text-[11px] text-slate-600 mt-1 capitalize font-medium">
              {talk.npsZone === 'excelencia' && 'Zona de Excelência (≥ 75)'}
              {talk.npsZone === 'qualidade' && 'Zona de Qualidade (50–74)'}
              {talk.npsZone === 'aperfeicoamento' && 'Zona de Aperfeiçoamento (0–49)'}
              {talk.npsZone === 'critica' && 'Zona Crítica (< 0)'}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              Vs. Média Geral
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
              {diffFromOverall > 0 ? `+${diffFromOverall}` : `${diffFromOverall}`} pts
            </div>
            <div className="text-[11px] text-slate-500">
              Média geral do evento: {formatNps(overallNps)}
            </div>
          </div>
        </div>

        {/* Detailed Ratings 1 to 5 Breakdown */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-800 mb-2">
            Detalhamento das Avaliações (Escala 1 a 5)
          </h4>

          <div className="space-y-2">
            {([5, 4, 3, 2, 1] as const).map((score) => {
              const count = talk.ratings[`score${score}` as keyof typeof talk.ratings];
              const pct = talk.ratingPcts[score];
              const config = RATING_SCALE_CONFIG[score];
              const isPromoter = score >= 4;
              const isDetractor = score <= 2;

              return (
                <div key={score} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: config.color }} />
                      <span>{config.shortLabel}</span>
                      {isPromoter && (
                        <span className="text-[10px] text-emerald-600 font-semibold">(Promotor)</span>
                      )}
                      {score === 3 && (
                        <span className="text-[10px] text-slate-400 font-medium">(Neutro)</span>
                      )}
                      {isDetractor && (
                        <span className="text-[10px] text-rose-600 font-semibold">(Detrator)</span>
                      )}
                    </span>
                    <span className="font-mono tabular-nums text-slate-600">
                      <strong>{count}</strong> ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promoter vs Detractor Summary */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums">
            <div>
              <div className="text-[11px] font-sans text-emerald-700 font-semibold">Promotores (4-5)</div>
              <div className="text-sm font-bold text-emerald-900 mt-0.5">{talk.promotersCount}</div>
              <div className="text-[10px] text-slate-500">{talk.promotersPct.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[11px] font-sans text-slate-600 font-semibold">Neutros (3)</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">{talk.neutralsCount}</div>
              <div className="text-[10px] text-slate-500">{talk.neutralsPct.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[11px] font-sans text-rose-700 font-semibold">Detratores (1-2)</div>
              <div className="text-sm font-bold text-rose-900 mt-0.5">{talk.detractorsCount}</div>
              <div className="text-[10px] text-slate-500">{talk.detractorsPct.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

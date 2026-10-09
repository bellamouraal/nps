import React from 'react';
import { CalculatedCompanyTalk } from '../types/dashboard';
import { formatNps, getNpsColor } from '../utils/npsCalculator';
import { CompanyLogo } from './CompanyLogo';

interface ExecutiveTableProps {
  talks: CalculatedCompanyTalk[];
  onSelectTalk: (talk: CalculatedCompanyTalk) => void;
}

export const ExecutiveTable: React.FC<ExecutiveTableProps> = ({ talks, onSelectTalk }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Empresa & Talk</th>
              <th className="py-2.5 px-3 text-right">NPS Conteúdo</th>
              <th className="py-2.5 px-3 text-right">Participantes</th>
              <th className="py-2.5 px-3 text-right">Avaliações</th>
              <th className="py-2.5 px-3 text-right">Taxa Resposta</th>
              <th className="py-2.5 px-3 text-center">Distribuição (1 a 5)</th>
              <th className="py-2.5 px-3 text-right">% Promotores</th>
              <th className="py-2.5 px-3 text-right">% Detratores</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {talks.map((talk, idx) => {
              const colors = getNpsColor(talk.nps);

              return (
                <tr
                  key={talk.id}
                  onClick={() => onSelectTalk(talk)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo companyName={talk.companyName} color={talk.logoColor} className="w-6 h-6" />
                      <div>
                        <div className="font-semibold text-slate-900">{talk.companyName}</div>
                        {talk.talkTitle && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">{talk.talkTitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs tabular-nums ${colors.bg} ${colors.text} border ${colors.border}`}>
                      NPS {formatNps(talk.nps)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                    {talk.participants}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {talk.totalEvaluations}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    {talk.responseRate.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="w-28 mx-auto h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div style={{ width: `${talk.ratingPcts[1]}%` }} className="bg-rose-500 h-full" title={`1: ${talk.ratings.score1}`} />
                      <div style={{ width: `${talk.ratingPcts[2]}%` }} className="bg-orange-400 h-full" title={`2: ${talk.ratings.score2}`} />
                      <div style={{ width: `${talk.ratingPcts[3]}%` }} className="bg-slate-400 h-full" title={`3: ${talk.ratings.score3}`} />
                      <div style={{ width: `${talk.ratingPcts[4]}%` }} className="bg-sky-400 h-full" title={`4: ${talk.ratings.score4}`} />
                      <div style={{ width: `${talk.ratingPcts[5]}%` }} className="bg-emerald-500 h-full" title={`5: ${talk.ratings.score5}`} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700 font-medium">
                    {talk.promotersPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-rose-700 font-medium">
                    {talk.detractorsPct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

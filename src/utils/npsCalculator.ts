import { CompanyTalk, CalculatedCompanyTalk, OverallKPIs } from '../types/dashboard';

export function calculateCompanyMetrics(talk: CompanyTalk): CalculatedCompanyTalk {
  const { ratings, participants } = talk;
  const score1 = Math.max(0, ratings.score1 || 0);
  const score2 = Math.max(0, ratings.score2 || 0);
  const score3 = Math.max(0, ratings.score3 || 0);
  const score4 = Math.max(0, ratings.score4 || 0);
  const score5 = Math.max(0, ratings.score5 || 0);

  const totalEvaluations = score1 + score2 + score3 + score4 + score5;

  const detractorsCount = score1 + score2; // notas 1 e 2
  const neutralsCount = score3;           // nota 3
  const promotersCount = score4 + score5;  // notas 4 e 5

  let promotersPct = 0;
  let neutralsPct = 0;
  let detractorsPct = 0;
  let nps = 0;

  if (totalEvaluations > 0) {
    promotersPct = (promotersCount / totalEvaluations) * 100;
    neutralsPct = (neutralsCount / totalEvaluations) * 100;
    detractorsPct = (detractorsCount / totalEvaluations) * 100;
    // NPS = % Promotores - % Detratores (escala -100 a +100, arredondado para inteiro executivo)
    nps = Math.round(promotersPct - detractorsPct);
  }

  const responseRate = participants > 0 ? (totalEvaluations / participants) * 100 : 0;

  const ratingPcts = {
    1: totalEvaluations > 0 ? (score1 / totalEvaluations) * 100 : 0,
    2: totalEvaluations > 0 ? (score2 / totalEvaluations) * 100 : 0,
    3: totalEvaluations > 0 ? (score3 / totalEvaluations) * 100 : 0,
    4: totalEvaluations > 0 ? (score4 / totalEvaluations) * 100 : 0,
    5: totalEvaluations > 0 ? (score5 / totalEvaluations) * 100 : 0,
  };

  let npsZone: CalculatedCompanyTalk['npsZone'] = 'aperfeicoamento';
  if (nps >= 75) {
    npsZone = 'excelencia';
  } else if (nps >= 50) {
    npsZone = 'qualidade';
  } else if (nps >= 0) {
    npsZone = 'aperfeicoamento';
  } else {
    npsZone = 'critica';
  }

  return {
    ...talk,
    totalEvaluations,
    responseRate,
    promotersCount,
    neutralsCount,
    detractorsCount,
    promotersPct,
    neutralsPct,
    detractorsPct,
    nps,
    ratingPcts,
    npsZone,
  };
}

export function calculateOverallKPIs(calculatedTalks: CalculatedCompanyTalk[]): OverallKPIs {
  const totalParticipants = calculatedTalks.reduce((sum, t) => sum + (t.participants || 0), 0);
  const totalEvaluations = calculatedTalks.reduce((sum, t) => sum + t.totalEvaluations, 0);

  const scoreTotals = {
    1: calculatedTalks.reduce((sum, t) => sum + (t.ratings.score1 || 0), 0),
    2: calculatedTalks.reduce((sum, t) => sum + (t.ratings.score2 || 0), 0),
    3: calculatedTalks.reduce((sum, t) => sum + (t.ratings.score3 || 0), 0),
    4: calculatedTalks.reduce((sum, t) => sum + (t.ratings.score4 || 0), 0),
    5: calculatedTalks.reduce((sum, t) => sum + (t.ratings.score5 || 0), 0),
  };

  const totalDetractors = scoreTotals[1] + scoreTotals[2];
  const totalNeutrals = scoreTotals[3];
  const totalPromoters = scoreTotals[4] + scoreTotals[5];

  let overallPromotersPct = 0;
  let overallNeutralsPct = 0;
  let overallDetractorsPct = 0;
  let overallNps = 0;

  if (totalEvaluations > 0) {
    overallPromotersPct = (totalPromoters / totalEvaluations) * 100;
    overallNeutralsPct = (totalNeutrals / totalEvaluations) * 100;
    overallDetractorsPct = (totalDetractors / totalEvaluations) * 100;
    overallNps = Math.round(overallPromotersPct - overallDetractorsPct);
  }

  const overallResponseRate = totalParticipants > 0 ? (totalEvaluations / totalParticipants) * 100 : 0;

  return {
    overallNps,
    totalParticipants,
    totalEvaluations,
    overallResponseRate,
    totalCompanies: calculatedTalks.length,
    overallPromotersPct,
    overallNeutralsPct,
    overallDetractorsPct,
    scoreTotals,
  };
}

export function formatNps(nps: number): string {
  if (nps > 0) {
    return `+${nps}`;
  }
  return `${nps}`;
}

export function getNpsColor(nps: number): {
  text: string;
  bg: string;
  border: string;
  barColor: string;
} {
  if (nps >= 75) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      barColor: '#059669', // emerald-600
    };
  }
  if (nps >= 50) {
    return {
      text: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      barColor: '#0d9488', // teal-600
    };
  }
  if (nps >= 20) {
    return {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      barColor: '#2563eb', // blue-600
    };
  }
  if (nps >= 0) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      barColor: '#d97706', // amber-600
    };
  }
  return {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    barColor: '#e11d48', // rose-600
  };
}

export const RATING_SCALE_CONFIG = {
  1: { label: 'Totalmente inútil', shortLabel: '1 - Totalmente inútil', color: '#e11d48', bgClass: 'bg-rose-500' },
  2: { label: 'Pouco útil', shortLabel: '2 - Pouco útil', color: '#fb923c', bgClass: 'bg-orange-400' },
  3: { label: 'Indiferente', shortLabel: '3 - Indiferente', color: '#94a3b8', bgClass: 'bg-slate-400' },
  4: { label: 'Útil', shortLabel: '4 - Útil', color: '#38bdf8', bgClass: 'bg-sky-400' },
  5: { label: 'Totalmente útil', shortLabel: '5 - Totalmente útil', color: '#10b981', bgClass: 'bg-emerald-500' },
} as const;

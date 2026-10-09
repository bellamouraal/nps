export interface RatingDistribution {
  score1: number; // 1 — Totalmente inútil
  score2: number; // 2 — Pouco útil
  score3: number; // 3 — Indiferente
  score4: number; // 4 — Útil
  score5: number; // 5 — Totalmente útil
}

export interface CompanyTalk {
  id: string;
  companyName: string;
  talkTitle?: string;
  speaker?: string;
  logoUrl?: string; // Optional image URL or SVG identifier
  logoColor?: string; // Accent color for branding / fallback monogram
  participants: number; // Nº total de participantes presentes no talk
  ratings: RatingDistribution; // Contagem de respostas por nota 1 a 5
}

export interface CalculatedCompanyTalk extends CompanyTalk {
  totalEvaluations: number; // Nº total de avaliações válidas
  responseRate: number; // (totalEvaluations / participants) * 100
  promotersCount: number; // notas 4 e 5
  neutralsCount: number; // nota 3
  detractorsCount: number; // notas 1 e 2
  promotersPct: number; // % sobre avaliações válidas
  neutralsPct: number;
  detractorsPct: number;
  nps: number; // % Promotores - % Detratores (escala -100 a +100)
  ratingPcts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  npsZone: 'excelencia' | 'qualidade' | 'aperfeicoamento' | 'critica';
}

export interface OverallKPIs {
  overallNps: number;
  totalParticipants: number;
  totalEvaluations: number;
  overallResponseRate: number;
  totalCompanies: number;
  overallPromotersPct: number;
  overallNeutralsPct: number;
  overallDetractorsPct: number;
  scoreTotals: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export type SortOption = 'nps-desc' | 'nps-asc' | 'evaluations-desc' | 'participants-desc' | 'responseRate-desc' | 'name-asc';
export type FilterZone = 'all' | 'excelencia' | 'qualidade' | 'aperfeicoamento' | 'critica';

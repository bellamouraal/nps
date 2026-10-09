import * as XLSX from 'xlsx';
import { CompanyTalk, CalculatedCompanyTalk } from '../types/dashboard';

/**
 * Parses a numeric evaluation score from raw cell value (e.g. "5", 5, "5 — Totalmente útil", "Totalmente útil")
 */
function normalizeScore(val: unknown): 1 | 2 | 3 | 4 | 5 | null {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim().toLowerCase();

  if (str.startsWith('1') || str.includes('totalmente inútil') || str.includes('inutil')) return 1;
  if (str.startsWith('2') || str.includes('pouco útil') || str.includes('pouco')) return 2;
  if (str.startsWith('3') || str.includes('indiferente') || str.includes('neutro')) return 3;
  if (str.startsWith('4') || str.includes('totalmente útil') === false && (str.startsWith('4') || str.includes('útil') || str.includes('util'))) return 4;
  if (str.startsWith('5') || str.includes('totalmente útil') || str.includes('excelente')) return 5;

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 5) {
    return Math.round(num) as 1 | 2 | 3 | 4 | 5;
  }
  return null;
}

export function parseExcelWorkbook(data: ArrayBuffer): CompanyTalk[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('A planilha está vazia ou não possui linhas válidas.');
  }

  // Detect format:
  // Check if columns look like Aggregated Summary or Raw Feedback Rows
  const sampleRow = rawRows[0];
  const keys = Object.keys(sampleRow).map(k => k.trim().toLowerCase());

  const hasScore1Col = keys.some(k => k.includes('nota 1') || k === '1' || k.includes('score 1') || k.includes('totalmente inútil'));
  const hasScore5Col = keys.some(k => k.includes('nota 5') || k === '5' || k.includes('score 5') || k.includes('totalmente útil'));

  if (hasScore1Col && hasScore5Col) {
    // FORMAT A: Aggregated Summary by Company
    return parseAggregatedFormat(rawRows);
  } else {
    // FORMAT B: Raw responses (one row per response) or fallback
    return parseRawResponsesFormat(rawRows);
  }
}

function parseAggregatedFormat(rows: Record<string, unknown>[]): CompanyTalk[] {
  const result: CompanyTalk[] = [];

  rows.forEach((row, index) => {
    // Find company name key
    let companyName = '';
    let talkTitle = '';
    let participants = 0;
    const scores = { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 };

    for (const [rawKey, rawVal] of Object.entries(row)) {
      const key = rawKey.trim().toLowerCase();
      const valStr = String(rawVal).trim();

      if (key.includes('empresa') || key.includes('company') || key.includes('organização') || key === 'nome') {
        companyName = valStr;
      } else if (key.includes('talk') || key.includes('tema') || key.includes('titulo') || key.includes('título')) {
        talkTitle = valStr;
      } else if (key.includes('participante') || key.includes('presenca') || key.includes('presença') || key.includes('presentes') || key.includes('publico')) {
        const num = Number(rawVal);
        if (!isNaN(num)) participants = num;
      } else if (key.includes('nota 1') || key === '1' || key.includes('totalmente inútil') || key.includes('detrator 1')) {
        scores.score1 = Number(rawVal) || 0;
      } else if (key.includes('nota 2') || key === '2' || key.includes('pouco útil') || key.includes('detrator 2')) {
        scores.score2 = Number(rawVal) || 0;
      } else if (key.includes('nota 3') || key === '3' || key.includes('indiferente') || key.includes('neutro')) {
        scores.score3 = Number(rawVal) || 0;
      } else if (key.includes('nota 4') || key === '4' || key.includes('útil') || key.includes('promotor 4')) {
        scores.score4 = Number(rawVal) || 0;
      } else if (key.includes('nota 5') || key === '5' || key.includes('totalmente útil') || key.includes('promotor 5')) {
        scores.score5 = Number(rawVal) || 0;
      }
    }

    if (!companyName) {
      companyName = `Empresa ${index + 1}`;
    }

    const totalRatings = scores.score1 + scores.score2 + scores.score3 + scores.score4 + scores.score5;
    if (participants <= 0) {
      participants = totalRatings > 0 ? Math.round(totalRatings * 1.3) : 100;
    }

    result.push({
      id: `talk-custom-${index}-${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      companyName,
      talkTitle: talkTitle || `Talk ${companyName}`,
      participants,
      ratings: scores,
    });
  });

  return result;
}

function parseRawResponsesFormat(rows: Record<string, unknown>[]): CompanyTalk[] {
  // Map company -> { participants, scores }
  const companyMap = new Map<string, {
    talkTitle: string;
    participants: number;
    ratings: { score1: number; score2: number; score3: number; score4: number; score5: number };
  }>();

  rows.forEach((row) => {
    let companyName = '';
    let talkTitle = '';
    let rowParticipants = 0;
    let scoreVal: unknown = null;

    for (const [rawKey, rawVal] of Object.entries(row)) {
      const key = rawKey.trim().toLowerCase();
      if (key.includes('empresa') || key.includes('company') || key.includes('organização')) {
        companyName = String(rawVal).trim();
      } else if (key.includes('talk') || key.includes('tema') || key.includes('titulo') || key.includes('título')) {
        talkTitle = String(rawVal).trim();
      } else if (key.includes('participante') || key.includes('presenca') || key.includes('presença')) {
        const p = Number(rawVal);
        if (!isNaN(p) && p > 0) rowParticipants = p;
      } else if (key.includes('nota') || key.includes('avaliacao') || key.includes('avaliação') || key.includes('conteudo') || key.includes('conteúdo') || key.includes('score') || key.includes('resposta')) {
        scoreVal = rawVal;
      }
    }

    if (!companyName) return;

    if (!companyMap.has(companyName)) {
      companyMap.set(companyName, {
        talkTitle: talkTitle || `Talk ${companyName}`,
        participants: rowParticipants || 0,
        ratings: { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 },
      });
    }

    const entry = companyMap.get(companyName)!;
    if (rowParticipants > entry.participants) {
      entry.participants = rowParticipants;
    }
    if (talkTitle && !entry.talkTitle) {
      entry.talkTitle = talkTitle;
    }

    const validScore = normalizeScore(scoreVal);
    if (validScore) {
      entry.ratings[`score${validScore}` as keyof typeof entry.ratings]++;
    }
  });

  const result: CompanyTalk[] = [];
  let idx = 0;
  for (const [companyName, data] of companyMap.entries()) {
    idx++;
    const totalResp = data.ratings.score1 + data.ratings.score2 + data.ratings.score3 + data.ratings.score4 + data.ratings.score5;
    result.push({
      id: `talk-imported-${idx}`,
      companyName,
      talkTitle: data.talkTitle,
      participants: data.participants > 0 ? data.participants : Math.max(totalResp, 50),
      ratings: data.ratings,
    });
  }

  if (result.length === 0) {
    throw new Error('Não foram encontradas colunas de "Empresa" ou "Avaliação" válidas na planilha.');
  }

  return result;
}

export function exportTalksToExcel(talks: CalculatedCompanyTalk[]) {
  const rows = talks.map((t, idx) => ({
    'Posição': idx + 1,
    'Empresa': t.companyName,
    'Tema do Talk': t.talkTitle || '-',
    'NPS': t.nps > 0 ? `+${t.nps}` : `${t.nps}`,
    'Participantes': t.participants,
    'Avaliações Válidas': t.totalEvaluations,
    'Taxa de Resposta (%)': `${t.responseRate.toFixed(1)}%`,
    '% Promotores (Notas 4-5)': `${t.promotersPct.toFixed(1)}%`,
    '% Neutros (Nota 3)': `${t.neutralsPct.toFixed(1)}%`,
    '% Detratores (Notas 1-2)': `${t.detractorsPct.toFixed(1)}%`,
    '1 - Totalmente Inútil': t.ratings.score1,
    '2 - Pouco Útil': t.ratings.score2,
    '3 - Indiferente': t.ratings.score3,
    '4 - Útil': t.ratings.score4,
    '5 - Totalmente Útil': t.ratings.score5,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Avaliação Talks');
  XLSX.writeFile(workbook, 'Avaliacao_Talks_Dashboard_Executivo.xlsx');
}

export function downloadSampleTemplate() {
  const sampleData = [
    {
      'Empresa': 'Exemplo Tech Alpha',
      'Tema do Talk': 'Inovação e Inteligência Artificial Aplicada',
      'Participantes': 150,
      '1 - Totalmente inútil': 2,
      '2 - Pouco útil': 4,
      '3 - Indiferente': 12,
      '4 - Útil': 40,
      '5 - Totalmente útil': 62,
    },
    {
      'Empresa': 'Exemplo FinBeta',
      'Tema do Talk': 'Segurança Cibernética e Resiliência Financeira',
      'Participantes': 180,
      '1 - Totalmente inútil': 5,
      '2 - Pouco útil': 8,
      '3 - Indiferente': 15,
      '4 - Útil': 45,
      '5 - Totalmente útil': 47,
    },
    {
      'Empresa': 'Exemplo Log Gamma',
      'Tema do Talk': 'Otimização de Malhas e Automação',
      'Participantes': 120,
      '1 - Totalmente inútil': 6,
      '2 - Pouco útil': 9,
      '3 - Indiferente': 14,
      '4 - Útil': 25,
      '5 - Totalmente útil': 26,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Avaliação Talks');
  XLSX.writeFile(workbook, 'Modelo_Avaliacao_Talks.xlsx');
}

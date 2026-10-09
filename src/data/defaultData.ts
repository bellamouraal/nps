import { CompanyTalk } from '../types/dashboard';

export const INITIAL_TALKS_DATA: CompanyTalk[] = [
  {
    id: 'talk-nubank',
    companyName: 'Nubank',
    talkTitle: 'Arquitetura de Microsserviços e Engenharia de Alta Escala',
    speaker: 'Camila Rocha (VP of Engineering)',
    logoColor: '#820ad1',
    participants: 160,
    ratings: {
      score1: 2,  // Detrator
      score2: 3,  // Detrator (Total Detratores = 5, 4.1%)
      score3: 9,  // Neutro (7.4%)
      score4: 31, // Promotor
      score5: 75, // Promotor (Total Promotores = 106, 86.9%)
    }, // Total avaliações = 120 -> NPS = 87 - 4 = +83 | 120 avaliações | 160 participantes
  },
  {
    id: 'talk-mercadolivre',
    companyName: 'Mercado Livre',
    talkTitle: 'Logística Conectada e Inteligência de Roteamento em Tempo Real',
    speaker: 'Lucas Mendes (Director of Logistics Tech)',
    logoColor: '#ffe600',
    participants: 145,
    ratings: {
      score1: 2,
      score2: 4,  // Detratores: 6 (6.1%)
      score3: 11, // Neutro: 11 (11.2%)
      score4: 33,
      score5: 48, // Promotores: 81 (82.7%)
    }, // Total avaliações = 98 -> NPS = 83 - 6 = +77 | 98 avaliações | 145 participantes
  },
  {
    id: 'talk-itau',
    companyName: 'Itaú Unibanco',
    talkTitle: 'Modernização de Core Banking e Governança em Nuvem',
    speaker: 'Mariana Duarte (Head de Cloud & Plataformas)',
    logoColor: '#ec7000',
    participants: 180,
    ratings: {
      score1: 4,
      score2: 7,  // Detratores: 11 (9.6%)
      score3: 16, // Neutro: 16 (13.9%)
      score4: 42,
      score5: 46, // Promotores: 88 (76.5%)
    }, // Total avaliações = 115 -> NPS = 77 - 10 = +67 | 115 avaliações | 180 participantes
  },
  {
    id: 'talk-ifood',
    companyName: 'iFood',
    talkTitle: 'Modelos Preditivos de Demanda e Despacho Automatizado',
    speaker: 'Gabriel Silveira (Lead AI Scientist)',
    logoColor: '#ea1d2c',
    participants: 130,
    ratings: {
      score1: 3,
      score2: 6,  // Detratores: 9 (10.6%)
      score3: 15, // Neutro: 15 (17.6%)
      score4: 28,
      score5: 33, // Promotores: 61 (71.8%)
    }, // Total avaliações = 85 -> NPS = 72 - 11 = +61 | 85 avaliações | 130 participantes
  },
  {
    id: 'talk-stone',
    companyName: 'Stone',
    talkTitle: 'Resiliência Transacional e Observabilidade Zero-Downtime',
    speaker: 'Renata Albuquerque (Principal Architect)',
    logoColor: '#00a868',
    participants: 110,
    ratings: {
      score1: 3,
      score2: 7,  // Detratores: 10 (13.9%)
      score3: 14, // Neutro: 14 (19.4%)
      score4: 24,
      score5: 24, // Promotores: 48 (66.7%)
    }, // Total avaliações = 72 -> NPS = 67 - 14 = +53 | 72 avaliações | 110 participantes
  },
  {
    id: 'talk-aws',
    companyName: 'AWS Brasil',
    talkTitle: 'Estratégias Avançadas de Otimização e Eficiência FinOps',
    speaker: 'Fernando Paiva (Enterprise Solutions Architect)',
    logoColor: '#232f3e',
    participants: 150,
    ratings: {
      score1: 5,
      score2: 9,  // Detratores: 14 (15.9%)
      score3: 18, // Neutro: 18 (20.5%)
      score4: 29,
      score5: 27, // Promotores: 56 (63.6%)
    }, // Total avaliações = 88 -> NPS = 64 - 16 = +48 | 88 avaliações | 150 participantes
  },
  {
    id: 'talk-totvs',
    companyName: 'TOTVS',
    talkTitle: 'Transformação de Sistemas Corporativos e Integração com APIs',
    speaker: 'Marcelo Castro (Diretor de P&D)',
    logoColor: '#005ca9',
    participants: 125,
    ratings: {
      score1: 8,
      score2: 12, // Detratores: 20 (31.3%)
      score3: 16, // Neutro: 16 (25.0%)
      score4: 17,
      score5: 11, // Promotores: 28 (43.8%)
    }, // Total avaliações = 64 -> NPS = 44 - 31 = +13 | 64 avaliações | 125 participantes
  },
  {
    id: 'talk-ambevtech',
    companyName: 'Ambev Tech',
    talkTitle: 'Ecossistema B2B e Automação da Cadeia de Suprimentos',
    speaker: 'Juliana Pires (Head de Engenharia de Dados)',
    logoColor: '#f1a80a',
    participants: 95,
    ratings: {
      score1: 7,
      score2: 11, // Detratores: 18 (33.3%)
      score3: 14, // Neutro: 14 (25.9%)
      score4: 12,
      score5: 10, // Promotores: 22 (40.7%)
    }, // Total avaliações = 54 -> NPS = 41 - 33 = +8 | 54 avaliações | 95 participantes
  },
];

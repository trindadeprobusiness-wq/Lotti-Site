import {
  Building2,
  Crown,
  Rocket,
  Users,
  QrCode,
  Banknote,
  FileSignature,
  BarChart3,
  Headphones,
} from 'lucide-react';

export const pricingCopy = {
  title: 'Tudo o que sua operação imobiliária precisa em um só lugar',
  subtitle: 'Organize clientes, imóveis, contratos, finanças, aluguéis e oportunidades em uma plataforma criada para o mercado imobiliário.',
  trialBadge: 'Teste grátis por 14 dias sem cartão de crédito',
  annualSaveBadge: 'Economize 2 meses',
  founderBadge: 'Preço especial de lançamento',
  highlightBadge: 'MAIS ESCOLHIDO',
  addonsTitle: 'Precisa de mais? Contrate adicionais.',
  addonsSubtitle: 'Expanda seu plano conforme a operação cresce.',
  faqTitle: 'Perguntas frequentes',
  ctaFinal: {
    title: 'Pronto para parar de operar e começar a gerir?',
    subtitle: 'Comece com 14 dias grátis. Sem cartão, sem compromisso.',
    cta: 'Começar teste gratuito',
  },
} as const;

export const plansData = [
  {
    code: 'essencial',
    name: 'Lotti Essencial',
    icon: Rocket,
    audience: 'Corretor autônomo',
    monthlyPrice: 99,
    annualPrice: 990,
    highlighted: false,
    cta: 'Começar teste gratuito',
    features: [
      'Até 5 imóveis ativos',
      'Até 5 contratos de aluguel ativos',
      '5 Fachadas Inteligentes',
      '10 gerações ou análises de contrato com IA por mês',
      'CRM, clientes, funil e lançamentos financeiros sem limite',
      'Integração com Asaas',
      'Financeiro básico',
      'Suporte por e-mail',
    ],
  },
  {
    code: 'profissional',
    name: 'Lotti Profissional',
    icon: Crown,
    audience: 'Corretores e pequenas equipes',
    monthlyPrice: 149,
    annualPrice: 1490,
    highlighted: true,
    cta: 'Começar teste gratuito',
    features: [
      'Até 20 imóveis ativos',
      'Até 15 contratos de aluguel ativos',
      '20 Fachadas Inteligentes',
      '20 gerações ou análises de contrato com IA por mês',
      'CRM, clientes, funil e lançamentos financeiros sem limite',
      'Financeiro completo',
      'Gestão de aluguéis',
      'Integração com Asaas',
      'Relatórios e automações',
      'Suporte prioritário',
    ],
  },
  {
    code: 'imobiliaria',
    name: 'Lotti Imobiliária',
    icon: Building2,
    audience: 'Imobiliárias com equipe',
    monthlyPrice: 299,
    annualPrice: 2990,
    highlighted: false,
    cta: 'Começar teste gratuito',
    secondaryCta: 'Falar com especialista',
    features: [
      'Até 100 imóveis ativos',
      'Até 100 contratos de aluguel ativos',
      '100 Fachadas Inteligentes',
      '60 gerações ou análises de contrato com IA por mês',
      'CRM, clientes, funil e lançamentos financeiros sem limite',
      'Onboarding orientado',
      'Suporte prioritário',
    ],
  },
];

export const comparisonCategories = [
  { key: 'crm', label: 'CRM e clientes', icon: Users },
  { key: 'imoveis', label: 'Imóveis e proprietários', icon: Building2 },
  { key: 'fachadas', label: 'Fachadas Inteligentes', icon: QrCode },
  { key: 'contratos', label: 'Contratos e documentos', icon: FileSignature },
  { key: 'financeiro', label: 'Financeiro', icon: Banknote },
  { key: 'alugueis', label: 'Gestão de aluguéis', icon: Banknote },
  { key: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { key: 'suporte', label: 'Suporte', icon: Headphones },
];

export const comparisonFeatures = [
  // Imoveis
  { category: 'imoveis', label: 'Imóveis ativos', essencial: '5', profissional: '20', imobiliaria: '100' },
  
  // Fachadas
  { category: 'fachadas', label: 'Fachadas Inteligentes ativas', essencial: '5', profissional: '20', imobiliaria: '100' },
  
  // Contratos
  { category: 'contratos', label: 'Contratos de aluguel ativos', essencial: '5', profissional: '15', imobiliaria: '100' },
  { category: 'contratos', label: 'Gerações ou análises com IA', essencial: '10/mês', profissional: '20/mês', imobiliaria: '60/mês' },
  
  // Alugueis
  { category: 'alugueis', label: 'Gestão de aluguéis', essencial: false, profissional: true, imobiliaria: true },
  { category: 'alugueis', label: 'Integração Asaas (cobranças)', essencial: true, profissional: true, imobiliaria: true },
  
  // CRM
  { category: 'crm', label: 'CRM, clientes e funil', essencial: 'Sem limite', profissional: 'Sem limite', imobiliaria: 'Sem limite' },
  
  // Financeiro
  { category: 'financeiro', label: 'Financeiro básico', essencial: true, profissional: true, imobiliaria: true },
  { category: 'financeiro', label: 'Lançamentos financeiros', essencial: 'Sem limite', profissional: 'Sem limite', imobiliaria: 'Sem limite' },
  { category: 'financeiro', label: 'Financeiro completo', essencial: false, profissional: true, imobiliaria: true },
  
  // Relatorios
  { category: 'relatorios', label: 'Relatórios e automações', essencial: false, profissional: true, imobiliaria: true },
  
  // Suporte
  { category: 'suporte', label: 'Suporte', essencial: 'Por e-mail', profissional: 'Prioritário', imobiliaria: 'Prioritário' },
  { category: 'suporte', label: 'Onboarding orientado', essencial: false, profissional: false, imobiliaria: true },
];

export const pricingFAQ = [
  { question: 'Preciso de cartão de crédito para testar?', answer: 'Não. O teste gratuito de 14 dias não pede cartão. Você escolhe o plano só quando decidir continuar.' },
  { question: 'O que acontece quando o teste termina?', answer: 'Seus dados ficam seguros em modo somente leitura por 7 dias. Nada é apagado. Basta escolher um plano para continuar usando.' },
  { question: 'Posso trocar de plano depois?', answer: 'Sim. Upgrade é imediato, os novos limites são liberados na hora. Downgrade vale a partir do próximo ciclo.' },
  { question: 'O plano anual tem desconto?', answer: 'Sim. São dois meses gratuitos: você paga 10 meses pelo preço de 12. Cerca de 16,7% de economia.' },
  { question: 'Os dados são meus?', answer: 'Totalmente. Seus clientes, imóveis, contratos e finanças pertencem a você. Oferecemos exportação a qualquer momento.' },
  { question: 'Como funciona a cobrança dos boletos pelo Asaas?', answer: 'A Lotti organiza as faturas e repasses. O processamento financeiro passa pelo Asaas, que é uma instituição regulada. As tarifas de boleto, Pix e cartão são as do próprio Asaas, não adicionamos margem escondida.' },
  { question: 'Qual é o preço de fundador?', answer: 'Os 100 primeiros clientes ganham até 20% de desconto por 12 meses. Depois disso, o valor passa para o preço oficial e avisamos com 30 dias de antecedência.' },
];

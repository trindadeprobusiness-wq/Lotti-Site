import {
  Building2,
  Crown,
  Rocket,
  Users,
  QrCode,
  Sparkles,
  MessageSquareText,
  HardDrive,
  Banknote,
  FileSignature,
  BarChart3,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

export const pricingCopy = {
  title: 'Tudo o que sua operação imobiliária precisa em um só lugar',
  subtitle: 'Organize clientes, imóveis, contratos, finanças, aluguéis e oportunidades em uma plataforma criada para o mercado imobiliário.',
  trialBadge: 'Teste grátis por 14 dias — sem cartão de crédito',
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
      'Dashboard principal',
      'Cadastro de clientes e imóveis',
      'Funil de vendas Kanban',
      'Tarefas, lembretes e follow-ups',
      'Controle financeiro básico',
      'Mensagens personalizadas para WhatsApp',
      '10 contratos com IA / mês',
      '5 Fachadas Inteligentes',
      'Landing pages dos imóveis',
      'Tema claro e escuro',
      'Suporte padrão',
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
      'Tudo do Essencial, mais:',
      'Até 2 usuários',
      'Controle financeiro completo',
      'Gestão de comissões e projeção anual',
      'Gestão completa de aluguéis',
      'Integração com Asaas',
      '60 contratos com IA / mês',
      'Análise de contratos existentes',
      'Exportação PDF e DOCX',
      'Assistente de IA integrado ao CRM',
      '25 Fachadas Inteligentes',
      'Métricas detalhadas de Fachadas',
      'Relatórios comerciais e financeiros',
      'Automações e alertas',
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
      'Tudo do Profissional, mais:',
      'Até 10 usuários',
      'Imóveis ilimitados',
      'Gestão completa de equipe',
      'Perfis e permissões (admin, gestor, corretor)',
      'Distribuição de leads',
      'Indicadores por corretor e ranking',
      '250 contratos com IA / mês',
      '100 Fachadas Inteligentes',
      'Relatórios avançados com exportação',
      'Histórico de auditoria',
      'Atendimento prioritário',
      'Onboarding orientado',
    ],
  },
];

export const comparisonCategories = [
  { key: 'crm', label: 'CRM e clientes', icon: Users },
  { key: 'imoveis', label: 'Imóveis e proprietários', icon: Building2 },
  { key: 'fachadas', label: 'Fachadas Inteligentes', icon: QrCode },
  { key: 'contratos', label: 'Contratos e documentos', icon: FileSignature },
  { key: 'ia', label: 'Inteligência artificial', icon: Sparkles },
  { key: 'financeiro', label: 'Financeiro', icon: Banknote },
  { key: 'alugueis', label: 'Gestão de aluguéis', icon: Banknote },
  { key: 'equipe', label: 'Equipe e permissões', icon: Users },
  { key: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { key: 'midias', label: 'Mídias', icon: HardDrive },
  { key: 'suporte', label: 'Suporte', icon: Headphones },
];

export const comparisonFeatures = [
  // Equipe
  { category: 'equipe', label: 'Usuários incluídos', essencial: '1', profissional: '2', imobiliaria: '10' },
  { category: 'equipe', label: 'Gestão de equipe e permissões', essencial: false, profissional: false, imobiliaria: true },
  { category: 'equipe', label: 'Indicadores por corretor', essencial: false, profissional: false, imobiliaria: true },
  
  // Imoveis
  { category: 'imoveis', label: 'Imóveis ativos', essencial: '100', profissional: '500', imobiliaria: 'Ilimitado' },
  
  // Fachadas
  { category: 'fachadas', label: 'Fachadas Inteligentes ativas', essencial: '5', profissional: '25', imobiliaria: '100' },
  { category: 'fachadas', label: 'Métricas detalhadas', essencial: false, profissional: true, imobiliaria: true },
  
  // Contratos
  { category: 'contratos', label: 'Geração de contratos com IA', essencial: '10/mês', profissional: '60/mês', imobiliaria: '250/mês' },
  { category: 'contratos', label: 'Análise de PDFs com IA', essencial: false, profissional: true, imobiliaria: true },
  { category: 'contratos', label: 'Exportação PDF/DOCX', essencial: false, profissional: true, imobiliaria: true },
  
  // Alugueis
  { category: 'alugueis', label: 'Gestão completa de aluguéis', essencial: false, profissional: true, imobiliaria: true },
  { category: 'alugueis', label: 'Integração Asaas (cobranças)', essencial: false, profissional: true, imobiliaria: true },
  
  // IA
  { category: 'ia', label: 'Interações com Assistente', essencial: '30/mês', profissional: '300/mês', imobiliaria: '1.500/mês' },
  
  // CRM
  { category: 'crm', label: 'Funil e Follow-ups', essencial: true, profissional: true, imobiliaria: true },
  { category: 'crm', label: 'Automações e alertas inteligentes', essencial: false, profissional: true, imobiliaria: true },
  
  // Financeiro
  { category: 'financeiro', label: 'Financeiro básico', essencial: true, profissional: true, imobiliaria: true },
  { category: 'financeiro', label: 'Financeiro completo (comissões)', essencial: false, profissional: true, imobiliaria: true },
  
  // Relatorios
  { category: 'relatorios', label: 'Relatórios avançados', essencial: false, profissional: true, imobiliaria: true },
  
  // Midias
  { category: 'midias', label: 'Armazenamento de mídias', essencial: '5 GB', profissional: '25 GB', imobiliaria: '100 GB' },
  
  // Suporte
  { category: 'suporte', label: 'Suporte', essencial: 'Padrão', profissional: 'Prioritário', imobiliaria: 'Prioritário' },
  { category: 'suporte', label: 'Onboarding orientado', essencial: false, profissional: false, imobiliaria: true },
];

export const pricingFAQ = [
  { question: 'Preciso de cartão de crédito para testar?', answer: 'Não. O teste gratuito de 14 dias não pede cartão. Você escolhe o plano só quando decidir continuar.' },
  { question: 'O que acontece quando o teste termina?', answer: 'Seus dados ficam seguros em modo somente leitura por 7 dias. Nada é apagado. Basta escolher um plano para continuar usando.' },
  { question: 'Posso trocar de plano depois?', answer: 'Sim. Upgrade é imediato — os novos limites são liberados na hora. Downgrade vale a partir do próximo ciclo.' },
  { question: 'O plano anual tem desconto?', answer: 'Sim. São dois meses gratuitos: você paga 10 meses pelo preço de 12. Cerca de 16,7% de economia.' },
  { question: 'Os dados são meus?', answer: 'Totalmente. Seus clientes, imóveis, contratos e finanças pertencem a você. Oferecemos exportação a qualquer momento.' },
  { question: 'Como funciona a cobrança dos boletos pelo Asaas?', answer: 'A Lotti organiza as faturas e repasses. O processamento financeiro passa pelo Asaas, que é uma instituição regulada. As tarifas de boleto, Pix e cartão são as do próprio Asaas — não adicionamos margem escondida.' },
  { question: 'Qual é o preço de fundador?', answer: 'Os 100 primeiros clientes ganham até 20% de desconto por 12 meses. Depois disso, o valor passa para o preço oficial — avisamos com 30 dias de antecedência.' },
];

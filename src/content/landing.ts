import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarClock,
  FileSignature,
  FileStack,
  Gavel,
  Images,
  KanbanSquare,
  Landmark,
  type LucideIcon,
  MessageSquareText,
  QrCode,
  Receipt,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * Toda a copy da página, em pt-BR e tipada.
 * Edite aqui — os componentes não guardam texto.
 */

export const nav = [
  { label: "Recursos", href: "/#recursos" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Diferenciais", href: "/#diferenciais" },
  { label: "Planos e Preços", href: "/#planos" },
] as const;

export const hero = {
  eyebrow: "CRM imobiliário com IA",
  headline: ["Pare de operar.", "Comece a gerir."],
  lead: "A Lotti reúne captação, funil de vendas, contratos por IA e aluguéis com financeiro automático no mesmo lugar. A capacidade operacional de uma grande administradora, no tamanho do seu negócio.",
  primaryCta: "Agendar demonstração",
  secondaryCta: "Ver recursos",
  footnote: "Demonstração guiada, sem compromisso.",
} as const;

export const problem = {
  eyebrow: "Problema → Solução",
  title: "O problema nunca foi falta de esforço. É a operação manual.",
  lead: "Quatro pontos onde o dia do corretor vaza. A Lotti fecha os quatro.",
  columns: { before: "Como é hoje", after: "Com a Lotti" },
  rows: [
    {
      before: "A placa na fachada gera ligação que ninguém registra. A captação evapora.",
      after: "Cada leitura do QR Code vira lead no funil, com nome, telefone, origem e horário.",
    },
    {
      before: "Cliente e follow-up moram na memória, no bloco de notas e na conversa perdida.",
      after: "Funil visual com etapa, valor em negociação, histórico e retorno agendado com alerta.",
    },
    {
      before: "O contrato leva dias, depende de modelo antigo e volta com correção.",
      after: "A IA redige o contrato completo em minutos ou lê o que já existe e extrai os dados.",
    },
    {
      before: "Cobrança, baixa e repasse feitos na mão, um a um, sujeitos a erro.",
      after: "Fatura mensal automática, baixa via Asaas e repasse calculado, com trilha de auditoria.",
    },
  ],
} as const;

export type Feature = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  points?: readonly string[];
};

export const features = {
  eyebrow: "Recursos",
  title: "Seis módulos que conversam entre si.",
  lead: "Nada de sistema para captar, planilha para o funil e outro para o financeiro. Um dado entra uma vez e vale para tudo.",
  primary: [
    {
      icon: KanbanSquare,
      label: "Funil de vendas",
      title: "O negócio inteiro numa tela, arrastando de etapa.",
      description:
        "Kanban de arrastar e soltar com o valor em negociação somado por etapa. Cada cliente carrega o histórico e os follow-ups agendados disparam alerta. O retorno deixa de depender de você lembrar.",
      points: [
        "Valor em negociação por etapa",
        "Histórico completo por cliente",
        "Follow-up agendado com alerta",
      ],
    },
    {
      icon: QrCode,
      label: "Fachadas Inteligentes",
      title: "A placa na rua vira lead no funil, sozinha.",
      description:
        "Gere a placa ou o banner com QR Code em formatos prontos para impressão. Quem passa na frente do imóvel escaneia, encontra uma página profissional, deixa nome e telefone e entra no funil automaticamente.",
      points: [
        "Formatos prontos para impressão",
        "Página do imóvel com captura de contato",
        "Escaneamentos, leads e conversão medidos",
        "Alerta de lead quente",
      ],
    },
  ] as const satisfies readonly Feature[],
  secondary: [
    {
      icon: FileSignature,
      label: "Contratos por IA",
      title: "Duas vias: a IA escreve e a IA lê.",
      description:
        "Gere contratos completos em minutos a partir dos dados do CRM. Ou envie um PDF ou uma foto de contrato que já existe e a IA extrai inquilino, proprietário, imóvel, valor, prazo e taxa.",
    },
    {
      icon: Banknote,
      label: "Aluguéis",
      title: "Financeiro que roda sem você digitar.",
      description:
        "Faturas mensais geradas automaticamente, baixa de boleto e PIX pelo Asaas, cálculo do repasse ao proprietário, proteção contra repasse duplicado e trilha de auditoria de cada operação.",
    },
    {
      icon: MessageSquareText,
      label: "Assistente de IA",
      title: "Um chat que conhece os seus números.",
      description:
        "Pergunte sobre clientes, imóveis, contratos e finanças e receba a resposta com base nos dados reais do seu CRM. O assistente sugere a próxima ação e toda ação passa pela sua confirmação.",
    },
    {
      icon: FileStack,
      label: "Módulos de apoio",
      title: "O resto da operação, no mesmo lugar.",
      description:
        "Imóveis com fotos e vídeos, Financeiro com KPIs e gráficos, Jurídico com documentos e vencimentos, e Mídias com melhoria de fotos por IA.",
    },
  ] as const satisfies readonly Feature[],
  supportModules: [
    { icon: Building2, label: "Imóveis" },
    { icon: Receipt, label: "Financeiro" },
    { icon: Gavel, label: "Jurídico" },
    { icon: Images, label: "Mídias" },
  ],
} as const;

export const differentiators = {
  eyebrow: "Diferenciais",
  title: "Por que a Lotti e não mais um CRM.",
  items: [
    {
      icon: Sparkles,
      title: "IA que trabalha, não que enfeita.",
      description:
        "A IA da Lotti redige contrato, lê documento antigo e consulta os seus números. Não é um chat solto no canto da tela para dizer que tem IA.",
    },
    {
      icon: ScanLine,
      title: "A única ponte entre a placa e o CRM.",
      description:
        "O imóvel na rua e o funil no computador viram a mesma coisa. O lead que nasce na calçada chega registrado, com origem e horário.",
    },
    {
      icon: ShieldCheck,
      title: "Financeiro autônomo com auditoria imutável.",
      description:
        "Fatura, baixa e repasse ficam registrados e conferíveis depois. Repasse duplicado é bloqueado pelo sistema, não pela sua atenção.",
    },
    {
      icon: BadgeCheck,
      title: "O tripé que o nicho não entrega junto.",
      description:
        "Contrato por IA, financeiro de aluguéis autônomo e inteligência de inadimplência. Separados, existem. No mesmo lugar, é a Lotti.",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Quatro passos até parar de digitar.",
  steps: [
    {
      title: "Crie sua conta",
      description:
        "Cadastro self-service com o seu CRECI. Sua base nasce isolada, os seus dados não dividem espaço com os de ninguém.",
    },
    {
      title: "Traga imóveis e clientes",
      description:
        "Cadastre o portfólio com fotos e vídeos e organize os clientes nas etapas do funil.",
    },
    {
      title: "Gere placa e contrato com IA",
      description:
        "Placa com QR Code pronta para imprimir e contrato redigido em minutos, a partir dos dados que já estão lá.",
    },
    {
      title: "Cobre e repasse no automático",
      description:
        "Fatura mensal, baixa via Asaas e repasse calculado ao proprietário. Você confere e não digita.",
    },
  ],
} as const;

export const trust = {
  eyebrow: "Confiança e segurança",
  title: "Dinheiro de terceiros exige mais do que boa intenção.",
  items: [
    {
      icon: ShieldCheck,
      title: "Isolamento total por conta",
      description:
        "Os dados da sua imobiliária ficam separados dos de qualquer outra. Sem base compartilhada, sem vizinho de tabela.",
    },
    {
      icon: Landmark,
      title: "Pagamentos por instituição regulada",
      description:
        "Boleto e PIX passam pelo Asaas. A Lotti organiza e registra; o processamento financeiro é de quem tem licença para isso.",
    },
    {
      icon: CalendarClock,
      title: "Trilha de auditoria de cada centavo",
      description:
        "Cada fatura, baixa e repasse fica registrado com data e origem. Dá para reconstruir qualquer operação meses depois.",
    },
  ],
} as const;

export const plans = {
  eyebrow: "Planos e Assinaturas",
  title: "Tudo o que sua operação precisa.",
  lead: "Organize clientes, imóveis, contratos, finanças, aluguéis e oportunidades em uma plataforma criada para o mercado imobiliário. Escolha o plano ideal para o tamanho do seu negócio.",
  points: [
    "Teste grátis por 14 dias sem cartão.",
    "Planos que acompanham seu crescimento.",
    "Desconto de 2 meses no ciclo anual.",
  ],
  cta: "Ver planos e preços",
} as const;

export const finalCta = {
  eyebrow: "Demonstração",
  title: "Agende sua demonstração.",
  lead: "Trinta minutos. A gente monta o seu funil, gera uma placa com QR Code e redige um contrato usando os seus dados reais. Você decide depois.",
  reassurance: [
    "Sem compromisso",
    "Conversa com quem construiu o produto",
    "Resposta em até 1 dia útil",
  ],
} as const;

export const form = {
  title: "Fale com a gente",
  fields: {
    name: { label: "Nome completo", placeholder: "Como podemos te chamar" },
    whatsapp: { label: "WhatsApp", placeholder: "(00) 00000-0000" },
    email: { label: "E-mail", placeholder: "voce@exemplo.com.br" },
    creci: { label: "CRECI", placeholder: "Opcional", optional: true },
    portfolio: { label: "Imóveis administrados" },
  },
  portfolioOptions: [
    "Ainda não administro",
    "1 a 10",
    "11 a 50",
    "51 a 200",
    "Mais de 200",
  ],
  submit: "Agendar demonstração",
  submitting: "Enviando…",
  whatsappAlt: "Prefiro falar no WhatsApp",
  success: {
    title: "Recebemos seu pedido.",
    description:
      "Entramos em contato pelo WhatsApp em até 1 dia útil para combinar o horário.",
  },
  genericError:
    "Não conseguimos enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.",
} as const;

export const footer = {
  description:
    "SaaS e CRM para imobiliárias e corretores. Gestão imobiliária inteligente, do primeiro lead ao repasse do aluguel.",
  columns: [
    {
      title: "Produto",
      links: [
        { label: "Recursos", href: "#recursos" },
        { label: "Como funciona", href: "#como-funciona" },
        { label: "Diferenciais", href: "/#diferenciais" },
        { label: "Planos", href: "/#planos" },
        { label: "Comparar planos", href: "/planos" },
      ],
    },
  ],
} as const;

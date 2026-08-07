import type { SVGProps } from "react";

/**
 * Símbolo da Lotti — três lâminas diagonais ascendentes + a pílula.
 *
 * ⚠️ PROVISÓRIO. Este é um desenho de apoio para o site não ficar sem marca
 * antes dos arquivos oficiais chegarem. Assim que public/brand/ estiver
 * preenchido, ligue siteConfig.useOfficialBrandFiles e este componente sai
 * de cena. Ver README.
 *
 * Preenche com currentColor: preto sobre fundo claro, branco sobre a faixa
 * preta. Nunca aplique sombra, rotação ou distorção — o manual proíbe.
 */
export function LottiMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="currentColor"
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      <path d="M0 80 L16 80 L58.5 0 L53.125 0 Q42.5 0 31.875 20 Z" />
      <path d="M21 80 L37 80 L67.8125 22 L51.8125 22 Z" />
      <path d="M42 80 L58 80 L77.125 44 L61.125 44 Z" />
      <rect x="82" y="34" width="16" height="46" rx="8" />
    </svg>
  );
}

/** Proporção largura/altura do símbolo. */
export const MARK_RATIO = 100 / 80;

/**
 * Área de proteção do manual: a altura da pílula (X) do símbolo.
 * Aqui, 46 de 80 unidades de altura.
 */
export const CLEAR_SPACE_RATIO = 46 / 80;

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
      <path d="M0 80 L14 80 L56.5 0 L42.5 0 Z" />
      <path d="M18 80 L32 80 L62.8 22 L48.8 22 Z" />
      <path d="M36 80 L50 80 L69.1 44 L55.1 44 Z" />
      <rect x="76" y="36" width="24" height="44" rx="12" />
    </svg>
  );
}

/** Proporção largura/altura do símbolo. */
export const MARK_RATIO = 100 / 80;

/**
 * Área de proteção do manual: a altura da pílula (X) do símbolo.
 * Aqui, 44 de 80 unidades de altura.
 */
export const CLEAR_SPACE_RATIO = 44 / 80;

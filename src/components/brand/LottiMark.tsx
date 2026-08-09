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
      viewBox="0 0 262 292"
      fill="currentColor"
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      <path d="M124.5 74.5L0 187.5V101.918C0 93.4999 4.07524 85.6031 10.9361 80.7261L124.5 0V74.5Z" />
      <path d="M179.5 126.5L0 292V211L179.5 53.5V126.5Z" />
      <path d="M101 292H31.5L160.5 171V234.5L101 292Z" />
      <path d="M242 130H203.5L179.5 151.5V271.509C179.5 282.745 188.753 291.776 199.985 291.503L242.485 290.473C253.338 290.21 262 281.336 262 270.479V150C262 138.954 253.046 130 242 130Z" />
    </svg>
  );
}

/** Proporção largura/altura do símbolo. */
export const MARK_RATIO = 262 / 292;

/**
 * Área de proteção do manual: a altura da pílula do símbolo.
 * Aqui, ~162 de 292 unidades de altura.
 */
export const CLEAR_SPACE_RATIO = 162 / 292;

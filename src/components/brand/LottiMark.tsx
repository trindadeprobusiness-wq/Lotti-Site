import type { ImgHTMLAttributes } from "react";

type LottiMarkProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  tone?: "ink" | "paper";
};

/** Símbolo oficial da Lotti, sem o lettering. */
export function LottiMark({ tone = "ink", ...props }: LottiMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        tone === "paper"
          ? "/brand/lotti-mark-linear-light.svg"
          : "/brand/lotti-mark-linear-dark.svg"
      }
      alt=""
      aria-hidden="true"
      {...props}
    />
  );
}

export const MARK_RATIO = 262 / 292;
export const CLEAR_SPACE_RATIO = 162 / 292;

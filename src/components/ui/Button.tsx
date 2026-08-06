import { ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverted" | "inverted-ghost";

const variantClass: Record<Variant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  inverted: "btn btn-inverted",
  "inverted-ghost": "btn btn-inverted-ghost",
};

type Common = {
  variant?: Variant;
  /** Mostra a seta que desliza no hover. Use no CTA principal. */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ActionProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export function Button(props: LinkProps | ActionProps) {
  const { variant = "primary", arrow = false, children, className, ...rest } = props;
  const classes = [variantClass[variant], className].filter(Boolean).join(" ");

  const content = (
    <>
      {children}
      {arrow ? (
        <ArrowRight className="btn-arrow" size={16} strokeWidth={2} aria-hidden="true" />
      ) : null}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as LinkProps;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { ...buttonProps } = rest as ActionProps;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

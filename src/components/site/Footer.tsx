import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { isPending, mailtoUrl, siteConfig, whatsappUrl } from "@/config/site";
import { footer } from "@/content/landing";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = whatsappUrl();
  const mailto = mailtoUrl();
  const hasSocial =
    !isPending(siteConfig.social.instagram) ||
    !isPending(siteConfig.social.linkedin);

  return (
    <footer className="on-ink border-t border-white/12 bg-ink text-paper">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-20">
          <div>
            <Logo size={25} tone="paper" />
            <p className="mt-4 max-w-[36ch] text-small text-white/50">
              {footer.description}
            </p>

            {hasSocial ? (
              <div className="mt-6 flex items-center gap-4">
                {!isPending(siteConfig.social.instagram) ? (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram da Lotti"
                    className="text-white/50 transition-colors hover:text-paper"
                  >
                    <InstagramIcon width={20} height={20} />
                  </a>
                ) : null}
                {!isPending(siteConfig.social.linkedin) ? (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn da Lotti"
                    className="text-white/50 transition-colors hover:text-paper"
                  >
                    <LinkedinIcon width={20} height={20} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-eyebrow uppercase tracking-wider text-white/40">
                {column.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-small text-white/60 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-eyebrow uppercase tracking-wider text-white/40">
              Próximo passo
            </p>
            <p className="mt-4 max-w-[28ch] text-small text-white/60">
              Veja a Lotti funcionando com os dados e a rotina da sua operação.
            </p>
            <Link
              href="/#demo"
              className="mt-5 inline-flex items-center gap-2 text-small font-semibold text-paper transition-opacity hover:opacity-70"
            >
              Agendar demonstração
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>

            {whatsapp || mailto ? (
              <ul className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
                {whatsapp ? (
                  <li>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small text-white/50 transition-colors hover:text-paper"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {mailto ? (
                  <li>
                    <a
                      href={mailto}
                      className="text-small text-white/50 transition-colors hover:text-paper"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/40">
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p className="text-small text-white/40">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

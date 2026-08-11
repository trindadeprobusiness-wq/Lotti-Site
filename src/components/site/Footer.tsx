import { siteConfig, isPending, whatsappUrl, mailtoUrl } from "@/config/site";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { footer } from "@/content/landing";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = whatsappUrl();
  const mailto = mailtoUrl();

  const hasSocial =
    !isPending(siteConfig.social.instagram) ||
    !isPending(siteConfig.social.linkedin);

  const hasContact = whatsapp || mailto;

  return (
    <footer className="on-ink border-t border-white/12 bg-ink text-paper">
      <div className="shell py-12 md:py-16">
        {/* Grid principal */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Coluna da marca */}
          <div>
            <p className="text-h3 font-semibold text-paper">{siteConfig.name}</p>
            <p className="mt-3 max-w-[36ch] text-small text-white/50">
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

          {/* Colunas de links */}
          {footer.columns.map((column) => (
            <div key={column.title}>
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
            </div>
          ))}

          {/* Coluna de contato */}
          {hasContact ? (
            <div>
              <p className="text-eyebrow uppercase tracking-wider text-white/40">
                Contato
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {whatsapp ? (
                  <li>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small text-white/60 transition-colors hover:text-paper"
                    >
                      WhatsApp {!isPending(siteConfig.whatsappLabel) ? `— ${siteConfig.whatsappLabel}` : ""}
                    </a>
                  </li>
                ) : null}
                {mailto ? (
                  <li>
                    <a
                      href={mailto}
                      className="text-small text-white/60 transition-colors hover:text-paper"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Barra inferior */}
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

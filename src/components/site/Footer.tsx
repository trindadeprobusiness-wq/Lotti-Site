import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { Logo } from "@/components/brand/Logo";
import { footer } from "@/content/landing";
import {
  isPending,
  mailtoUrl,
  siteConfig,
  whatsappUrl,
} from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = whatsappUrl();
  const mailto = mailtoUrl(`Contato pelo site ${siteConfig.domain}`);

  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
    { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedinIcon },
  ].filter((item) => !isPending(item.href));

  return (
    <footer className="on-ink border-t border-white/12 bg-ink text-paper">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size={24} tone="paper" />
            <p className="mt-6 max-w-[38ch] text-small text-white/60">
              {footer.description}
            </p>

            {socials.length > 0 ? (
              <ul className="mt-7 flex gap-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Lotti no ${label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/60"
                    >
                      <Icon width={17} height={17} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow">{column.title}</p>
              <ul className="mt-6 flex flex-col gap-3.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-small text-white/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="eyebrow">Contato</p>
            <ul className="mt-6 flex flex-col gap-3.5 text-small">
              <ContactItem
                label="WhatsApp"
                value={siteConfig.whatsappLabel}
                href={whatsapp}
              />
              <ContactItem
                label="E-mail"
                value={siteConfig.email}
                href={mailto}
              />
              <ContactItem
                label="Site"
                value={siteConfig.domain}
                href={siteConfig.url}
              />
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/50">
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p className="text-small text-white/50">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Quando o dado ainda não foi preenchido, mostra o texto em vez de gerar
 * um link quebrado. Assim o que falta fica visível em vez de escondido.
 */
function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string | null;
}) {
  const pending = isPending(value) || !href;

  return (
    <li className="flex flex-col gap-0.5">
      <span className="text-white/40">{label}</span>
      {pending ? (
        <span className="text-white/70">{value}</span>
      ) : (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-white/70 transition-colors hover:text-paper"
        >
          {value}
        </a>
      )}
    </li>
  );
}

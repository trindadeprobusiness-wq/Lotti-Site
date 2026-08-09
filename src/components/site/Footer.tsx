import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink border-t border-white/12 bg-ink text-paper">
      <div className="shell py-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-white/50">
          © {year} {siteConfig.name}. Todos os direitos reservados.
        </p>
        <p className="text-small text-white/50">{siteConfig.tagline}</p>
      </div>
    </footer>
  );
}

import { LottiMark } from "@/components/brand/LottiMark";

/**
 * Momento assinatura: a placa na fachada é lida e o lead aparece no funil.
 * Puramente ilustrativo — sem dado de cliente, sem número inventado.
 * A animação para sob prefers-reduced-motion e o resultado continua visível.
 */
export function ScanBridge() {
  return (
    <div
      aria-hidden="true"
      className="relative flex items-center justify-center gap-5 rounded-[var(--radius-card)] bg-surface p-6 sm:gap-8 sm:p-8"
    >
      {/* A placa impressa */}
      <div className="relative w-[44%] max-w-[190px] shrink-0 overflow-hidden rounded-lg border border-line bg-paper p-4">
        <span className="flex items-center gap-1.5 text-ink">
          <LottiMark style={{ height: 11, width: "auto" }} />
          <span className="text-[11px] font-medium tracking-[-0.02em]">Lotti</span>
        </span>

        <div className="mt-3 flex justify-center">
          <QrGlyph />
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-line" />
          <div className="h-1.5 w-3/5 rounded-full bg-line" />
        </div>

        {/* O feixe, na inclinação da lâmina */}
        <span className="scan-beam pointer-events-none absolute inset-y-[-30%] left-0 w-1/3" />
      </div>

      {/* A coluna do funil, recebendo */}
      <div className="min-w-0 flex-1">
        <p className="eyebrow">Novos leads</p>
        <div className="mt-3 space-y-2">
          <div className="lead-card rounded-lg border border-ink bg-paper p-3">
            <div className="h-1.5 w-2/3 rounded-full bg-ink/85" />
            <div className="mt-2 h-1.5 w-2/5 rounded-full bg-line" />
          </div>
          <div className="rounded-lg border border-line bg-paper p-3 opacity-60">
            <div className="h-1.5 w-1/2 rounded-full bg-line" />
            <div className="mt-2 h-1.5 w-1/3 rounded-full bg-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Glifo de QR Code — desenho decorativo, não é um código legível. */
function QrGlyph() {
  const cells = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
  ];

  return (
    <svg viewBox="0 0 9 9" className="h-16 w-16" fill="currentColor">
      {cells.flatMap((row, y) =>
        row.map((filled, x) =>
          filled ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null,
        ),
      )}
    </svg>
  );
}

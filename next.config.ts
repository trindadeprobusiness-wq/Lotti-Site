import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O selo de dev flutua sobre o canto da página e atrapalha a revisão visual.
  devIndicators: false,

  // A rota de Open Graph lê o TTF do disco em tempo de build. O tracing
  // automático não enxerga esse caminho, então declaramos o arquivo.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/Sora-Regular.woff", "./assets/Sora-Bold.woff"],
  },
};

export default nextConfig;

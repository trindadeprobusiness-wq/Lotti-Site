import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O selo de dev flutua sobre o canto da página e atrapalha a revisão visual.
  devIndicators: false,

  // A rota de Open Graph lê o TTF do disco em tempo de build. O tracing
  // automático não enxerga esse caminho, então declaramos o arquivo.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/Sora-Regular.woff", "./assets/Sora-Bold.woff"],
  },

  // O www é um endereço só de entrada: tudo é servido no domínio sem www.
  // Sem isto o mesmo conteúdo responde nos dois hosts e o Google trata como
  // páginas duplicadas, dividindo o ranqueamento entre elas.
  //
  // `permanent: true` emite 308, que preserva o método e o corpo da requisição
  // (301 pode virar GET no caminho). O :path* mantém a rota e a querystring,
  // então /planos?x=1 no www chega em /planos?x=1 no domínio final.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.plataformalotti.com.br" }],
        destination: "https://plataformalotti.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

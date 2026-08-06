import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { problem } from "@/content/landing";

/**
 * Livro-razão de duas colunas: a mesma linha, antes e depois.
 * O alinhamento é a mensagem — por isso as quatro dores e as quatro
 * respostas dividem exatamente a mesma grade.
 */
export function ProblemSolution() {
  return (
    <section className="section bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={problem.eyebrow}
          title={problem.title}
          lead={problem.lead}
        />

        <div className="mt-14">
          {/* Cabeçalho das colunas — só faz sentido quando elas existem */}
          <div className="hidden grid-cols-2 gap-x-12 pb-4 md:grid">
            <p className="eyebrow">{problem.columns.before}</p>
            <p className="eyebrow text-ink">{problem.columns.after}</p>
          </div>

          <ul className="border-t border-line">
            {problem.rows.map((row, index) => (
              <Reveal
                as="li"
                key={row.before}
                delay={index * 70}
                className="grid gap-4 border-b border-line py-7 md:grid-cols-2 md:gap-x-12"
              >
                <div>
                  <p className="eyebrow mb-2 md:hidden">{problem.columns.before}</p>
                  <p className="text-muted">{row.before}</p>
                </div>
                <div>
                  <p className="eyebrow mb-2 text-ink md:hidden">
                    {problem.columns.after}
                  </p>
                  <p className="text-ink">{row.after}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

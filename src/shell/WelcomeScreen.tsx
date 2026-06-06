import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimelineSummary } from "../timelineEdition";
import { SITE_INSTAGRAM_URL } from "./siteLinks";

type WelcomeScreenProps = {
  timelines: TimelineSummary[] | null;
  onSelectTimeline: (id: string) => void;
  onCreateTimeline: (title: string) => Promise<void>;
};

export function WelcomeScreen({ timelines, onSelectTimeline, onCreateTimeline }: WelcomeScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setCreatePending(true);
    setCreateError(null);
    try {
      await onCreateTimeline(title);
    } catch {
      setCreateError("No se pudo crear la línea de tiempo. Intentá de nuevo.");
      setCreatePending(false);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setNewTitle("");
    setCreateError(null);
  }

  return (
    <div className="min-h-dvh bg-background flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <header className="mb-8">
          <h1 className="font-serif font-bold text-[2rem] leading-tight tracking-tight text-primary mb-3">
            Historias en el Tiempo
          </h1>
          <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
            Explorá, creá y compartí líneas del tiempo sobre cualquier tema.
            Cada línea muestra períodos y eventos en un eje interactivo: podés
            hacer zoom, filtrar por categoría y estudiar relaciones causales
            entre eventos.
          </p>
          <p className="text-[0.8rem] text-muted-foreground mt-3">
            <a
              href={SITE_INSTAGRAM_URL}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram: @historic.timelines
            </a>
          </p>
        </header>

        <section>
          {timelines === null ? (
            <TimelineListSkeleton />
          ) : timelines.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">
              No hay líneas de tiempo disponibles.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 mb-5 list-none p-0 m-0">
              {timelines.map((item) => (
                <li key={item.id}>
                  <Card className="gap-0 py-0">
                    <CardContent className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-[0.95rem] text-foreground truncate">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-[0.8rem] text-muted-foreground line-clamp-1">
                            {item.description}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectTimeline(item.id)}
                        className="shrink-0"
                      >
                        Ver
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}

          {timelines !== null && (
            <div className="mt-4">
              {showForm ? (
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título de la línea de tiempo"
                    autoFocus
                    disabled={createPending}
                  />
                  {createError && (
                    <p className="text-destructive text-[0.85rem]">{createError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={createPending || !newTitle.trim()}
                      size="sm"
                    >
                      {createPending ? "Creando…" : "Crear"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={createPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="w-full gap-2"
                >
                  <Plus className="size-4" />
                  Nueva línea de tiempo
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TimelineListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 mb-5">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="gap-0 py-0">
          <CardContent className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-14 shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

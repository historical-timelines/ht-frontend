import { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimelineSummary } from "../timelineEdition";
import { AppNavbar } from "./AppNavbar";
import { SITE_INSTAGRAM_URL } from "./siteLinks";
import { TimelineCard } from "./TimelineCard";
import { TIMELINE_CARD_STYLES } from "./timelineCardStyles";

const SEARCH_DEBOUNCE_MS = 300;

type WelcomeScreenProps = {
  items: TimelineSummary[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoadMore: () => void;
  onCreateTimeline: (title: string) => Promise<void>;
};

export function WelcomeScreen({
  items,
  loading,
  loadingMore,
  error,
  hasMore,
  searchQuery,
  onSearchChange,
  onLoadMore,
  onCreateTimeline,
}: WelcomeScreenProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => onSearchChange(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // onSearchChange is expected to be referentially stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

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
    <div className="min-h-dvh bg-background">
      <style>{TIMELINE_CARD_STYLES}</style>
      <AppNavbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif font-bold text-[1.8rem] leading-tight tracking-tight text-primary mb-2">
              Líneas de tiempo
            </h1>
            <p className="text-muted-foreground leading-relaxed text-[0.9rem] max-w-[48ch]">
              Explorá, creá y compartí líneas del tiempo sobre cualquier tema.
            </p>
            <p className="text-[0.8rem] text-muted-foreground mt-1.5">
              <a
                href={SITE_INSTAGRAM_URL}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram: @historic.timelines
              </a>
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="size-4" />
            Nueva línea de tiempo
          </Button>
        </header>

        {showForm && (
          <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-8 max-w-md">
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título de la línea de tiempo"
              autoFocus
              disabled={createPending}
            />
            {createError && <p className="text-destructive text-[0.85rem]">{createError}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={createPending || !newTitle.trim()} size="sm">
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
        )}

        <div className="relative mb-7 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por título o descripción…"
            className="pl-9"
            aria-label="Buscar líneas de tiempo"
          />
        </div>

        {loading ? (
          <TimelineGridSkeleton />
        ) : error ? (
          <p className="text-destructive text-sm py-4">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">
            {searchQuery
              ? `No encontramos líneas de tiempo que coincidan con "${searchQuery}".`
              : "No hay líneas de tiempo disponibles."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {items.map((item) => (
                <TimelineCard
                  key={item.id}
                  href={`/${item.slug ?? item.id}`}
                  seed={item.id}
                  title={item.title}
                  description={item.description}
                  footer={<TimelineCardMeta item={item} />}
                />
              ))}
            </div>
            <div ref={sentinelRef} aria-hidden="true" />
            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TimelineCardMeta({ item }: { item: TimelineSummary }) {
  return (
    <div className="border-t border-border px-5 py-2.5 flex flex-col gap-0.5 text-[0.7rem] text-muted-foreground font-mono">
      <span className="truncate" title={item.id}>
        id: {item.id}
      </span>
      <span className="truncate" title={item.slug ?? undefined}>
        slug: {item.slug ?? "—"}
      </span>
      <span>creada: {formatDate(item.createdAt)}</span>
      <span>actualizada: {formatDate(item.updatedAt)}</span>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function TimelineGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="gap-0 py-0 overflow-hidden rounded-xl">
      <Skeleton className="h-[70px] w-full rounded-none" />
      <CardContent className="flex flex-col gap-2 px-5 py-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

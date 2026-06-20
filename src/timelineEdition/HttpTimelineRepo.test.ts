import { describe, expect, it, vi } from "vitest";
import { HttpTimelineRepo } from "./HttpTimelineRepo";

const timelineResponse = {
  id: "argentina-history",
  slug: "historia-argentina",
  title: "Historia Argentina",
  description: null,
  created_at: "2026-05-01T00:00:00Z",
  updated_at: "2026-05-01T00:00:00Z",
  snapshot: {
    periods: [],
    events: [
      {
        id: "evento",
        title: "Evento",
        date: "1900-01-01T12:00:00.000Z",
        lanes: ["politico"],
        items: ["Punto"],
      },
    ],
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("HttpTimelineRepo", () => {
  it("lists timeline summaries using backend snake_case fields", async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({ items: [timelineResponse], next_cursor: null })
    );
    const repo = new HttpTimelineRepo("http://api.test", fetcher);

    const page = await repo.list();

    expect(fetcher).toHaveBeenCalledWith(
      "http://api.test/timelines",
      expect.objectContaining({ headers: expect.objectContaining({ Accept: "application/json" }) })
    );
    expect(page.nextCursor).toBeNull();
    expect(page.items[0]).toMatchObject({
      id: "argentina-history",
      slug: "historia-argentina",
      title: "Historia Argentina",
      createdAt: new Date("2026-05-01T00:00:00Z"),
    });
  });

  it("sends q/cursor/limit as query params and forwards next_cursor", async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({ items: [timelineResponse], next_cursor: "opaque-cursor" })
    );
    const repo = new HttpTimelineRepo("http://api.test", fetcher);

    const page = await repo.list({ query: "argentina", cursor: "prev-cursor", limit: 5 });

    expect(fetcher).toHaveBeenCalledWith(
      "http://api.test/timelines?q=argentina&cursor=prev-cursor&limit=5",
      expect.any(Object)
    );
    expect(page.nextCursor).toBe("opaque-cursor");
  });

  it("revives snapshot dates when fetching a timeline", async () => {
    const fetcher = vi.fn(async () => jsonResponse(timelineResponse));
    const repo = new HttpTimelineRepo("http://api.test/", fetcher);

    const record = await repo.get("argentina-history");

    expect(fetcher).toHaveBeenCalledWith(
      "http://api.test/timelines/argentina-history",
      expect.any(Object)
    );
    expect(record.timeline.events[0]?.date).toBeInstanceOf(Date);
  });

  it("sends full snapshot replacements to the backend", async () => {
    const fetcher = vi.fn(async () => jsonResponse(timelineResponse));
    const repo = new HttpTimelineRepo("http://api.test", fetcher);

    await repo.replace("argentina-history", {
      title: "Historia Argentina",
      description: null,
      timeline: {
        periods: [],
        events: [
          {
            id: "evento",
            title: "Evento",
            date: new Date("1900-01-01T12:00:00.000Z"),
            lanes: ["politico"],
            items: ["Punto"],
          },
        ],
      },
    });

    const call = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(call[1].body))).toEqual({
      title: "Historia Argentina",
      description: null,
      snapshot: timelineResponse.snapshot,
    });
  });
});

import type { TimelineRecord } from "./TimelineRepo";
import { timelineFromJson } from "./timelineSerialization";
import type { AiConversation, AiMessage, TimelineChange } from "./aiConversation";

type Fetcher = typeof fetch;
const defaultFetcher: Fetcher = (input, init) => globalThis.fetch(input, init);

type TimelineChangeWire = {
  type: string;
  target_id: string | null;
  data: Record<string, unknown> | null;
  rationale: string;
};

type AiMessageWire = {
  id: string;
  timeline_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  proposed_changes: TimelineChangeWire[];
};

type AiConversationWire = {
  timeline_id: string;
  user_id: string;
  messages: AiMessageWire[];
};

type TimelineWire = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  snapshot: unknown;
};

export class AiApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail: unknown
  ) {
    super(message);
    this.name = "AiApiError";
  }
}

export class HttpAiService {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private readonly fetcher: Fetcher = defaultFetcher
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async getConversation(timelineId: string): Promise<AiConversation> {
    const wire = await this.request<AiConversationWire>(
      `/timelines/${encodeURIComponent(timelineId)}/ai-conversation`
    );
    return conversationFromWire(wire);
  }

  async sendMessage(timelineId: string, content: string): Promise<AiConversation> {
    const wire = await this.request<AiConversationWire>(
      `/timelines/${encodeURIComponent(timelineId)}/ai-conversation/messages`,
      { method: "POST", body: JSON.stringify({ content }) }
    );
    return conversationFromWire(wire);
  }

  async applyOperations(
    timelineId: string,
    changes: TimelineChange[]
  ): Promise<TimelineRecord> {
    const wire = await this.request<TimelineWire>(
      `/timelines/${encodeURIComponent(timelineId)}/operations`,
      { method: "POST", body: JSON.stringify({ changes }) }
    );
    return {
      id: wire.id,
      title: wire.title,
      description: wire.description,
      createdAt: new Date(wire.created_at),
      updatedAt: new Date(wire.updated_at),
      timeline: timelineFromJson(wire.snapshot),
    };
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body == null ? {} : { "Content-Type": "application/json" }),
        ...init.headers,
      },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new AiApiError(
        `AI API request failed with ${response.status}`,
        response.status,
        payload
      );
    }
    return payload as T;
  }
}

function messageFromWire(wire: AiMessageWire): AiMessage {
  return {
    id: wire.id,
    role: wire.role,
    content: wire.content,
    createdAt: new Date(wire.created_at),
    proposedChanges: wire.proposed_changes.map((c) => ({
      type: c.type as TimelineChange["type"],
      target_id: c.target_id,
      data: c.data,
      rationale: c.rationale,
    })),
  };
}

function conversationFromWire(wire: AiConversationWire): AiConversation {
  return {
    timelineId: wire.timeline_id,
    messages: wire.messages.map(messageFromWire),
  };
}

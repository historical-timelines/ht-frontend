export type TimelineChangeType =
  | "create_event"
  | "update_event"
  | "delete_event"
  | "create_period"
  | "update_period"
  | "delete_period";

export type TimelineChange = {
  type: TimelineChangeType;
  target_id: string | null;
  data: Record<string, unknown> | null;
  rationale: string;
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  proposedChanges: TimelineChange[];
};

export type AiConversation = {
  timelineId: string;
  messages: AiMessage[];
};

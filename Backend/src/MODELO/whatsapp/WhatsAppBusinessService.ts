import { env } from "$env/dynamic/private";

type GraphResponse = {
  messages?: Array<{ id: string }>;
  error?: { message: string };
};
export type WhatsAppMessage = {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  read: boolean;
};
export type WhatsAppConversation = {
  id: string;
  phone: string;
  name?: string;
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  messages: WhatsAppMessage[];
};

type WebhookMessage = {
  id: string;
  from: string;
  timestamp?: string;
  text?: { body?: string };
  type?: string;
};

class WhatsAppBusinessService {
  private readonly conversations = new Map<string, WhatsAppConversation>();

  get configured(): boolean {
    return Boolean(
      env.META_WHATSAPP_TOKEN && env.META_WHATSAPP_PHONE_NUMBER_ID,
    );
  }

  get verifyToken(): string {
    return env.META_WHATSAPP_VERIFY_TOKEN || "";
  }

  listConversations(): WhatsAppConversation[] {
    return [...this.conversations.values()].sort((a, b) =>
      (b.lastMessage?.timestamp || "").localeCompare(
        a.lastMessage?.timestamp || "",
      ),
    );
  }

  getUnreadCount(): number {
    return this.listConversations().reduce(
      (total, conversation) => total + conversation.unreadCount,
      0,
    );
  }

  receiveWebhook(message: WebhookMessage, name?: string): WhatsAppConversation {
    const conversation = this.conversations.get(message.from) || {
      id: message.from,
      phone: message.from,
      name,
      unreadCount: 0,
      messages: [],
    };
    const incoming: WhatsAppMessage = {
      id: message.id,
      from: message.from,
      text: message.text?.body || `[${message.type || "mensaje"}]`,
      timestamp: message.timestamp || new Date().toISOString(),
      direction: "inbound",
      read: false,
    };
    conversation.messages.push(incoming);
    conversation.lastMessage = incoming;
    conversation.unreadCount += 1;
    if (name) conversation.name = name;
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  markRead(phone: string): WhatsAppConversation | undefined {
    const conversation = this.conversations.get(phone);
    if (!conversation) return undefined;
    conversation.messages = conversation.messages.map((message) => ({
      ...message,
      read: true,
    }));
    conversation.unreadCount = 0;
    return conversation;
  }

  async sendMessage(to: string, body: string): Promise<GraphResponse> {
    if (!this.configured)
      throw new Error("WhatsApp Business API no configurada.");
    const response = await fetch(
      `https://graph.facebook.com/${env.META_GRAPH_API_VERSION || "v22.0"}/${env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.META_WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { preview_url: false, body },
        }),
      },
    );
    const result = (await response.json()) as GraphResponse;
    if (!response.ok)
      throw new Error(
        result.error?.message || "Meta rechazó el envío del mensaje.",
      );
    const conversation = this.conversations.get(to) || {
      id: to,
      phone: to,
      unreadCount: 0,
      messages: [],
    };
    const outgoing: WhatsAppMessage = {
      id: result.messages?.[0]?.id || crypto.randomUUID(),
      from: env.META_WHATSAPP_PHONE_NUMBER_ID || "business",
      text: body,
      timestamp: new Date().toISOString(),
      direction: "outbound",
      read: true,
    };
    conversation.messages.push(outgoing);
    conversation.lastMessage = outgoing;
    this.conversations.set(to, conversation);
    return result;
  }
}

export const whatsappBusinessService = new WhatsAppBusinessService();

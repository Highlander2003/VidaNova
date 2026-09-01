import { getBackendUrl } from "./backend";

export type Message = {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  read: boolean;
};

export type Conversation = {
  id: string;
  phone: string;
  name?: string;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
};

export async function fetchConversations(): Promise<{
  conversations: Conversation[];
  configured: boolean;
}> {
  const response = await fetch(`${getBackendUrl()}/api/whatsapp/conversations`);
  if (!response.ok) throw new Error("Backend no Conectado");
  return (await response.json()) as {
    conversations: Conversation[];
    configured: boolean;
  };
}

export async function markConversationRead(phone: string): Promise<void> {
  await fetch(
    `${getBackendUrl()}/api/whatsapp/conversations?phone=${encodeURIComponent(phone)}`,
  );
}

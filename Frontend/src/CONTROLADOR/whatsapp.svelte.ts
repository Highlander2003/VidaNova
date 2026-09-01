import {
  fetchConversations,
  markConversationRead,
  type Conversation,
} from "$modelo/whatsapp";

export class WhatsappController {
  conversations = $state<Conversation[]>([]);
  selectedPhone = $state("");
  backendConnected = $state(false);
  apiConfigured = $state(false);

  selectedConversation = $derived(
    this.conversations.find(
      (conversation) => conversation.phone === this.selectedPhone,
    ),
  );
  unreadCount = $derived(
    this.conversations.reduce(
      (total, conversation) => total + conversation.unreadCount,
      0,
    ),
  );

  async loadConversations(): Promise<void> {
    try {
      const result = await fetchConversations();
      this.conversations = result.conversations;
      this.apiConfigured = result.configured;
      this.backendConnected = true;
      if (!this.selectedPhone && this.conversations[0])
        this.selectedPhone = this.conversations[0].phone;
    } catch {
      this.backendConnected = false;
    }
  }

  async selectConversation(phone: string): Promise<void> {
    this.selectedPhone = phone;
    await markConversationRead(phone);
    await this.loadConversations();
  }

  startPolling(intervalMs = 15_000): () => void {
    void this.loadConversations();
    const timer = window.setInterval(
      () => void this.loadConversations(),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }
}

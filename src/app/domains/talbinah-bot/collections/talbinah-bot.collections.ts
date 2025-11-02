export class KhawiikManagementCollections {
  static ModuleName: string = 'api';

  static Khawiik: string = `${KhawiikManagementCollections.ModuleName}`;

  static ChatsHistoryListing(): string {
    return `${KhawiikManagementCollections.Khawiik}/conversations`;
  }
  static DeleteChat(id: number): string {
    return `${KhawiikManagementCollections.Khawiik}/conversations/${id}`;
  }
  static EditChatName(id: number): string {
    return `${KhawiikManagementCollections.Khawiik}/conversations/${id}`;
    // "https://redesign.talbinah.net/api/conversations/67?name=chatnameee&_method=PUT"
  }
  static GetConversation(id: number): string {
    return `${KhawiikManagementCollections.Khawiik}/conversations/${id}`;
    // "https://redesign.talbinah.net/api/conversations/138"
  }
  static StartNewChat(): string {
    return `${KhawiikManagementCollections.Khawiik}/chat-bot/chat`;
    // "https://redesign.talbinah.net/api/chat-bot/chat"
  }
  static SendMessage(): string {
    return `${KhawiikManagementCollections.Khawiik}/chat-bot/chat`;
    // 	"https://redesign.talbinah.net/api/chat-bot/chat"
  }

  static khawiikVoiceTypes(): string {
    return `${KhawiikManagementCollections.Khawiik}/voices`;
  }
  static saveKhawiikVoiceType(): string {
    return `${KhawiikManagementCollections.Khawiik}/realtime/me/voice`;
  }
  static khawiikVoiceActivities(): string {
    return `${KhawiikManagementCollections.Khawiik}/chat-cards`;
  }
  static khawiikVoiceRealtimeSession(): string {
    return `${KhawiikManagementCollections.Khawiik}/realtime/session`;
  }

  static khawiikBooks(): string {
    return `${KhawiikManagementCollections.Khawiik}/chatbot-mission`;
  }
  static startMission(missionSlug: string): string {
    return `${KhawiikManagementCollections.Khawiik}/chatbot-mission/${missionSlug}/start`;
  }

  static voiceTrack(): string {
    return `${KhawiikManagementCollections.Khawiik}/chatbot-mission/voice-track`;
  }
}

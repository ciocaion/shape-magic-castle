import i18n, { TFunction } from 'i18next';

export type TutorMessageType = 'success' | 'instruction';

export interface TutorMessage {
  type: 'tutorMessage';
  messageType: TutorMessageType;
  content: string;
  data: Record<string, any>;
}

class TutorService {
  private static instance: TutorService;
  private lastMessage: TutorMessage | null = null;

  private constructor() {}

  public static getInstance(): TutorService {
    if (!TutorService.instance) {
      TutorService.instance = new TutorService();
    }
    return TutorService.instance;
  }

  public sendMessage(messageType: TutorMessageType, content: string, data: Record<string, any> = {}) {
    const message: TutorMessage = {
      type: 'tutorMessage',
      messageType,
      content,
      data,
    };

    try {
      window.parent.postMessage(message, '*');
      console.log('Tutor message sent:', message);
      this.lastMessage = message;
    } catch (error) {
      console.error('Failed to send tutor message:', error);
    }
  }

  public sendInstructionMessage(t: TFunction, translationKey: string, data: Record<string, any> = {}) {
    const content = t(translationKey);
    const enriched = {
      ...data,
      meta: {
        ...(data as any)?.meta,
        translationKey,
      },
    } as Record<string, any>;
    this.sendMessage('instruction', content, enriched);
  }

  public sendSuccessMessage(t: TFunction, translationKey: string, data: Record<string, any> = {}) {
    const content = t(translationKey);
    const enriched = {
      ...data,
      meta: {
        ...(data as any)?.meta,
        translationKey,
      },
    } as Record<string, any>;
    this.sendMessage('success', content, enriched);
  }

  /**
   * Resend the last message using the current language.
   * Expects translation keys in data.meta.translationKey when available; if not,
   * falls back to resending the same content string.
   */
  public resendLastMessage(t: TFunction) {
    if (!this.lastMessage) return;
    const { messageType, data } = this.lastMessage;
    const translationKey = (data && (data as any).meta && (data as any).meta.translationKey) || null;
    const content = translationKey ? t(translationKey) : this.lastMessage.content;
    this.sendMessage(messageType, content, data || {});
  }
}

export const tutorService = TutorService.getInstance();
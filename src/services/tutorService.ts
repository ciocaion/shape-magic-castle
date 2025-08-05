import { TFunction } from 'i18next';

export type TutorMessageType = 'success' | 'instruction';

export interface TutorMessage {
  type: 'tutorMessage';
  messageType: TutorMessageType;
  content: string;
  data: Record<string, any>;
}

class TutorService {
  private static instance: TutorService;

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
    } catch (error) {
      console.error('Failed to send tutor message:', error);
    }
  }

  public sendInstructionMessage(t: TFunction, translationKey: string, data: Record<string, any> = {}) {
    const content = t(translationKey);
    this.sendMessage('instruction', content, data);
  }

  public sendSuccessMessage(t: TFunction, translationKey: string, data: Record<string, any> = {}) {
    const content = t(translationKey);
    this.sendMessage('success', content, data);
  }
}

export const tutorService = TutorService.getInstance();
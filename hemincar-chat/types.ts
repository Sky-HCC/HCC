export type LanguageCode = 'en' | 'ar' | 'ku' | 'fa';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  dir: 'ltr' | 'rtl';
  welcome: string;
  placeholder: string;
  title: string;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  currentLanguage: LanguageCode;
}
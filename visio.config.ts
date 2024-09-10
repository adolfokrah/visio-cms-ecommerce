import blocks from '@/app/(visio)/blocks';
import { buildConfig } from 'visio-cms-lib/utils';

const config = buildConfig({
  blocks,
  allowImageTransformation: false,
  supportedLanguages: [
    {
      language: 'English',
      locale: 'en-us',
    },
    {
      language: 'German',
      locale: 'de',
    },
  ],
  defaultLanguage: {
    language: 'English',
    locale: 'en-us',
  },
  emailSender: process.env.NEXT_PUBLIC_EMAIL_SENDER || '',
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || '',
  supabaseProjectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANONKEY || '',
  unsplashAccessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESSKEY || '',
});

export default config;

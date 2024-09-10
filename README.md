# Project Setup Instructions

Follow these steps to set up and deploy the project using Supabase, Docker, and Next.js.

---

## Prerequisites

- **Supabase Account**: Set up an account at [supabase](https://supabase.com/) and create a project.
- **Docker Desktop**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop).
- **Supabase CLI**: [Install Supabase CLI](https://supabase.com/docs/guides/cli).
- **Resend Account**: Set up an account at [Resend](https://resend.com).
- **Unplash Account**: Set up an account at [Unsplash](https://unsplash.com/).

---

```bash
git clone https://github.com/visio-cms/visio-cms-next-template.git your-project_name

cd your-project-name
```

## Setup Steps

### 1. Link Supabase Project

Link your local environment to your Supabase project with the following command:

```bash
supabase link
```

### 2. Run migrations

```bash
supabase db push
```

From your supabase storage change the `media` storage to public

### 3. Start docker

start docker desktop

### 4. Deploy supabase edge functions

```bash
supabase functions deploy
```

### 4. Set Supabase Secrets

```bash
cp supabase/.env.example supabase/.env
```

past your resend api key in the `supabase/.env` file

RESEND_API_KEY=[YOUR-RESEND-API-KEY-HERE]

### 5. Deploy your secret to supabase

```bash
supabase secrets set --env-file ./supabase/.env
```

### 6. link resend to supabase

[https://resend.com/settings/integrations/supabase](https://resend.com/settings/integrations/supabase)

### 7. update tsconfig.ts

add "@/node*modules/*": ["./node_modules/_"] to paths

```json
{
  "compilerOptions": {
    "paths": {
       .....,
      "@/node_modules/*": ["./node_modules/*"]
    }
  }
}
```

### 8. update next.config.ts to accept served media files

```js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '[YOUR-SUPABASE-PROJECT-ID].supabase.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
};
```

### 9. set up `pg_cron` and `pg_net` extensions

[https://supabase.com/dashboard/project/vgrwxgjduftemwuczacc/database/extensions](https://supabase.com/dashboard/project/vgrwxgjduftemwuczacc/database/extensions)

### 10. Add your supabase and unsplash keys to `.env`

```bash
cp .env.example supabase/.env
```

NEXT_PUBLIC_SUPABASE_PROJECT_ID=<br/>
NEXT_PUBLIC_SUPABASE_ANONKEY=<br/>
NEXT_PUBLIC_UNSPLASH_ACCESSKEY=<br/>
NEXT_PUBLIC_SUPABASE_URL=<br/>
NEXT_PUBLIC_EMAIL_SENDER="[Sender Id] <username@your-domain.com>"

### 11. run your app and register as an admin

```bash
npm i
npm run dev
```

`locahost:3000/cms/login`

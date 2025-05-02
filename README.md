This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
Install required packages
```bash
npm install
```
Rename .env.sample to .env

Run DB by docker
```bash
sudo docker compose up -d
```
Setup Prisma
```bash
npx prisma generate
npx prisma db push
```


run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## DB diagram
```mermaid　
erDiagram

  members {
    int id PK
    string name
    string email
    boolean isValid
    datetime createdAt
    datetime updatedAt
  }

  meetings {
    int id PK
    date date
    int chairId FK
    datetime createdAt
    datetime updatedAt
  }

  agendas {
    int id PK
    int meetingId FK
    string title
    int speakerId FK
    datetime createdAt
    datetime updatedAt
  }

  members ||..o{ agendas : "発表する"
  members ||..o{ meetings : "Chairを担当する"
  meetings ||--o{ agendas : "発表を含む"
```


# 
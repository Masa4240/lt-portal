FROM node:24-alpine

WORKDIR /nextjs

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "start"]

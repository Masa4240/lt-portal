FROM node:24-alpine

WORKDIR /nextjs

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]

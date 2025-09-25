FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nest build gateway

EXPOSE 4532

CMD ["node", "dist/apps/gateway/main.js"]

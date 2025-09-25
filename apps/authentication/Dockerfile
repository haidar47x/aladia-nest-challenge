FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nest build authentication
CMD ["node", "dist/apps/authentication/main.js"]

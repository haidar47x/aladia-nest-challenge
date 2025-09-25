FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --workspace=authentication
CMD ["node", "dist/apps/authentication/main.js"]

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production    # <-- IM CONTAINER bauen!
RUN apk add --no-cache mongodb-tools

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

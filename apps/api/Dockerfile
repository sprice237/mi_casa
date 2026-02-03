FROM node:24.13.0-alpine
RUN apk add openssl
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build -w packages --if-present 
WORKDIR /app/apps/api
RUN npm run build

CMD ["node", "dist/index.js"]
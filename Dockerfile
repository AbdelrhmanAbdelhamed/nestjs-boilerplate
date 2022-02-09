FROM node:16-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
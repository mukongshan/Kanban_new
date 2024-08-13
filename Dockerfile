FROM node:18 AS build
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

RUN apk add --no-cache tzdata
ENV TZ="Asia/Shanghai"
RUN npm install --production

EXPOSE 5173

CMD ["npm", "run", "start"]

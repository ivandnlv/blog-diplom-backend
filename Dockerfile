# Dockerfile
FROM node:20

# Рабочая директория внутри контейнера
WORKDIR /usr/src/app

# Копируем только package*.json для кешируемой установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем Prisma-схему (нужна для generate на этапе сборки)
COPY prisma ./prisma

# Копируем остальной код
COPY . .

# Генерируем Prisma Client (без подключения к БД)
RUN npx prisma generate

# Сборка NestJS в папку dist
RUN npm run build

# Контейнер будет слушать 3000 порт
EXPOSE 3000

# На старте контейнера:
# 1) применяем схему к БД (db push)
# 2) запускаем собранный NestJS
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]

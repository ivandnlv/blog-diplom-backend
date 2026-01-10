-- 1) Добавляем колонку как NULLABLE
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

-- 2) Заполняем username для существующих пользователей
-- Вариант A: из email (до @)
UPDATE "User"
SET "username" = split_part("email", '@', 1)
WHERE "username" IS NULL;

-- 3) Если вдруг есть дубли (например одинаковые локальные части),
-- делаем username уникальным, добавив суффикс по id
UPDATE "User"
SET "username" = "username" || '_' || "id"
WHERE "username" IN (
    SELECT "username"
    FROM "User"
    GROUP BY "username"
    HAVING COUNT(*) > 1
);

-- 4) Теперь делаем колонку обязательной
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- 5) И добавляем unique индекс/ограничение
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

// prisma/seed.ts
import 'dotenv/config';
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();

  const adminEmail = process.env?.ADMIN_EMAIL ?? 'admin@admin.com';
  const adminPassword = process.env?.ADMIN_PASSWORD ?? 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Важно: имя таблицы и колонок совпадает с тем, что у тебя в БД: "User"
  const query = `
    INSERT INTO "User" ("email","username","avatarUrl","passwordHash","role","createdAt","updatedAt")
    VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
    ON CONFLICT ("email") DO NOTHING
  `;

  await client.query(query, [adminEmail, passwordHash, 'ADMIN']);

  await client.end();

  console.log('Admin user seeded:', adminEmail);
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});

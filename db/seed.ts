import {PrismaClient} from '@/lib/generated/prisma/client';
import sampleData from "./sample-data";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { auth } from '@/lib/auth'; 
import { randomUUID } from 'crypto';

async function main(){

    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
    });

    const prisma = new PrismaClient({
        adapter,
    });
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({data: sampleData.products});

    // BetterAuthの内部コンテキストを取得（パスワードハッシュ関数を借りる）
    const ctx = await auth.$context;

    for (const u of sampleData.users) {
        const { password, ...userData } = u;

        const user = await prisma.user.create({ data: userData });

        const hashedPassword = await ctx.password.hash(password);

        await prisma.account.create({
            data: {
                id: randomUUID(),
                accountId: user.id, // credentialプロバイダではuserIdと同値にするのが一般的
                providerId: 'credential',
                userId: user.id,
                password: hashedPassword,
            },
        });
    }

    console.log('Database seeded successfully');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
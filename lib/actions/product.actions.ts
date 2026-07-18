'use server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { prisma } from '@/db/prisma';

// Get latest products
export async function getLatestProducts(){
       const adapter = new PrismaPg({
           connectionString: process.env.DATABASE_URL!,
       });
   
       const prisma = new PrismaClient({
           adapter,
       }); 

       const data = await prisma.product.findMany({
            take: LATEST_PRODUCTS_LIMIT,
            orderBy:{ createdAt: 'desc'}
        });

        return convertToPlainObject(data);
}


// Get single product by it's slug
export async function getProductBySlug(slug: string){
    return await prisma.product.findFirst(
        {where:{slug: slug}},
    )
}
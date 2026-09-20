'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema} from "../validators";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { ShippingAddress } from "@/types";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData){
    try{
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })

        await auth.api.signInEmail({
            body:{
                email:user.email,
                password:user.password
            },
            headers: await headers(),
        })

        const callbackUrl = formData.get("callbackUrl");
        redirect(typeof callbackUrl === 'string' && callbackUrl ? callbackUrl : '/');

    } catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        return { success: false, message: formatError(error) };
    }
}

// Sign user out
export async function signOutUser() {
    await auth.api.signOut({
        headers: await headers(),
    });

    // 次にこのブラウザを使う人に、前の人のカートが引き継がれないよう
    // 新しい sessionCartId を即座に発行し直す
    (await cookies()).set('sessionCartId', crypto.randomUUID());
}

//Sign up user
export async function signUpUser(prevState: unknown, formData: FormData){
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        })

        await auth.api.signUpEmail({
            body:{
                name: user.name,
                email: user.email,
                password: user.password,
            },
            headers: await headers(),
        });

        const callbackUrl = formData.get("callbackUrl");
        redirect(typeof callbackUrl === 'string' && callbackUrl ? callbackUrl : '/');

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) };
    }
}

// Get user by the ID
export async function getUserByID(userId: string){
    const user = await prisma.user.findFirst({
        where: {id: userId}
    })
    if(!user) throw new Error('User not found');
    return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress){
    try{
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUser = await prisma.user.findFirst({
            where:{id: session?.user?.id}
        });

        if(!currentUser) throw new Error('User not found');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: {id: currentUser.id},
            data: {address}
        });

        return {
            success: true,
            message: 'User updated successfully ',
        };

    } catch (error) {
        return { success: false, message: formatError(error)};
    }
}
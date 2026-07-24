'use server';

import { signInFormSchema } from "../validators";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData){
    console.log("yyyyyy");
    try{    
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })
        console.log("sssssssssss");
        console.log('user.email', user.email);
        console.log('user.password', user.password);

        await auth.api.signInEmail({
            body:{
                email:user.email, 
                password:user.password
            }
        })
        console.log("fffffffff");
        return {success: true, message: 'Signed in successfully'};
    } catch(error){
        console.error(error);
        if(isRedirectError(error)){
            console.log('aaaaaaa');
            throw error;
        }
        console.log('bbbbb');
        return { success: false, message: 'Invalid email or password'}
    }
}

// Sign user out
export async function signOutUser() {
    await auth.api.signOut({
        headers: await headers(),
    });
}
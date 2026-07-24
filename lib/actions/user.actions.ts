'use server';

import { signInFormSchema } from "../validators";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";

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
            }
        })
        return {success: true, message: 'Signed in successfully'};
    } catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        return { success: false, message: 'Invalid email or password'}
    }
}

// Sign user out
export async function signOutUser() {
    await auth.api.signOut({
        headers: await headers(),
    });
}
'use server';

import { signInFormSchema, signUpFormSchema} from "../validators";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { formatError } from "../utils";

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

        const callbackUrl = formData.get("callbackUrl");
        redirect(typeof callbackUrl === 'string' && callbackUrl ? callbackUrl : '/');

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
            }
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
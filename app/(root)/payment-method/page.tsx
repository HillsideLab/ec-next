import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserByID } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: 'Select Payment Method',
};


const PaymentMethodPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const userId = session?.user?.id;
    if(!userId) throw new Error('Ueer not foune');

    const user = await getUserByID(userId);

    return (
    <>
        <CheckoutSteps current={2}/>
        <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
    </>
    );
}

export default PaymentMethodPage;
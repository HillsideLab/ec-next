import { auth } from '@/lib/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserByID } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { headers } from "next/headers";


export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async() => {
    const cart = await getMyCart();
    if(!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if(!userId) throw new Error('No user ID');

    const user = getUserByID(userId);

    return ( <>Address</> );
}

export default ShippingAddressPage;
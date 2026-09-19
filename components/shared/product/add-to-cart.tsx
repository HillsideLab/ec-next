'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "@/components/ui/toast";

const AddToCart = ({ cart, item }:{ cart?: Cart, item: CartItem }) => {
    const router = useRouter();
    const handleAddToCart = async () =>{
        const res = await addItemToCart(item);

        if (!res) {
            toast.add({
                type: "error",
                description: "Something went wrong. Please try again.",
            });
            return;
        }

        if(!res.success){
            toast.add({
                type: "error",
                description: res.message,
            });
            return;
        }

        // Handle success add to cart
        const id = toast.add({
            description: res.message,
            actionProps: {
                children: "Go To Cart",
                className:
                "bg-primary text-white hover:bg-gray-800",

                onClick: () => {
                toast.close(id)
                router.push("/cart")
                },
            },
        })
    }

    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        const res = await removeItemFromCart(item.productId);

        toast.add({
            type: res.success ? 'success' : 'error',
            description: res.message,
        });

        return;
    };

    // Check if item in cart
    const existItem = cart && cart.items.find((x)=> x.productId === item.productId);

    return  existItem? (
        <div>
            <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
                <Minus className="h-4 w-4"/>
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button type="button" variant="outline" onClick={handleAddToCart}>
                <Plus className="h-4 w-4"/>
            </Button>
        </div>
    ):(
        <Button
            className="w-full"
            type="button"
            onClick={handleAddToCart}
        >
            <Plus/> Add To Cart
        </Button>
    );
}

export default AddToCart;
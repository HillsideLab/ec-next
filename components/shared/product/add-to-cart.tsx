'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "@/components/ui/toast";

const AddToCart = ({ item }:{ item: CartItem }) => {
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
    return (
        <Button
            className="w-full"
            type="button"
            onClick={handleAddToCart}
        >
            Add To Cart
        </Button>
    );
}

export default AddToCart;
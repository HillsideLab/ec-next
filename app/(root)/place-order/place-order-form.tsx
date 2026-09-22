"use client";

import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Check className="w-4 h-4" />
      )}{" "}
      Place Order
    </Button>
  );
};

const PlaceOrderForm = () => {
  const router = useRouter();
  const handleAction = async () => {
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form action={handleAction} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;

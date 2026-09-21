'use client';
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from "@/lib/constants";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldTitle,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';


const PaymentMethodForm = ({preferredPaymentMethod}:{preferredPaymentMethod: string | null}) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        },
      });
    const [isPending, startTransition] = useTransition();
    const onSubmit = async (values: z.infer<typeof paymentMethodSchema>)=>{
        startTransition(async()=>{
            const res = await updateUserPaymentMethod(values);
            toast.add({
                type: res.success ? 'success' : 'error',
                description: res.message,
            });

            if (!res.success) {
            return;
            }

            router.push('/place-order');
        })
        return;
    };
    return (
        <div className='max-w-md mx-auto space-y-4'>
            <h1 className='h2-bold mt-4'>Payment Method</h1>

            <p className='text-sm text-muted-foreground'>
                Please select a pament method
            </p>

            <form
                method='post'
                className='space-y-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col md:flex-row gap-5">
                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name='type'
                            render={({ field, fieldState }) => (
                                <>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-2"
                                    >
                                        {PAYMENT_METHODS.map((paymentMethod) => (
                                            <FieldLabel
                                                key={paymentMethod}
                                                htmlFor={paymentMethod}
                                            >
                                                <Field orientation="horizontal">
                                                    <FieldTitle>
                                                        {paymentMethod}
                                                    </FieldTitle>
                                                    <RadioGroupItem
                                                        value={paymentMethod}
                                                        id={paymentMethod}
                                                    />
                                                </Field>
                                            </FieldLabel>
                                        ))}
                                    </RadioGroup>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </>
                            )}
                        />
                    </FieldGroup>
                </div>
                <div className='flex gap-2'>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? (
                        <Loader className='w-4 h-4 animate-spin' />
                        ) : (
                        <ArrowRight className='w-4 h-4' />
                        )}{' '}
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PaymentMethodForm;
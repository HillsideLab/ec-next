'use client';

import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/toast";
import { useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader } from 'lucide-react';

import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { updateUserAddress } from '@/lib/actions/user.actions';

import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<
    z.infer<typeof shippingAddressSchema>
  > = async (values) => {
    startTransition(async () => {
        const res = await updateUserAddress(values);

        toast.add({
            type: res.success ? 'success' : 'error',
            description: res.message,
        });

        if (!res.success) {
        return;
        }

      router.push('/payment-method');
    });
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h1 className='h2-bold mt-4'>Shipping Address</h1>

      <p className='text-sm text-muted-foreground'>
        Please enter an address to ship to
      </p>

      <form
        method='post'
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name='fullName'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='fullName'>
                  Full Name
                </FieldLabel>

                <Input
                  {...field}
                  id='fullName'
                  placeholder='Enter full name'
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='streetAddress'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='streetAddress'>
                  Address
                </FieldLabel>

                <Input
                  {...field}
                  id='streetAddress'
                  placeholder='Enter address'
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='city'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='city'>
                  City
                </FieldLabel>

                <Input
                  {...field}
                  id='city'
                  placeholder='Enter city'
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='postalCode'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='postalCode'>
                  Postal Code
                </FieldLabel>

                <Input
                  {...field}
                  id='postalCode'
                  placeholder='Enter postal code'
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='country'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='country'>
                  Country
                </FieldLabel>

                <Input
                  {...field}
                  id='country'
                  placeholder='Enter country'
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

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
};

export default ShippingAddressForm;
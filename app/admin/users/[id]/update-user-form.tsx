"use client";

import { updateUserSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/user.actions";

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) {
        toast.add({
          type: "error",
          description: res.message,
        });
        // For Demo User
        if (user.name === "Demo User") {
          form.reset();
        }
        return;
      }

      toast.add({
        description: res.message,
      });
      form.reset();
      router.push("/admin/users");
    } catch (error) {
      toast.add({
        type: "error",
        description: (error as Error).message,
      });
    }
    return;
  };
  return (
    <>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div>
          {/* Email*/}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Email</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                disabled={true}
                placeholder="Enter user email"
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </FieldContent>
          </Field>
        </div>
        <div>
          {/* Name*/}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Enter user name"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>
        </div>
        {/* Role*/}
        <Field className="w-full">
          <FieldLabel htmlFor="role">Role</FieldLabel>

          <FieldContent>
            <Select
              value={form.watch("role")}
              onValueChange={(value) => {
                if (value !== null) {
                  form.setValue("role", value);
                }
              }}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.role]} />
          </FieldContent>
        </Field>
        <div className="flex-between">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update User"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default UpdateUserForm;

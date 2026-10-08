"usse client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { insertReviewSchema } from "@/lib/validators";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewFormDefaultValues } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarIcon } from "lucide-react";
import {
  createUpdateReview,
  getReviewByProductId,
} from "@/lib/actions/review.action";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<
    z.input<typeof insertReviewSchema>,
    unknown,
    z.output<typeof insertReviewSchema>
  >({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  // Open Form Handler
  const handleOpenForm = async () => {
    form.setValue("productId", productId);
    form.setValue("userId", userId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
    }

    setOpen(true);
  };

  // Submit Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values,
  ) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success) {
      return toast.add({
        type: "error",
        description: res.message,
      });
    }

    setOpen(false);

    onReviewSubmitted();

    toast.add({
      description: res.message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default" className="mt-2">
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts with other customers
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Enter title"
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Enter description"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            <Controller
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Rating</FieldLabel>

                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {String(field.value)}{" "}
                        <StarIcon className="inline h-4 w-4" />
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          <span className="w-4 text-center">{index + 1}</span>
                          <StarIcon className="h-4 w-4" />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;

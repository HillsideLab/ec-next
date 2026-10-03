"use client";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { productSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import slugify from "slugify";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const form = useForm<
    z.input<typeof productSchema>,
    unknown,
    z.output<typeof productSchema>
  >({
    resolver: zodResolver(productSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof productSchema>> = async (
    values,
  ) => {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.add({
          type: "error",
          description: res.message,
        });
      } else {
        toast.add({
          description: res.message,
        });
        router.push("/admin/products");
      }
    }

    // On Update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct(productId, values);

      if (!res.success) {
        toast.add({
          type: "error",
          description: res.message,
        });
      } else {
        toast.add({
          description: res.message,
        });
        router.push("/admin/products");
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Enter product name"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>
          {/* Slug */}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Slug</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id="slug"
                  placeholder="Enter slug"
                  {...form.register("slug")}
                />
                <Button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                  onClick={() => {
                    form.setValue(
                      "slug",
                      slugify(form.getValues("name"), { lower: true }),
                    );
                  }}
                >
                  Generate
                </Button>
              </div>
              <FieldError errors={[form.formState.errors.slug]} />
            </FieldContent>
          </Field>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* category */}
          <Field className="w-full">
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <FieldContent>
              <Input
                id="category"
                placeholder="Enter category"
                {...form.register("category")}
              />
              <FieldError errors={[form.formState.errors.category]} />
            </FieldContent>
          </Field>
          {/* Brand */}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Brand</FieldLabel>
            <FieldContent>
              <Input
                id="brand"
                placeholder="Enter brand"
                {...form.register("brand")}
              />
              <FieldError errors={[form.formState.errors.brand]} />
            </FieldContent>
          </Field>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <Field className="w-full">
            <FieldLabel htmlFor="category">Price</FieldLabel>
            <FieldContent>
              <Input
                id="price"
                placeholder="Enter price"
                {...form.register("price")}
              />
              <FieldError errors={[form.formState.errors.price]} />
            </FieldContent>
          </Field>
          {/* Stock */}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Stock</FieldLabel>
            <FieldContent>
              <Input
                id="stock"
                placeholder="Enter stock"
                {...form.register("stock")}
              />
              <FieldError errors={[form.formState.errors.stock]} />
            </FieldContent>
          </Field>
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* Images */}
          <Field className="w-full">
            <FieldLabel>Images</FieldLabel>

            <Card>
              <CardContent className="space-y-2 mt-2 min-h-48">
                <div className="flex-start space-x-2">
                  {images.map((image: string) => (
                    <Image
                      key={image}
                      src={image}
                      alt="product image"
                      className="w-20 h-20 object-cover object-center rounded-sm"
                      width={100}
                      height={100}
                    />
                  ))}

                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      form.setValue("images", [...images, res[0].url]);
                    }}
                    onUploadError={(error) => {
                      toast.add({
                        title: "Upload Error",
                        description: error.message,
                        type: "error",
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <FieldError errors={[form.formState.errors.images]} />
          </Field>
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <Field orientation="horizontal">
                <Checkbox
                  id="isFeatured"
                  checked={form.watch("isFeatured")}
                  onCheckedChange={(checked) =>
                    form.setValue("isFeatured", checked === true)
                  }
                />
                <FieldLabel htmlFor="isFeatured">Is Featured?</FieldLabel>
              </Field>

              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error) => {
                    toast.add({
                      title: "Upload Error",
                      description: error.message,
                      type: "error",
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <Field className="w-full">
            <FieldLabel htmlFor="name">Description</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                className="resize-none"
                placeholder="Enter product description"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;

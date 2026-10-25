"use server";
import { convertToPlainObject, formatError, isDemoUser } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "../auth-guard";
import { productSchema } from "../validators";
import z from "zod";
import { Prisma } from "@/lib/generated/prisma/client";
import { UTApi } from "uploadthing/server";

// Get the UploadThing file key from a file URL (e.g. https://utfs.io/f/<key>)
function getUploadThingKey(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname !== "utfs.io" && !hostname.endsWith(".ufs.sh")) return null;
    return pathname.startsWith("/f/") ? pathname.slice("/f/".length) : null;
  } catch {
    // Relative paths such as seed images are not UploadThing files
    return null;
  }
}

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug: slug } });
}

// Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({ where: { id: productId } });

  return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price fileter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.product.count();
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const session = await requireAdminAction();

    // For Demo User
    if (isDemoUser(session.user.id)) {
      return {
        success: false,
        message: "Demo User cannot delete a product",
      };
    }

    const productExists = await prisma.product.findFirst({
      where: { id: id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof productSchema>) {
  try {
    const session = await requireAdminAction();

    // For Demo User
    if (isDemoUser(session.user.id)) {
      return {
        success: false,
        message: "Demo User cannot create a product",
      };
    }

    const product = productSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update a product
export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>,
) {
  try {
    const session = await requireAdminAction();

    // For Demo User
    if (isDemoUser(session.user.id)) {
      return {
        success: false,
        message: "Demo User cannot update products",
      };
    }

    const product = productSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: { id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete a product image or banner from UploadThing and the product
export async function deleteProductImage({
  productId,
  url,
  field,
}: {
  // Undefined while creating a product: the image is not saved to any product yet
  productId?: string;
  url: string;
  field: "images" | "banner";
}) {
  try {
    const session = await requireAdminAction();

    // For Demo User
    if (isDemoUser(session.user.id)) {
      return {
        success: false,
        message: "Demo User cannot delete images",
      };
    }

    const product = productId
      ? await prisma.product.findFirst({ where: { id: productId } })
      : null;
    if (productId && !product) throw new Error("Product not found");

    // False for an upload that has not been saved to the product yet
    const isSaved =
      product &&
      (field === "images"
        ? product.images.includes(url)
        : product.banner === url);

    if (isSaved) {
      if (field === "images" && product.images.length <= 1) {
        throw new Error("Product must have at least one image");
      }
    } else {
      // Never delete a file that another product still uses
      const usedBy = await prisma.product.findFirst({
        where: { OR: [{ images: { has: url } }, { banner: url }] },
      });
      if (usedBy) throw new Error("Image is used by another product");
    }

    // Delete the file first, so a failure leaves the product unchanged
    const key = getUploadThingKey(url);
    if (key) {
      const { success } = await new UTApi().deleteFiles(key);
      if (!success) throw new Error("Failed to delete the image file");
    }

    if (isSaved) {
      await prisma.product.update({
        where: { id: product.id },
        data:
          field === "images"
            ? { images: product.images.filter((image) => image !== url) }
            : { banner: null },
      });
      revalidatePath("/admin/products");
    }

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all categories
export async function getAllCategories() {
  const data = prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  return data;
}

// Get featured Products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}

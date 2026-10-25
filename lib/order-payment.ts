import { prisma } from "@/db/prisma";
import { PaymentResult, ShippingAddress } from "@/types";
import { sendPurchaseReceipt } from "@/email";

// Mark an order as paid, update stock and clear the user's cart.
// Not a server action: callers must verify the payment or the caller's role first.
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });
  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  // Transaction to update order, stock, and clear the user's cart
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });

    // オンライン決済(PayPal / Stripe)の場合、確定は支払い成功のこのタイミング。ここでその注文を出したユーザーのカートを空にする。
    // (Cash on Deliveryはcreate Order時点で既に空になっているため、ここで実行しても実質的に何も起きず害はない)
    const cart = await tx.cart.findFirst({
      where: { userId: order.userId },
    });
    if (cart) {
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
    }
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  if (!updatedOrder) throw new Error("Order not found");

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    },
  });
}

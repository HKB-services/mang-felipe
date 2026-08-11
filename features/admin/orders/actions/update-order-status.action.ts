"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ActionError, authActionClient } from "@/lib/safe.action";
import { ROLES } from "@/features/admin/users/schema/user.schema";
import { sendOrderStatusUpdateEmail } from "@/features/orders/server/send-order-emails";

const UpdateOrderStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending_review", "confirmed", "rejected", "cancelled"]),
});

function assertSuperAdmin(roles: string[] | undefined) {
  if (!roles?.includes(ROLES.SUPER_ADMIN)) throw new ActionError("Forbidden");
}

export const updateOrderStatusAction = authActionClient
  .metadata({ actionName: "updateOrderStatus" })
  .inputSchema(UpdateOrderStatusSchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles);
    const userId = ctx.session?.user.id;
    if (!userId) throw new ActionError("Unauthorized");

    const existing = await prisma.order.findUnique({
      where: { id: parsedInput.id },
      select: { id: true, status: true },
    });

    if (!existing) throw new ActionError("Order not found");

    if (existing.status === parsedInput.status) {
      return {
        success: true as const,
        order: { id: existing.id, status: existing.status },
        emailWarning: null,
      };
    }

    const data =
      parsedInput.status === "pending_review"
        ? {
            status: parsedInput.status,
            reviewedAt: null,
            reviewedByUserId: null,
          }
        : {
            status: parsedInput.status,
            reviewedAt: new Date(),
            reviewedByUserId: userId,
          };

    const order = await prisma.order.update({
      where: { id: parsedInput.id },
      data,
      select: {
        id: true,
        status: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        fulfillmentDate: true,
        fulfillmentSlot: true,
        fulfillmentType: true,
      },
    });

    let emailWarning: string | null = null;

    if (order.customerEmail) {
      const result = await sendOrderStatusUpdateEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        fulfillmentDate: order.fulfillmentDate,
        fulfillmentSlot: order.fulfillmentSlot,
        fulfillmentType: order.fulfillmentType,
        orderNumber: order.orderNumber,
        status: order.status,
      });

      if (!result.success) {
        emailWarning = `Order status updated, but the email failed to send. ${result.message}`;
      }
    }

    return {
      success: true as const,
      order: { id: order.id, status: order.status },
      emailWarning,
    };
  });

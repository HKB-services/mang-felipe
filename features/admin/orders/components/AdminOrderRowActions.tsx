"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  IconCheck,
  IconDots,
  IconEye,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { sileo } from "sileo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/app.routes";
import { onActionError } from "@/lib/action-utils";
import { updateOrderStatusAction } from "../actions/update-order-status.action";
import { orderStatusLabel } from "../utils/order-status";
import type { AdminOrderListItem } from "../server/admin-list-orders";

type OrderStatus = AdminOrderListItem["status"];

type AdminOrderRowActionsProps = {
  order: AdminOrderListItem;
};

const statusIcon = {
  pending_review: IconRefresh,
  confirmed: IconCheck,
  rejected: IconX,
  cancelled: IconTrash,
} as const;

export function AdminOrderRowActions({ order }: AdminOrderRowActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const { execute, isExecuting } = useAction(updateOrderStatusAction, {
    onSuccess: ({ data }) => {
      if (!data?.success) return;
      void queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      sileo.success({
        title: `Order marked ${orderStatusLabel[data.order.status]}`,
      });
      if (data.emailWarning) {
        sileo.error({ title: data.emailWarning });
      }
      setConfirmCancelOpen(false);
    },
    onError: onActionError,
  });

  const orderHref = `${ROUTES.ADMIN_ORDERS}/${order.id}`;
  const updateStatus = (status: OrderStatus) => {
    if (status === order.status) return;
    execute({ id: order.id, status });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for order ${order.orderNumber}`}
            />
          }
        >
          <IconDots className="size-4" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => router.push(orderHref)}>
            <IconEye />
            View order
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconRefresh />
              Update status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              {(Object.keys(orderStatusLabel) as OrderStatus[]).map(
                (status) => {
                  const Icon = statusIcon[status];
                  return (
                    <DropdownMenuItem
                      key={status}
                      disabled={isExecuting || status === order.status}
                      onClick={() => updateStatus(status)}
                    >
                      <Icon />
                      {orderStatusLabel[status]}
                    </DropdownMenuItem>
                  );
                },
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Deletion</DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              disabled={isExecuting || order.status === "cancelled"}
              onClick={() => setConfirmCancelOpen(true)}
            >
              <IconTrash />
              Delete order
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete order?</DialogTitle>
            <DialogDescription>
              This will move {order.orderNumber} to Cancelled. Order records and
              payment proof stay preserved for review.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={isExecuting} />}
            >
              Keep order
            </DialogClose>
            <Button
              variant="destructive"
              isLoading={isExecuting}
              onClick={() => updateStatus("cancelled")}
            >
              Delete order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

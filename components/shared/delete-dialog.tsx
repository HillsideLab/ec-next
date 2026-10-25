"use client";

import { useState, useTransition } from "react";
import { toast } from "@/components/ui/toast";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DeleteDialog = ({
  id,
  action,
  trigger,
  onSuccess,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  // Custom trigger element; defaults to a "Delete" button
  trigger?: React.ReactElement;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);
      setOpen(false);
      if (!res.success) {
        toast.add({
          type: "error",
          description: res.message,
        });
      } else {
        toast.add({
          description: res.message,
        });
        onSuccess?.();
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <AlertDialogTrigger render={trigger} />
      ) : (
        <AlertDialogTrigger
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "destructive",
            }),
            "ml-2",
          )}
        >
          Delete
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can&apos;t be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({
              size: "sm",
              variant: "outline",
            })}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteDialog;

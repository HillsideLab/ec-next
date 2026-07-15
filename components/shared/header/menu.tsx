import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import ModeToggle from "./mode-toggle";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Link href="/cart" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ShoppingCart />
          Cart
        </Link>
        <Link href="/sign-in" className={cn(buttonVariants())}>
          <UserIcon />
          Sign In
        </Link>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Link
              href="/cart"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <ShoppingCart />
              Cart
            </Link>
            <Link href="/sign-in" className={cn(buttonVariants())}>
              <UserIcon />
              Sign In
            </Link>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default menu;

import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserButton = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
      <Link href="/sign-in" className={cn(buttonVariants())}>
        <UserIcon />
        Sign In
      </Link>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 item-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 rounded-full bg-gray-200",
          )}
        >
          {firstInitial}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="text-sm font-medium leading-none">
                  {session.user?.name}
                </div>
                <div className="text-sm text-muted-foreground leading-none">
                  {session.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <form action={signOutUser} className="w-full">
            <Button
              type="submit"
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

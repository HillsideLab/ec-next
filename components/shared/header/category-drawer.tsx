import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategroyDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger
        render={
          <Button variant="outline">
            <MenuIcon />
          </Button>
        }
      ></DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>

          <div className="space-y-1 mt-4">
            {categories.map((x) => (
              <DrawerClose
                key={x.category}
                render={<Link href={`/search?category=${x.category}`} />}
              >
                <Button variant="ghost" className="w-full justify-start">
                  {x.category}({x._count})
                </Button>
              </DrawerClose>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategroyDrawer;

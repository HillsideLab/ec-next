import { Button } from "@/components/ui/button";
import Link from "next/link";

const ViewAllProductsButton = () => {
  return (
    <div className="flex items-center justify-center my-8">
      <Button
        nativeButton={false}
        render={<Link href="/search" />}
        className="px-8 py-4 text-lg font-semibold"
      >
        View All Products
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;

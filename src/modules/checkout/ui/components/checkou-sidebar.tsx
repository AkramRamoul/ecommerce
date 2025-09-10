import { Button } from "@/components/ui/button";
import { CircleXIcon } from "lucide-react";

interface Props {
  totalPrice: number;
  onPurchase: () => void;
  isCanceled: boolean;
  disabled: boolean;
}
export const CheckoutSideBar = ({
  totalPrice,
  onPurchase,
  isCanceled,
  disabled,
}: Props) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium text-lg">Total</h4>
        <p className="font-medium text-lg">DA {totalPrice.toFixed(2)}</p>
      </div>
      <div className="p-4 flex items-center justify-center">
        <Button
          variant={"elevated"}
          disabled={disabled}
          onClick={onPurchase}
          size="lg"
          className="w-full text-base text-white bg-primary hover:bg-rose-400
          hover:text-primary
          "
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className="p-4 flex justify-center items-center border-t">
          <div className="w-full bg-red-100 font-medium px-4 py-3 rounded flex items-center">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span className="">Checkout failed. Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

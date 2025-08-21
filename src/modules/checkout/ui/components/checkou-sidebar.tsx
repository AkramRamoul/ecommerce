interface Props {
  totalPrice: number;
  oncheckout: () => void;
  isCanceled: boolean;
  isPending: boolean;
}
export const CheckoutSideBar = ({
  totalPrice,
  oncheckout,
  isCanceled,
  isPending,
}: Props) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium text-lg">Total</h4>
        <p className="font-medium text-lg">DA {totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

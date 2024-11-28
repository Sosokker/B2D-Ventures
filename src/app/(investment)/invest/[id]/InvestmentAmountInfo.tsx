import { Separator } from "@/components/ui/separator";

export function InvestmentAmountInfo({ amount }: { amount: number }) {
  return (
    <div className="mt-4">
      <span className="flex flex-row justify-between">
        <p>Amount to be paid</p>
        <p>${amount}</p>
      </span>
      <Separator />
    </div>
  );
}

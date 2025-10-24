import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ExpenseSummaryProps {
  totalClaimed: number;
  advanceTaken?: number;
  totalApproved?: number;
  showApproved?: boolean;
}

export const ExpenseSummary = ({
  totalClaimed,
  advanceTaken = 25000, // Fixed allocated amount
  totalApproved,
  showApproved = false,
}: ExpenseSummaryProps) => {
  const balance = showApproved
    ? (totalApproved || 0) - advanceTaken
    : totalClaimed - advanceTaken;

  const isPayable = balance >= 0;

  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Settlement Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Claimed</span>
          <span className="font-semibold text-foreground">₹{totalClaimed.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Allocated Amount</span>
          <span className="font-semibold text-foreground">₹{advanceTaken.toFixed(2)}</span>
        </div>
        {showApproved && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Approved</span>
            <span className="font-semibold text-success">₹{totalApproved?.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium text-foreground">
            {isPayable ? "Balance Payable" : "Balance Recoverable"}
          </span>
          <span
            className={`text-lg font-bold ${
              isPayable ? "text-success" : "text-destructive"
            }`}
          >
            ₹{Math.abs(balance).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};

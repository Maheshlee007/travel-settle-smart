import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
}

interface LoadExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: ExpenseItem[];
  onImport: () => void;
}

export const LoadExpensesDialog = ({ open, onOpenChange, expenses, onImport }: LoadExpensesDialogProps) => {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getExpenseTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      travel: "bg-blue-500",
      lodging: "bg-purple-500",
      meals: "bg-orange-500",
      conveyance: "bg-green-500",
      others: "bg-gray-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Expenses</DialogTitle>
          <DialogDescription>
            Review and import {expenses.length} saved expense{expenses.length > 1 ? 's' : ''} (Total: ₹{totalAmount.toFixed(2)})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.date}</TableCell>
                    <TableCell>
                      <Badge className={getExpenseTypeBadge(expense.type)}>
                        {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">₹{expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{expense.remarks || "-"}</TableCell>
                    <TableCell>
                      {expense.image ? (
                        <Badge variant="outline">Attached</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No receipt</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onImport} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Import All Expenses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

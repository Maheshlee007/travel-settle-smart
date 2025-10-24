import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useTravelSettlement } from "@/context/TravelSettlementContext";

interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
  travelRequestNumber: string;
}

interface LoadExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: ExpenseItem[];
  travelRequestNumber: string;
  onImport: (selectedExpenses: ExpenseItem[]) => void;
}

export const LoadExpensesDialog = ({ open, onOpenChange, expenses, travelRequestNumber, onImport }: LoadExpensesDialogProps) => {
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  
  // Reset selection when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedExpenseIds([]);
    }
    onOpenChange(newOpen);
  };
  
  // Show all expenses since travel request number is now optional
  const filteredExpenses = expenses;
  const selectedExpenses = filteredExpenses.filter(exp => selectedExpenseIds.includes(exp.id));
  const totalAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleExpenseToggle = (expenseId: string, checked: boolean) => {
    if (checked) {
      setSelectedExpenseIds([...selectedExpenseIds, expenseId]);
    } else {
      setSelectedExpenseIds(selectedExpenseIds.filter(id => id !== expenseId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExpenseIds(filteredExpenses.map(exp => exp.id));
    } else {
      setSelectedExpenseIds([]);
    }
  };

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Expenses for {travelRequestNumber}</DialogTitle>
          <DialogDescription>
            Select expenses to add to settlement ({selectedExpenseIds.length} selected, Total: ₹{totalAmount.toFixed(2)})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedExpenseIds.length === filteredExpenses.length && filteredExpenses.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({filteredExpenses.length} expenses)
            </label>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedExpenseIds.includes(expense.id)}
                        onCheckedChange={(checked) => handleExpenseToggle(expense.id, checked as boolean)}
                      />
                    </TableCell>
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
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onImport(selectedExpenses);
                setSelectedExpenseIds([]);
                handleOpenChange(false);
              }} 
              className="bg-primary hover:bg-primary/90"
              disabled={selectedExpenses.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Import Selected ({selectedExpenses.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
import { toast } from "sonner";
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

interface Settlement {
  requestNumber: string;
  status: string;
  totalClaimed: number;
  totalApproved: number;
  totalPaid: number;
  financeReviewer: string;
  reviewDate: string;
  expenses: ExpenseItem[];
  isDraft?: boolean;
}

interface LoadExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: ExpenseItem[];
  travelRequestNumber: string;
  onImport: (selectedExpenses: ExpenseItem[]) => void;
}

export const LoadExpensesDialog = ({ open, onOpenChange, expenses, travelRequestNumber, onImport }: LoadExpensesDialogProps) => {
  const { state } = useTravelSettlement();
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("expenses");
  
  // Get unique expense types for filter
  const expenseTypes = [...new Set(expenses.map(exp => exp.type))];
  
  // Reset selection when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedExpenseIds([]);
      setSelectedDraftIds([]);
      setExpenseTypeFilter("all");
    }
    onOpenChange(newOpen);
  };
  
  // Filter expenses based on type
  const filteredExpenses = expenseTypeFilter === "all" 
    ? expenses 
    : expenses.filter(exp => exp.type === expenseTypeFilter);
    
  const selectedExpenses = filteredExpenses.filter(exp => selectedExpenseIds.includes(exp.id));
  const selectedDrafts = state.draftSettlements.filter(draft => selectedDraftIds.includes(draft.requestNumber));
  const totalExpenseAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDraftAmount = selectedDrafts.reduce((sum, draft) => sum + draft.totalClaimed, 0);

  const handleExpenseToggle = (expenseId: string, checked: boolean) => {
    const expense = filteredExpenses.find(exp => exp.id === expenseId);
    if (!expense) return;

    if (checked) {
      // Check if we already have expenses of a different type selected for the same travel request
      const currentlySelectedExpenses = filteredExpenses.filter(exp => selectedExpenseIds.includes(exp.id));
      const expensesInSameTravelRequest = currentlySelectedExpenses.filter(exp => exp.travelRequestNumber === expense.travelRequestNumber);
      
      if (expensesInSameTravelRequest.length > 0) {
        const existingType = expensesInSameTravelRequest[0].type;
        if (existingType !== expense.type) {
          toast.error(`For travel request ${expense.travelRequestNumber}, you can only select ${existingType} expenses. Cannot mix with ${expense.type}.`);
          return;
        }
      }
      
      // Also check if we have expenses from different travel requests with different types
      const currentTypes = [...new Set(currentlySelectedExpenses.map(exp => exp.type))];
      if (currentTypes.length > 0 && !currentTypes.includes(expense.type)) {
        toast.error(`You can only select expenses of one type at a time. Currently selected: ${currentTypes[0]}`);
        return;
      }
      
      setSelectedExpenseIds([...selectedExpenseIds, expenseId]);
    } else {
      setSelectedExpenseIds(selectedExpenseIds.filter(id => id !== expenseId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // If filter is applied to a specific type, select all of that type
      if (expenseTypeFilter !== "all") {
        setSelectedExpenseIds(filteredExpenses.map(exp => exp.id));
      } else {
        // If no filter, warn user they need to filter by type first
        toast.error("Please filter by a specific expense type first, then select all");
      }
    } else {
      setSelectedExpenseIds([]);
    }
  };

  const handleDraftToggle = (draftId: string, checked: boolean) => {
    if (checked) {
      setSelectedDraftIds([...selectedDraftIds, draftId]);
    } else {
      setSelectedDraftIds(selectedDraftIds.filter(id => id !== draftId));
    }
  };

  const handleSelectAllDrafts = (checked: boolean) => {
    if (checked) {
      setSelectedDraftIds(state.draftSettlements.map(draft => draft.requestNumber));
    } else {
      setSelectedDraftIds([]);
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

  const handleImport = () => {
    if (activeTab === "expenses") {
      onImport(selectedExpenses);
    } else {
      // Import expenses from selected drafts
      const draftExpenses = selectedDrafts.flatMap(draft => draft.expenses);
      onImport(draftExpenses);
    }
    setSelectedExpenseIds([]);
    setSelectedDraftIds([]);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Expenses & Settlements</DialogTitle>
          <DialogDescription>
            Select individual expenses or saved draft settlements to import
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger 
              value="expenses"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              All Expenses ({expenses.length})
            </TabsTrigger>
            <TabsTrigger 
              value="drafts"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Draft Settlements ({state.draftSettlements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="type-filter">Filter by Type:</Label>
                <Select value={expenseTypeFilter} onValueChange={setExpenseTypeFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {expenseTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                <Checkbox
                  id="select-all-expenses"
                  checked={selectedExpenseIds.length === filteredExpenses.length && filteredExpenses.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={expenseTypeFilter === "all"}
                />
                <label htmlFor="select-all-expenses" className="text-sm font-medium">
                  Select All ({filteredExpenses.length})
                  {expenseTypeFilter === "all" && (
                    <span className="text-xs text-muted-foreground block">Filter by type first</span>
                  )}
                </label>
              </div>
            </div>
            
            {selectedExpenseIds.length > 0 && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                Selected: {selectedExpenseIds.length} expenses, Total: ₹{totalExpenseAmount.toFixed(2)}
              </div>
            )}
            
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
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-drafts"
                checked={selectedDraftIds.length === state.draftSettlements.length && state.draftSettlements.length > 0}
                onCheckedChange={handleSelectAllDrafts}
              />
              <label htmlFor="select-all-drafts" className="text-sm font-medium">
                Select All ({state.draftSettlements.length} drafts)
              </label>
            </div>
            
            {selectedDraftIds.length > 0 && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                Selected: {selectedDraftIds.length} drafts, Total: ₹{totalDraftAmount.toFixed(2)}
              </div>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Request Number</TableHead>
                    <TableHead>Expense Types</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Expenses Count</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.draftSettlements.map((draft) => {
                    const expenseTypes = [...new Set(draft.expenses.map(exp => exp.type))];
                    return (
                      <TableRow key={draft.requestNumber}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDraftIds.includes(draft.requestNumber)}
                            onCheckedChange={(checked) => handleDraftToggle(draft.requestNumber, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{draft.requestNumber}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {expenseTypes.length > 0 ? (
                              expenseTypes.slice(0, 2).map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No expenses</span>
                            )}
                            {expenseTypes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{expenseTypes.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{draft.totalClaimed.toFixed(2)}</TableCell>
                        <TableCell>{draft.expenses.length} expenses</TableCell>
                        <TableCell className="text-muted-foreground">{draft.reviewDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            className="bg-primary hover:bg-primary/90"
            disabled={
              (activeTab === "expenses" && selectedExpenses.length === 0) ||
              (activeTab === "drafts" && selectedDrafts.length === 0)
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Import Selected (
            {activeTab === "expenses" 
              ? `${selectedExpenses.length} expenses` 
              : `${selectedDrafts.length} drafts`
            })
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Save, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
}

const ExpenseCapture = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [currentExpense, setCurrentExpense] = useState<Partial<ExpenseItem>>({
    type: "",
    amount: 0,
    date: "",
    remarks: "",
    image: null,
  });

  const handleCapture = () => {
    // Mock OCR extraction
    setCurrentExpense({
      ...currentExpense,
      amount: 1250,
      date: new Date().toISOString().split("T")[0],
      image: "receipt-placeholder.jpg",
    });
    toast.success("Receipt captured! Details extracted automatically.");
  };

  const handleSave = () => {
    if (!currentExpense.type || !currentExpense.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      type: currentExpense.type!,
      amount: currentExpense.amount!,
      date: currentExpense.date || new Date().toISOString().split("T")[0],
      remarks: currentExpense.remarks || "",
      image: currentExpense.image,
    };

    setExpenses([...expenses, newExpense]);
    setCurrentExpense({ type: "", amount: 0, date: "", remarks: "", image: null });
    toast.success("Expense saved locally");
  };

  const handleSync = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to sync");
      return;
    }
    toast.success(`${expenses.length} expenses synced successfully`);
    navigate("/travel-settlement");
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast.success("Expense deleted");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Add Travel Expense</h1>
          <p className="text-sm text-muted-foreground">Travel → Expense Capture</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button onClick={handleCapture} className="flex-1 h-24 bg-primary hover:bg-primary/90">
                <div className="flex flex-col items-center">
                  <Camera className="h-8 w-8 mb-2" />
                  <span>Capture Receipt</span>
                </div>
              </Button>
              <Button variant="outline" className="flex-1 h-24">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Upload Receipt</span>
                </div>
              </Button>
            </div>

            {currentExpense.image && (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Receipt Preview</span>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setCurrentExpense({ ...currentExpense, image: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="expense-type">Expense Type *</Label>
                <Select
                  value={currentExpense.type}
                  onValueChange={(value) => setCurrentExpense({ ...currentExpense, type: value })}
                >
                  <SelectTrigger id="expense-type">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="lodging">Lodging</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="conveyance">Conveyance</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={currentExpense.amount || ""}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentExpense.date}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={currentExpense.remarks}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, remarks: e.target.value })}
                  placeholder="Add any additional details..."
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Expense
            </Button>
          </div>
        </Card>

        {expenses.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Saved Expenses ({expenses.length})
            </h3>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{expense.type}</p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">₹{expense.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {expenses.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
          <div className="container mx-auto max-w-2xl">
            <Button onClick={handleSync} className="w-full bg-success hover:bg-success/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync {expenses.length} Expense{expenses.length > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCapture;

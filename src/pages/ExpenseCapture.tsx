import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Save, X, ArrowLeft, Edit2 } from "lucide-react";
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

const ExpenseCapture = () => {
  const navigate = useNavigate();
  const { state: { expenses }, dispatch } = useTravelSettlement();
  const [currentExpense, setCurrentExpense] = useState<Partial<ExpenseItem>>({
    type: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0], // Default to today's date
    remarks: "",
    image: null,
    travelRequestNumber: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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

    if (editingId) {
      // Update existing expense
      const updatedExpense: ExpenseItem = {
        id: editingId,
        type: currentExpense.type!,
        amount: currentExpense.amount!,
        date: currentExpense.date || new Date().toISOString().split("T")[0],
        remarks: currentExpense.remarks || "",
        image: currentExpense.image,
        travelRequestNumber: currentExpense.travelRequestNumber || "TR-2025-001",
      };

      dispatch({ type: 'DELETE_EXPENSE', payload: editingId });
      dispatch({ type: 'ADD_EXPENSE', payload: updatedExpense });
      setEditingId(null);
      toast.success("Expense updated successfully!");
    } else {
      // Add new expense
      const newExpense: ExpenseItem = {
        id: Date.now().toString(),
        type: currentExpense.type!,
        amount: currentExpense.amount!,
        date: currentExpense.date || new Date().toISOString().split("T")[0],
        remarks: currentExpense.remarks || "",
        image: currentExpense.image,
        travelRequestNumber: currentExpense.travelRequestNumber || "TR-2025-001",
      };

      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      toast.success("Expense saved successfully!");
    }

    handleReset();
  };

  const handleEdit = (expense: ExpenseItem) => {
    setCurrentExpense({
      type: expense.type,
      amount: expense.amount,
      date: expense.date,
      remarks: expense.remarks,
      image: expense.image,
      travelRequestNumber: expense.travelRequestNumber,
    });
    setEditingId(expense.id);
    toast.info("Expense loaded for editing");
  };

  const handleReset = () => {
    setCurrentExpense({ 
      type: "", 
      amount: 0, 
      date: new Date().toISOString().split("T")[0], 
      remarks: "", 
      image: null, 
      travelRequestNumber: "" 
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    toast.success("Expense deleted");
  };  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Add Travel Expense</h1>
          </div>
          <p className="text-sm text-muted-foreground">Travel → Expense Capture</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Expense Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingId ? "Edit Expense" : "Add New Expense"}
                </h2>
                {editingId && (
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Cancel Edit
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleCapture} className="flex-1 h-20 bg-primary hover:bg-primary/90">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-sm">Capture Receipt</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="flex-1 h-20">
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-sm">Upload Receipt</span>
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

                <div className="space-y-3">
                  <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Update Expense" : "Save Expense"}
                  </Button>
                  
                  {expenses.length > 0 && (
                    <Button 
                      onClick={() => navigate("/travel-settlement")} 
                      variant="outline" 
                      className="w-full"
                    >
                      Go to Travel Settlement
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Section - Expense List */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Saved Expenses ({expenses.length})
              </h3>
              
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No expenses added yet.</p>
                  <p className="text-sm mt-1">Add your first expense using the form on the left.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {expenses.map((expense) => (
                    <div key={expense.id} className={`p-4 rounded-lg border ${editingId === expense.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-foreground capitalize">{expense.type}</p>
                            <span className="text-2xl font-bold text-primary">₹{expense.amount.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{expense.date}</p>
                          {expense.remarks && (
                            <p className="text-sm text-muted-foreground">{expense.remarks}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(expense)}
                            className="text-primary hover:bg-primary/10"
                            title="Edit expense"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete expense"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCapture;

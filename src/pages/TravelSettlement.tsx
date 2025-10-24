import { useTravelSettlement } from "@/context/TravelSettlementContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Send, Trash2, Upload, ArrowLeft } from "lucide-react";
import { EmployeeDetails } from "@/components/EmployeeDetails";
import { TravelRequestSection } from "@/components/TravelRequestSection";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { FlatAllowanceTab } from "@/components/expense-tabs/FlatAllowanceTab";
import { TravelTab } from "@/components/expense-tabs/TravelTab";
import { LodgingTab } from "@/components/expense-tabs/LodgingTab";
import { ConveyanceTab } from "@/components/expense-tabs/ConveyanceTab";
import { MealsTab } from "@/components/expense-tabs/MealsTab";
import { OthersTab } from "@/components/expense-tabs/OthersTab";
import { LoadExpensesDialog } from "@/components/LoadExpensesDialog";


interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
  travelRequestNumber: string;
}

const TravelSettlement = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useTravelSettlement();
  const [activeTab, setActiveTab] = useState("flat-allowance");
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [currentTravelRequest, setCurrentTravelRequest] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState<ExpenseItem[]>([]);

  // Mock employee data
  const employeeData = {
    employeeCode: "EMP001",
    employeeName: "Rajesh Kumar",
    grade: "Manager",
    department: "Sales",
    supervisor: "Priya Sharma",
    location: "Bangalore",
  };

  const handleSave = () => {
    if (!currentTravelRequest.trim()) {
      toast.error("Please enter Travel Request Number before saving");
      return;
    }
    
    const draftSettlement = {
      requestNumber: currentTravelRequest,
      status: "Draft",
      totalClaimed: selectedExpenses.reduce((acc, exp) => acc + exp.amount, 0),
      totalApproved: 0,
      totalPaid: 0,
      financeReviewer: "Not Assigned",
      reviewDate: new Date().toISOString().split("T")[0],
      expenses: selectedExpenses,
      isDraft: true,
    };
    dispatch({ type: "ADD_DRAFT_SETTLEMENT", payload: draftSettlement });
    toast.success("Draft saved successfully");
  };

  const handleSubmit = () => {
    if (!currentTravelRequest.trim()) {
      toast.error("Please enter Travel Request Number before submitting");
      return;
    }
    
    if (selectedExpenses.length === 0) {
      toast.error("Please add some expenses before submitting");
      return;
    }
    
    const newSettlement = {
      requestNumber: currentTravelRequest,
      status: "Under Review",
      totalClaimed: selectedExpenses.reduce((acc, exp) => acc + exp.amount, 0),
      totalApproved: 0,
      totalPaid: 0,
      financeReviewer: "Pending Assignment",
      reviewDate: new Date().toISOString().split("T")[0],
      expenses: selectedExpenses,
    };
    dispatch({ type: "ADD_SETTLEMENT", payload: newSettlement });
    setSelectedExpenses([]);
    navigate("/settlement-status");
  };

  const handleDelete = () => {
    setSelectedExpenses([]);
    toast.success("Settlement cleared");
  };

  const handleLoadExpenses = () => {
    if (state.expenses.length === 0) {
      toast.error("No saved expenses found. Please create some expenses first.");
      return;
    }
    setShowLoadDialog(true);
  };

  const handleImportExpenses = (importedExpenses: ExpenseItem[]) => {
    // Avoid duplicates
    const newExpenses = importedExpenses.filter(
      newExp => !selectedExpenses.some(existing => existing.id === newExp.id)
    );
    
    setSelectedExpenses([...selectedExpenses, ...newExpenses]);
    toast.success(`Loaded ${newExpenses.length} expense${newExpenses.length > 1 ? 's' : ''} into respective tabs`);
    
    // Auto-select tab based on the first imported expense type
    if (newExpenses.length > 0) {
      const firstExpenseType = newExpenses[0].type.toLowerCase();
      if (firstExpenseType.includes('allowance')) {
        setActiveTab("flat-allowance");
      } else if (firstExpenseType.includes('travel')) {
        setActiveTab("travel");
      } else if (firstExpenseType.includes('lodging') || firstExpenseType.includes('hotel')) {
        setActiveTab("lodging");
      } else if (firstExpenseType.includes('conveyance') || firstExpenseType.includes('transport')) {
        setActiveTab("conveyance");
      } else if (firstExpenseType.includes('meal') || firstExpenseType.includes('food')) {
        setActiveTab("meals");
      } else {
        setActiveTab("others");
      }
    }
  };

  const handleRemoveExpense = (expenseId: string) => {
    setSelectedExpenses(selectedExpenses.filter(exp => exp.id !== expenseId));
    toast.success("Expense removed from settlement");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Travel Settlement</h1>
          </div>
          <p className="text-sm text-muted-foreground">Home → Travel → Travel Settlement</p>
        </div>
      </header>

      <LoadExpensesDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog}
        expenses={state.expenses}
        travelRequestNumber={currentTravelRequest}
        onImport={handleImportExpenses}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EmployeeDetails {...employeeData} />
            <TravelRequestSection onTravelRequestChange={setCurrentTravelRequest} />

            <Card className="p-6">
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Expense Details</h2>
                  <Button variant="outline" onClick={handleLoadExpenses}>
                    <Upload className="h-4 w-4 mr-2" />
                    Load Saved Expenses
                  </Button>
                </div>
                
                {selectedExpenses.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedExpenses.length} expense{selectedExpenses.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="flat-allowance">Flat Allowance</TabsTrigger>
                  <TabsTrigger value="travel">Travel</TabsTrigger>
                  <TabsTrigger value="lodging">Lodging</TabsTrigger>
                  <TabsTrigger value="conveyance">Conveyance</TabsTrigger>
                  <TabsTrigger value="meals">Meals</TabsTrigger>
                  <TabsTrigger value="others">Others</TabsTrigger>
                </TabsList>
                <TabsContent value="flat-allowance">
                  <FlatAllowanceTab 
                    importedExpenses={selectedExpenses.filter(exp => exp.type.toLowerCase().includes('allowance'))} 
                  />
                </TabsContent>
                <TabsContent value="travel">
                  <TravelTab 
                    importedExpenses={selectedExpenses.filter(exp => exp.type.toLowerCase().includes('travel'))} 
                  />
                </TabsContent>
                <TabsContent value="lodging">
                  <LodgingTab 
                    importedExpenses={selectedExpenses.filter(exp => exp.type.toLowerCase().includes('lodging') || exp.type.toLowerCase().includes('hotel'))} 
                  />
                </TabsContent>
                <TabsContent value="conveyance">
                  <ConveyanceTab 
                    importedExpenses={selectedExpenses.filter(exp => exp.type.toLowerCase().includes('conveyance') || exp.type.toLowerCase().includes('transport'))} 
                  />
                </TabsContent>
                <TabsContent value="meals">
                  <MealsTab 
                    importedExpenses={selectedExpenses.filter(exp => exp.type.toLowerCase().includes('meal') || exp.type.toLowerCase().includes('food'))} 
                  />
                </TabsContent>
                <TabsContent value="others">
                  <OthersTab 
                    importedExpenses={selectedExpenses.filter(exp => 
                      !exp.type.toLowerCase().includes('allowance') &&
                      !exp.type.toLowerCase().includes('travel') &&
                      !exp.type.toLowerCase().includes('lodging') &&
                      !exp.type.toLowerCase().includes('hotel') &&
                      !exp.type.toLowerCase().includes('conveyance') &&
                      !exp.type.toLowerCase().includes('transport') &&
                      !exp.type.toLowerCase().includes('meal') &&
                      !exp.type.toLowerCase().includes('food')
                    )} 
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <ExpenseSummary
              totalClaimed={selectedExpenses.reduce((acc, exp) => acc + exp.amount, 0)}
              advanceTaken={10000}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t mt-6 p-4 shadow-lg">
          <div className="container mx-auto flex gap-4 justify-end">
            <Button variant="outline" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={!currentTravelRequest.trim()}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save to Draft
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-primary hover:bg-primary/90"
              disabled={!currentTravelRequest.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Settlement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelSettlement;

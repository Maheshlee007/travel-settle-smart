import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Send, Trash2, Upload } from "lucide-react";
import { EmployeeDetails } from "@/components/EmployeeDetails";
import { TravelRequestSection } from "@/components/TravelRequestSection";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { FlatAllowanceTab } from "@/components/expense-tabs/FlatAllowanceTab";
import { TravelTab } from "@/components/expense-tabs/TravelTab";
import { LodgingTab } from "@/components/expense-tabs/LodgingTab";
import { ConveyanceTab } from "@/components/expense-tabs/ConveyanceTab";
import { MealsTab } from "@/components/expense-tabs/MealsTab";
import { OthersTab } from "@/components/expense-tabs/OthersTab";

const TravelSettlement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flat-allowance");

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
    toast.success("Draft saved successfully");
  };

  const handleSubmit = () => {
    navigate("/settlement-success");
  };

  const handleDelete = () => {
    toast.error("Settlement deleted");
  };

  const handleLoadExpenses = () => {
    const savedExpensesStr = localStorage.getItem("savedExpenses");
    if (!savedExpensesStr) {
      toast.error("No saved expenses found");
      return;
    }
    
    const savedExpenses = JSON.parse(savedExpensesStr);
    if (savedExpenses.length === 0) {
      toast.error("No saved expenses found");
      return;
    }
    
    toast.success(`Loaded ${savedExpenses.length} expense${savedExpenses.length > 1 ? 's' : ''} successfully`);
    
    // Clear the saved expenses after loading
    localStorage.removeItem("savedExpenses");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Travel Settlement</h1>
          <p className="text-sm text-muted-foreground">Home → Travel → Travel Settlement</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EmployeeDetails {...employeeData} />
            <TravelRequestSection />

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Expense Details</h2>
                <Button variant="outline" onClick={handleLoadExpenses}>
                  <Upload className="h-4 w-4 mr-2" />
                  Load Saved Expenses
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                  <TabsTrigger value="flat-allowance">Flat Allowance</TabsTrigger>
                  <TabsTrigger value="travel">Travel</TabsTrigger>
                  <TabsTrigger value="lodging">Lodging</TabsTrigger>
                  <TabsTrigger value="conveyance">Conveyance</TabsTrigger>
                  <TabsTrigger value="meals">Meals</TabsTrigger>
                  <TabsTrigger value="others">Others</TabsTrigger>
                </TabsList>

                <TabsContent value="flat-allowance">
                  <FlatAllowanceTab />
                </TabsContent>
                <TabsContent value="travel">
                  <TravelTab />
                </TabsContent>
                <TabsContent value="lodging">
                  <LodgingTab />
                </TabsContent>
                <TabsContent value="conveyance">
                  <ConveyanceTab />
                </TabsContent>
                <TabsContent value="meals">
                  <MealsTab />
                </TabsContent>
                <TabsContent value="others">
                  <OthersTab />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <ExpenseSummary
              totalClaimed={15000}
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
            <Button variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
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

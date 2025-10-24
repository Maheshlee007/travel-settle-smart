import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Camera, BarChart3, Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Travel Settlement",
      description: "Create and manage travel expense settlements",
      action: () => navigate("/travel-settlement"),
      color: "text-primary",
    },
    {
      icon: Camera,
      title: "Expense Capture",
      description: "Capture receipts on-the-go with mobile OCR",
      action: () => navigate("/expense-capture"),
      color: "text-success",
    },
    {
      icon: BarChart3,
      title: "Settlement Status",
      description: "Track approval status and payment timeline",
      action: () => navigate("/settlement-status"),
      color: "text-warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Travel Settlement System</h1>
              <p className="text-muted-foreground">Manage your travel expenses efficiently</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-3">Welcome Back!</h2>
            <p className="text-muted-foreground">Choose an option below to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={feature.action}>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-primary text-primary-foreground">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
                <p className="opacity-90">
                  View our comprehensive guide on how to submit travel settlements
                </p>
              </div>
              <Button variant="secondary" size="lg">
                View Guide
              </Button>
            </div>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-2">5</p>
              <p className="text-muted-foreground">Pending Settlements</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success mb-2">12</p>
              <p className="text-muted-foreground">Approved This Month</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warning mb-2">₹45,000</p>
              <p className="text-muted-foreground">Total Claimed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

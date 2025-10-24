import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const SettlementSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Settlement Submitted</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Settlement Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Your travel settlement has been submitted and is now under review. You will be notified once it's processed.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/settlement-status")} className="w-full bg-primary hover:bg-primary/90">
              View Settlement Status
            </Button>
            <Button onClick={() => navigate("/travel-settlement")} variant="outline" className="w-full">
              Create New Settlement
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettlementSuccess;

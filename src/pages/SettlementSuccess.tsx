import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const SettlementSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
  );
};

export default SettlementSuccess;

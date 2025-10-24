import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, FileText, DollarSign } from "lucide-react";

const SettlementStatus = () => {
  const navigate = useNavigate();

  // Mock settlement data
  const settlement = {
    requestNumber: "TR-2025-001",
    status: "Under Review",
    totalClaimed: 15000,
    totalApproved: 14500,
    totalPaid: 0,
    financeReviewer: "Anil Kapoor",
    reviewDate: "2025-01-25",
  };

  const timeline = [
    { status: "Draft", date: "2025-01-20", completed: true },
    { status: "Submitted", date: "2025-01-21", completed: true },
    { status: "Under Review", date: "2025-01-22", completed: true },
    { status: "Approved", date: "-", completed: false },
    { status: "Settled", date: "-", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Settlement Status</h1>
          <p className="text-sm text-muted-foreground">Travel → Settlement Status</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {settlement.requestNumber}
              </h2>
              <Badge className={
                settlement.status === "Approved" ? "bg-success" :
                settlement.status === "Under Review" ? "bg-warning" :
                "bg-muted"
              }>
                {settlement.status}
              </Badge>
            </div>
            <Button onClick={() => navigate("/travel-settlement")} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Settlement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Claimed</p>
              <p className="text-2xl font-bold text-foreground">₹{settlement.totalClaimed.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Approved</p>
              <p className="text-2xl font-bold text-success">₹{settlement.totalApproved.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-foreground">₹{settlement.totalPaid.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Finance Reviewer</p>
                <p className="text-foreground font-medium">{settlement.financeReviewer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Review Date</p>
                <p className="text-foreground font-medium">{settlement.reviewDate}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Timeline</h3>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">
                  {item.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.status}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 flex gap-4 justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => navigate("/travel-settlement")} className="bg-primary hover:bg-primary/90">
            Create New Settlement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettlementStatus;

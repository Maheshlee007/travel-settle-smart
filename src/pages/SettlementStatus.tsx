import { useTravelSettlement } from "@/context/TravelSettlementContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, FileText, ArrowLeft, AlertCircle, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

const SettlementStatus = () => {
  const navigate = useNavigate();
  const { state } = useTravelSettlement();
  const [selectedSettlement, setSelectedSettlement] = useState<string | null>(null);

  // Get all settlements including both submitted and those under review
  const allSettlements = [
    ...state.settlements,
    // Add a dummy approved settlement to show the flow
    {
      requestNumber: 'TR-2025-001',
      status: 'Approved',
      totalClaimed: 8500,
      totalApproved: 8200,
      totalPaid: 8200,
      financeReviewer: 'Anil Kapoor',
      reviewDate: '2025-01-25',
      expenses: [
        {
          id: '1',
          type: 'travel',
          amount: 4500,
          date: '2025-01-20',
          remarks: 'Flight to Mumbai',
          image: 'receipt1.jpg',
          travelRequestNumber: 'TR-2025-001'
        },
        {
          id: '2',
          type: 'lodging',
          amount: 4000,
          date: '2025-01-21',
          remarks: 'Hotel stay',
          image: 'receipt2.jpg',
          travelRequestNumber: 'TR-2025-001'
        }
      ]
    }
  ];

  if (allSettlements.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No settlements found.</h1>
          <Button onClick={() => navigate("/travel-settlement")}>Create a new settlement</Button>
        </div>
      </div>
    );
  }

  // Fixed allocated amount for the company
  const allocatedAmount = 25000;
  
  // Calculate totals across all settlements
  const totalClaimed = allSettlements.reduce((sum, s) => sum + s.totalClaimed, 0);
  const totalApproved = allSettlements.reduce((sum, s) => sum + s.totalApproved, 0);
  const totalPaid = allSettlements.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalRemaining = allocatedAmount - totalClaimed;

  // Initialize selectedSettlement on first render
  useEffect(() => {
    if (!selectedSettlement && allSettlements.length > 0) {
      setSelectedSettlement(allSettlements[0].requestNumber);
    }
  }, [allSettlements, selectedSettlement]);

  const currentSettlement = selectedSettlement 
    ? allSettlements.find(s => s.requestNumber === selectedSettlement) 
    : allSettlements[0];

  const getTimelineForSettlement = (settlement: any) => {
    const baseTimeline = [
      { status: "Draft", date: "2025-01-20", completed: true, isActive: false },
      { status: "Submitted", date: "2025-01-21", completed: true, isActive: false },
    ];

    if (settlement.status === "Under Review") {
      return [
        ...baseTimeline,
        { status: "Under Review", date: "2025-01-22", completed: true, isActive: true },
        { status: "Approved", date: "-", completed: false, isActive: false },
        { status: "Settled", date: "-", completed: false, isActive: false },
      ];
    } else if (settlement.status === "Approved") {
      return [
        ...baseTimeline,
        { status: "Under Review", date: "2025-01-22", completed: true, isActive: false },
        { status: "Approved", date: "2025-01-25", completed: true, isActive: false },
        { status: "Settled", date: "2025-01-26", completed: true, isActive: false },
      ];
    }

    return baseTimeline;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-green-500 text-green-700";
      case "Under Review":
        return "border-orange-500 text-orange-700";
      case "Rejected":
        return "border-red-500 text-red-700";
      default:
        return "border-gray-400 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Settlement Status</h1>
          </div>
          <p className="text-sm text-muted-foreground">Travel → Settlement Status</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-white border border-gray-200 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-600">Total Claimed</p>
                </div>
                <p className="text-3xl font-bold text-blue-800">₹{totalClaimed.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg border-l-4 border-l-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">Total Approved</p>
                </div>
                <p className="text-3xl font-bold text-green-800">₹{totalApproved.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-600">Remaining Budget</p>
                </div>
                <p className="text-3xl font-bold text-orange-800">₹{totalRemaining.toFixed(2)}</p>
                <p className="text-xs text-orange-600 mt-1">from ₹{allocatedAmount.toFixed(2)} allocated</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - All Settlements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">All Settlements</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allSettlements.map((settlement) => (
                <div
                  key={settlement.requestNumber}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSettlement === settlement.requestNumber || 
                    (!selectedSettlement && settlement === allSettlements[0])
                      ? 'border-gray-300 shadow-sm bg-gray-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSettlement(settlement.requestNumber)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {settlement.status === "Under Review" ? (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        ) : settlement.status === "Approved" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-semibold text-foreground">{settlement.requestNumber}</h4>
                          <p className="text-xs text-muted-foreground">{settlement.reviewDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{settlement.totalClaimed.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Claimed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Right Side - Workflow Timeline */}
          <Card className="p-6" key={currentSettlement?.requestNumber}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Workflow - {currentSettlement?.requestNumber}
              </h3>
              <Badge className={getStatusBadge(currentSettlement?.status || '')} variant="outline">
                {currentSettlement?.status}
              </Badge>
            </div>

            {/* Settlement Details */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Finance Reviewer</p>
                  <p className="font-medium">{currentSettlement?.financeReviewer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Review Date</p>
                  <p className="font-medium">{currentSettlement?.reviewDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Claimed Amount</p>
                  <p className="font-semibold text-blue-600">₹{currentSettlement?.totalClaimed.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approved Amount</p>
                  <p className="font-semibold text-green-600">₹{currentSettlement?.totalApproved.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {getTimelineForSettlement(currentSettlement).map((item, index) => (
                <div key={`${currentSettlement?.requestNumber}-${index}`} className="flex items-start gap-4">
                  <div className="mt-1">
                    {item.completed ? (
                      <CheckCircle2 className={`h-6 w-6 ${
                        item.isActive ? 'text-orange-500' : 'text-green-500'
                      }`} />
                    ) : (
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      item.completed 
                        ? item.isActive 
                          ? "text-orange-600" 
                          : "text-foreground" 
                        : "text-muted-foreground"
                    }`}>
                      {item.status}
                      {item.isActive && (
                        <AlertCircle className="inline-block w-4 h-4 ml-2 text-orange-500" />
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Expense Details for Selected Settlement */}
            {currentSettlement?.expenses && currentSettlement.expenses.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Expense Details</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentSettlement.expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium text-sm">{expense.type}</p>
                        <p className="text-xs text-muted-foreground">{expense.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{expense.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TravelRequestData {
  travelType: string;
  purpose: string;
  requestedDate: string;
  fromDate: string;
  toDate: string;
  fromPlace: string;
  toPlace: string;
}

interface TravelRequestSectionProps {
  onTravelRequestChange: (requestNumber: string) => void;
}

export const TravelRequestSection = ({ onTravelRequestChange }: TravelRequestSectionProps) => {
  const [selectedRequest, setSelectedRequest] = useState("");
  const [travelData, setTravelData] = useState<TravelRequestData | null>(null);

  const mockRequests = [
    { id: "TR-2025-001", label: "TR-2025-001 - Business Trip Mumbai" },
    { id: "TR-2025-002", label: "TR-2025-002 - Client Meeting Delhi" },
    { id: "TR-2025-003", label: "TR-2025-003 - Conference Bangalore" },
  ];

  const handleRequestSelection = (requestNumber: string) => {
    setSelectedRequest(requestNumber);
    
    if (requestNumber) {
      // Mock fetch - in real app, this would call an API
      setTravelData({
        travelType: "Domestic",
        purpose: "Business Meeting",
        requestedDate: "2025-01-15",
        fromDate: "2025-01-20",
        toDate: "2025-01-22",
        fromPlace: "Bangalore",
        toPlace: "Mumbai",
      });

      // Notify parent component about the selected travel request
      onTravelRequestChange(requestNumber);
      toast.success("Travel request details fetched successfully");
    } else {
      setTravelData(null);
      onTravelRequestChange("");
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Travel Request Number *
            </label>
            <Select value={selectedRequest} onValueChange={handleRequestSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel request" />
              </SelectTrigger>
              <SelectContent>
                {mockRequests.map((req) => (
                  <SelectItem key={req.id} value={req.id}>
                    {req.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {travelData && (
          <Accordion type="single" collapsible className="w-full" defaultValue="travel-details">
            <AccordionItem value="travel-details">
              <AccordionTrigger className="text-base font-medium">
                Travel Request Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Travel Type</label>
                    <p className="text-foreground mt-1">{travelData.travelType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Purpose</label>
                    <p className="text-foreground mt-1">{travelData.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Requested Date</label>
                    <p className="text-foreground mt-1">{travelData.requestedDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From Date</label>
                    <p className="text-foreground mt-1">{travelData.fromDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">To Date</label>
                    <p className="text-foreground mt-1">{travelData.toDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From Place</label>
                    <p className="text-foreground mt-1">{travelData.fromPlace}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-medium text-muted-foreground">To Place</label>
                    <p className="text-foreground mt-1">{travelData.toPlace}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </Card>
  );
};

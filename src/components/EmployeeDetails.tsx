import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface EmployeeDetailsProps {
  employeeCode: string;
  employeeName: string;
  grade: string;
  department: string;
  supervisor: string;
  location: string;
}

export const EmployeeDetails = ({
  employeeCode,
  employeeName,
  grade,
  department,
  supervisor,
  location,
}: EmployeeDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors">
          <h3 className="text-lg font-semibold text-foreground">Employee Details</h3>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee Code</label>
              <p className="text-foreground mt-1">{employeeCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee Name</label>
              <p className="text-foreground mt-1">{employeeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Grade</label>
              <p className="text-foreground mt-1">{grade}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="text-foreground mt-1">{department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Supervisor</label>
              <p className="text-foreground mt-1">{supervisor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-foreground mt-1">{location}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface FlatAllowanceRow {
  id: string;
  date: string;
  description: string;
  days: number;
  rate: number;
  amount: number;
  remarks: string;
}

export const FlatAllowanceTab = () => {
  const [rows, setRows] = useState<FlatAllowanceRow[]>([
    { id: "1", date: "", description: "", days: 0, rate: 0, amount: 0, remarks: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), date: "", description: "", days: 0, rate: 0, amount: 0, remarks: "" }]);
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof FlatAllowanceRow, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        if (field === "days" || field === "rate") {
          updated.amount = updated.days * updated.rate;
        }
        return updated;
      }
      return row;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="min-w-[100px]">Days</TableHead>
              <TableHead className="min-w-[120px]">Rate (₹)</TableHead>
              <TableHead className="min-w-[120px]">Amount (₹)</TableHead>
              <TableHead className="min-w-[200px]">Remarks</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, "date", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={row.description}
                    onChange={(e) => updateRow(row.id, "description", e.target.value)}
                    placeholder="Description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.days || ""}
                    onChange={(e) => updateRow(row.id, "days", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.rate || ""}
                    onChange={(e) => updateRow(row.id, "rate", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.amount.toFixed(2)}
                    disabled
                    className="bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={row.remarks}
                    onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                    placeholder="Remarks"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRow(row.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={addRow} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Row
      </Button>
    </div>
  );
};

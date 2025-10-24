import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Paperclip, Eye } from "lucide-react";
import { useState } from "react";

interface ConveyanceRow {
  id: string;
  date: string;
  type: string;
  distance: number;
  ratePerKm: number;
  amount: number;
  bill: string | null;
  remarks: string;
}

export const ConveyanceTab = () => {
  const [rows, setRows] = useState<ConveyanceRow[]>([
    { id: "1", date: "", type: "", distance: 0, ratePerKm: 0, amount: 0, bill: null, remarks: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), date: "", type: "", distance: 0, ratePerKm: 0, amount: 0, bill: null, remarks: "" }]);
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof ConveyanceRow, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        if (field === "distance" || field === "ratePerKm") {
          updated.amount = updated.distance * updated.ratePerKm;
        }
        return updated;
      }
      return row;
    }));
  };

  const handleFileUpload = (id: string, file: File | null) => {
    if (file) {
      updateRow(id, "bill", file.name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Date</TableHead>
              <TableHead className="min-w-[220px]">Type</TableHead>
              <TableHead className="min-w-[120px]">Distance (km)</TableHead>
              <TableHead className="min-w-[120px]">Rate/km (₹)</TableHead>
              <TableHead className="min-w-[120px]">Amount (₹)</TableHead>
              <TableHead className="min-w-[140px]">Bill</TableHead>
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
                    value={row.type}
                    onChange={(e) => updateRow(row.id, "type", e.target.value)}
                    placeholder="Vehicle type"
                    className="min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.distance || ""}
                    onChange={(e) => updateRow(row.id, "distance", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.ratePerKm || ""}
                    onChange={(e) => updateRow(row.id, "ratePerKm", parseFloat(e.target.value) || 0)}
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-${row.id}`)?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    {row.bill && (
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      id={`file-${row.id}`}
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(row.id, e.target.files?.[0] || null)}
                    />
                  </div>
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

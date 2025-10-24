import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Paperclip, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface OthersRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  bill: string | null;
  remarks: string;
}

interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
  travelRequestNumber: string;
}

interface OthersTabProps {
  importedExpenses?: ExpenseItem[];
}

export const OthersTab = ({ importedExpenses = [] }: OthersTabProps) => {
  const [rows, setRows] = useState<OthersRow[]>([
    { id: "1", date: "", description: "", amount: 0, bill: null, remarks: "" },
  ]);

  // Populate rows when imported expenses are available
  useEffect(() => {
    if (importedExpenses.length > 0) {
      const importedRows = importedExpenses.map(exp => ({
        id: exp.id,
        date: exp.date,
        description: exp.type,
        amount: exp.amount,
        bill: exp.image,
        remarks: exp.remarks
      }));
      
      // Keep existing rows and add imported ones
      setRows(prevRows => {
        const existingIds = prevRows.map(row => row.id);
        const newImported = importedRows.filter(row => !existingIds.includes(row.id));
        const existingFilledRows = prevRows.filter(row => row.date || row.description || row.amount > 0);
        return [...existingFilledRows, ...newImported];
      });
    }
  }, [importedExpenses]);

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), date: "", description: "", amount: 0, bill: null, remarks: "" }]);
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof OthersRow, value: any) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
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
              <TableHead className="min-w-[280px]">Description</TableHead>
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
                    value={row.description}
                    onChange={(e) => updateRow(row.id, "description", e.target.value)}
                    placeholder="Expense description"
                    className="min-w-[260px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.amount || ""}
                    onChange={(e) => updateRow(row.id, "amount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
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

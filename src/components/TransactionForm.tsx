import { useState } from "react";
import type { Transaction, TransactionInput } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  editingTx: Transaction | null;
  onSubmit: (data: TransactionInput) => void;
  onCancel: () => void;
}

const today = () => new Date().toISOString().split("T")[0];

export default function TransactionForm({
  editingTx,
  onSubmit,
  onCancel,
}: Props) {
  // Initial state comes directly from props — no effect needed
  const [title, setTitle] = useState(editingTx?.title ?? "");
  const [amount, setAmount] = useState(
    editingTx ? String(editingTx.amount) : ""
  );
  const [type, setType] = useState<"income" | "expense">(
    editingTx?.type ?? "expense"
  );
  const [category, setCategory] = useState(editingTx?.category ?? "");
  const [date, setDate] = useState(editingTx?.date ?? today());

  const reset = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate(today());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category: category.trim(),
      date,
    });
    if (!editingTx) reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingTx ? `Edit Transaction #${editingTx.id}` : "Add Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "income" | "expense")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {editingTx ? "Update" : "Save"}
            </Button>
            {editingTx && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
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
import { ConfirmDialog } from "./ConfirmDialog";

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
  const [title, setTitle] = useState(editingTx?.title ?? "");
  const [amount, setAmount] = useState(
    editingTx ? String(editingTx.amount) : ""
  );
  const [type, setType] = useState<"income" | "expense">(
    editingTx?.type ?? "expense"
  );
  const [category, setCategory] = useState(editingTx?.category ?? "");
  const [date, setDate] = useState(editingTx?.date ?? today());
  const [cancelOpen, setCancelOpen] = useState(false);

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

  const requestCancel = () => {
    if (editingTx) setCancelOpen(true);
    else onCancel();
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          {editingTx
            ? `Edit transaction #${editingTx.id}`
            : "Add a transaction"}
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          {editingTx
            ? "Update the fields and save your changes."
            : "Record a new income or expense entry."}
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tx-title">Title</Label>
            <Input
              id="tx-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly salary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount</Label>
            <Input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
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
            <Label htmlFor="tx-category">Category</Label>
            <Input
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Food, Salary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-date">Date</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
              {editingTx ? "Save changes" : "Add transaction"}
            </Button>
            {editingTx && (
              <Button
                type="button"
                variant="outline"
                onClick={requestCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Discard your changes?"
        description="Any edits you have made to this transaction will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="destructive"
        onConfirm={() => {
          setCancelOpen(false);
          onCancel();
        }}
      />
    </Card>
  );
}
import { useState } from "react";
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
  onFilter: (filters: {
    type?: string;
    category?: string;
    minimum_amount?: string;
    maximum_amount?: string;
  }) => void;
  onReset: () => void;
}

export default function FilterBar({ onFilter, onReset }: Props) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      type: type || undefined,
      category: category || undefined,
      minimum_amount: minAmount || undefined,
      maximum_amount: maxAmount || undefined,
    });
  };

  const handleReset = () => {
    setType("");
    setCategory("");
    setMinAmount("");
    setMaxAmount("");
    onReset();
  };

  return (
    <Card className="border-slate-200 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Filters
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Narrow down the transaction list.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              placeholder="e.g. Food"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Min</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="∞"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800"
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
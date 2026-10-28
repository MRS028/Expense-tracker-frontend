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
    <Card>
      <CardHeader>
        <CardTitle>Filter Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(value) => setType(value ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All</SelectItem>
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
          <div className="space-y-2">
            <Label>Min Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
            <Button type="submit">Apply Filters</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
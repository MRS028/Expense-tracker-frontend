import type { Transaction } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionTable({
  transactions,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-3 py-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-11 rounded-md bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
          ∅
        </div>
        <p className="mt-4 text-sm font-medium text-slate-700">
          No transactions yet
        </p>
        <p className="mt-1 text-xs text-slate-500 max-w-xs">
          Add your first income or expense using the form above and it will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-xs font-medium text-slate-500">
              ID
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Title
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Amount
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Type
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Category
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-slate-500 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <TableRow key={tx.id} className="hover:bg-slate-50">
                <TableCell className="text-xs text-slate-400">
                  #{tx.id}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {tx.title}
                </TableCell>
                <TableCell
                  className={`font-semibold ${
                    isIncome ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "−"}${Number(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      isIncome
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  >
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-700">{tx.category}</TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {tx.date}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tx)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tx.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
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
      <p className="text-center text-slate-400 py-8">Loading transactions...</p>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        No transactions yet. Add one above 👆
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <TableRow key={tx.id}>
                <TableCell className="text-slate-500">{tx.id}</TableCell>
                <TableCell className="font-medium">{tx.title}</TableCell>
                <TableCell
                  className={`font-semibold ${
                    isIncome ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isIncome ? "default" : "destructive"}
                    className={
                      isIncome
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell className="text-slate-500">{tx.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(tx)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(tx.id)}
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
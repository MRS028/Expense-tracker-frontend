import { useState, useEffect, useCallback } from "react";
import * as api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import FilterBar from "./FilterBar";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Transaction, TransactionInput, User } from "../types";

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Confirmation modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api
      .listTransactions()
      .then((data) => {
        if (active) setTransactions(data);
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (data: TransactionInput) => {
    try {
      await api.createTransaction(data);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleUpdate = async (id: number, data: TransactionInput) => {
    try {
      await api.updateTransaction(id, data);
      setEditingTx(null);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  // Open confirm modal instead of calling window.confirm
  const requestDelete = (id: number) => setDeleteId(id);

  // Actually delete after user confirms
  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await api.deleteTransaction(deleteId);
      setDeleteId(null);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleFilter = async (filters: {
    type?: string;
    category?: string;
    minimum_amount?: string;
    maximum_amount?: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const hasFilter = Object.values(filters).some((v) => v);
      if (!hasFilter) {
        await loadTransactions();
        return;
      }
      const data = await api.filterTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const initial = user?.username?.[0]?.toUpperCase() ?? "U";

  // Find the transaction being deleted (for a nicer message)
  const txToDelete = deleteId !== null
    ? transactions.find((t) => t.id === deleteId)
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
              E
            </div>
            <span className="font-semibold tracking-tight text-slate-900">
              Expense Tracker
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium text-slate-900">
                {user?.username ?? "Guest"}
              </span>
              <span className="text-xs text-slate-500">Signed in</span>
            </div>
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarFallback className="bg-slate-900 text-white text-sm font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogoutOpen(true)}
              className="text-slate-700"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's a snapshot of your finances and recent transactions.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Balance
                </span>
                <span className="text-xs text-slate-400">All time</span>
              </div>
              <div
                className={`mt-2 text-2xl font-semibold tracking-tight ${
                  balance >= 0 ? "text-slate-900" : "text-red-600"
                }`}
              >
                ${balance.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Income minus expenses
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Income
                </span>
                <span className="text-xs text-emerald-600">+</span>
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600">
                +${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Expenses
                </span>
                <span className="text-xs text-red-600">−</span>
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-red-600">
                −${totalExpense.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Total spending</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Transactions
                </span>
                <span className="text-xs text-slate-400">Count</span>
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {transactions.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {transactions.filter((t) => t.type === "expense").length}{" "}
                expenses ·{" "}
                {transactions.filter((t) => t.type === "income").length} income
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TransactionForm
              key={editingTx ? `edit-${editingTx.id}` : "new"}
              editingTx={editingTx}
              onSubmit={
                editingTx
                  ? (data) => handleUpdate(editingTx.id, data)
                  : handleCreate
              }
              onCancel={() => setEditingTx(null)}
            />
          </div>
          <div>
            <FilterBar onFilter={handleFilter} onReset={loadTransactions} />
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Transactions
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                A complete list of your recorded activity.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {transactions.length} total
            </span>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              loading={loading}
              onEdit={setEditingTx}
              onDelete={requestDelete}
            />
          </CardContent>
        </Card>

        <footer className="pt-2 pb-6 text-center text-xs text-slate-400">
          Expense Tracker · Built with React, TypeScript and shadcn/ui
        </footer>
      </main>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete this transaction?"
        description={
          txToDelete
            ? `"${txToDelete.title}" will be permanently removed. This action cannot be undone.`
            : "This transaction will be permanently removed."
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      {/* Logout confirmation */}
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Sign out of your account?"
        description="You will need to sign in again to access your dashboard."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        variant="destructive"
        onConfirm={() => {
          setLogoutOpen(false);
          onLogout();
        }}
      />
    </div>
  );
}
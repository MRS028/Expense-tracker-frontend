import { useState, useEffect, useCallback } from "react";

import * as api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import FilterBar from "./FilterBar";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
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

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete transaction #${id}?`)) return;
    try {
      await api.deleteTransaction(id);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-emerald-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-slate-600">👋 {user.username}</span>
            )}
            <Button variant="destructive" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Transaction Form */}
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

        {/* Filter Bar */}
        <FilterBar onFilter={handleFilter} onReset={loadTransactions} />

        {/* Transaction Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions{" "}
              <span className="text-sm font-normal text-slate-400">
                ({transactions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              loading={loading}
              onEdit={setEditingTx}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

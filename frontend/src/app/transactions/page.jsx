"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [tx, setTx] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;
    fetch(`http://192.168.1.87:5000/wallet/transactions/${user.id}`)
      .then(r => r.json())
      .then(j => setTx(j.data || j))
      .catch(console.error);
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Transactions</h1>
      <ul className="space-y-3">
        {tx.map(t => (
          <li key={t.id} className="p-3 bg-white/5 rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{t.type}</div>
                <div className="text-sm text-white/70">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className="font-semibold">${Number(t.amount).toFixed(2)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

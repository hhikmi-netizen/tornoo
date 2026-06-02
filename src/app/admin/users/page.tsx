"use client";

import { useState } from "react";
import { MagnifyingGlass, UserCheck, UserMinus, DotsThree } from "@phosphor-icons/react";

const USERS = [
  { id: "u1", name: "Amine Benali", email: "amine@example.com", role: "client", status: "active", joined: "2024-01-12" },
  { id: "u2", name: "Fatima Zahra", email: "fatima@example.com", role: "client", status: "active", joined: "2024-02-03" },
  { id: "u3", name: "Ahmed Benali", email: "ahmed@barberclub.ma", role: "pro", status: "active", joined: "2024-01-20" },
  { id: "u4", name: "Sara Tazi", email: "sara@example.com", role: "client", status: "inactive", joined: "2024-03-15" },
  { id: "u5", name: "Khalid Mansouri", email: "khalid@spa.ma", role: "pro", status: "pending", joined: "2024-04-02" },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");

  const filtered = USERS.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="pt-safe-top flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-ink">Utilisateurs</h1>
        <span className="px-3 py-1.5 bg-low-bg text-tornoo-green rounded-full text-sm font-bold border border-low-rim">
          {USERS.length} total
        </span>
      </div>

      {/* MagnifyingGlass */}
      <div className="flex items-center gap-3 bg-white rounded-[14px] px-4 h-12 border border-line shadow-1 mb-4">
        <MagnifyingGlass weight="bold" size={17} className="text-ink-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-3"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[22px] border border-line shadow-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-2 border-b border-line">
              <tr>
                {["Utilisateur", "Rôle", "Statut", "Inscrit le", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-ink-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} className={i < filtered.length - 1 ? "border-b border-line" : ""}>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-ink">{user.name}</p>
                      <p className="text-xs text-ink-3">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === "pro"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-surface-2 text-ink-3 border border-line"
                    }`}>
                      {user.role === "pro" ? "Pro" : "Client"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === "active" ? "bg-low-bg text-tornoo-green border border-low-rim" :
                      user.status === "pending" ? "bg-mod-bg text-tornoo-orange border border-mod-rim" :
                      "bg-surface-2 text-ink-3 border border-line"
                    }`}>
                      {user.status === "active" ? <UserCheck weight="fill" size={11} /> : <UserMinus weight="fill" size={11} />}
                      {user.status === "active" ? "Actif" : user.status === "pending" ? "En attente" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-ink-3">
                    {new Date(user.joined).toLocaleDateString("fr")}
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center" aria-label="Options">
                      <DotsThree weight="bold" size={16} className="text-ink-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import type { QueueClient } from "@/types/queue";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (client: Omit<QueueClient, "id" | "position" | "status" | "joinedAt" | "estimatedWaitMinutes">) => void;
  isLoading: boolean;
}

const SERVICES = ["Coupe homme", "Coupe + barbe", "Coloration", "Soin capillaire", "Taillage de barbe"];
const DURATIONS = ["15", "20", "30", "45", "60"];

export function AddClientModal({ open, onClose, onAdd, isLoading }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES[0]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), phone, serviceName: service });
    setName("");
    setPhone("");
    setService(SERVICES[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-black text-lg text-gray-900">Ajouter un client</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} weight="bold" className="text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prénom et nom"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009B5A] focus:ring-1 focus:ring-[#009B5A]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212 6 XX XX XX XX"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009B5A] focus:ring-1 focus:ring-[#009B5A]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009B5A] focus:ring-1 focus:ring-[#009B5A] bg-white"
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Durée estimée</label>
            <select className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009B5A] focus:ring-1 focus:ring-[#009B5A] bg-white">
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d} min</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-5 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
            className="flex-1 h-12 rounded-xl bg-[#009B5A] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#007a47] transition-colors"
          >
            Ajouter à la file
          </button>
        </div>
      </div>
    </div>
  );
}

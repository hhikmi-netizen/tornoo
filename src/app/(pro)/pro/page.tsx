"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, Gear, ChartBar, Users, CaretRight, Plus, Star } from "@phosphor-icons/react";
import { TornooMark } from "@/components/tornoo/TornooLogo";
import { WaitBadge, WaitDot } from "@/components/tornoo/WaitBadge";
import { MOCK_ESTABLISHMENTS, MOCK_QUEUES, MOCK_DAILY_STATS } from "@/lib/mock-data";
import { api } from "@/services/api";
import { useI18n } from "@/i18n/context";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export default function ProDashboardPage() {
  const { t } = useI18n();
  const e = MOCK_ESTABLISHMENTS[0];
  const queues = MOCK_QUEUES.filter((q) => q.establishmentId === e.id);
  const { data: stats = [] } = useQuery({ queryKey: ["pro-stats"], queryFn: () => api.pro.stats() });

  const today = stats[stats.length - 1] ?? MOCK_DAILY_STATS[MOCK_DAILY_STATS.length - 1];
  const totalWaiting = queues.reduce((a, q) => a + q.waitingCount, 0);

  const SERVICES = queues.map((q) => ({ label: q.label, name: q.serviceName, count: q.waitingCount }));

  return (
    <div className="min-h-svh">
      {/* Navy header */}
      <div className="bg-grad-navy px-5 pt-safe-top pb-24 rounded-b-[38px]">
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-white/60 text-sm">{t.proGreeting}</p>
            <h1 className="text-3xl font-black text-white leading-tight">Admin</h1>
            <Link href="/pro/profile" className="flex items-center gap-1 text-tornoo-green text-sm font-bold mt-0.5">
              {t.proBusiness} <CaretRight weight="bold" size={14} />
            </Link>
          </div>
          <div className="flex gap-2">
            <Link href="/notifications" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Notifications">
              <Bell weight="duotone" size={20} className="text-white" />
            </Link>
            <Link href="/pro/profile" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center" aria-label="Paramètres">
              <Gear weight="duotone" size={20} className="text-white" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16 pb-28 space-y-4">
        {/* Main card */}
        <div className="bg-white rounded-[22px] border border-line shadow-pop p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-ink">{e.name}</h2>
              <p className="text-sm text-ink-3">{e.city}</p>
            </div>
            <div className="flex items-center gap-1 font-bold text-sm">
              <Star size={14} weight="fill" className="text-[#F7C400]" />
              <span className="text-ink-2">{e.rating}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-low-bg text-tornoo-green rounded-full text-xs font-bold border border-low-rim">
              <WaitDot level="low" size={7} />
              {t.openStatus}
            </span>
            <Link href="/pro/profile" className="px-3 py-1.5 rounded-xl border border-line text-xs font-bold text-ink-2">
              {t.viewProfile}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link href="/pro/statistics" className="bg-surface-2 rounded-[18px] p-4 border border-line">
              <ChartBar weight="duotone" size={22} className="text-tornoo-green" />
              <p className="font-black text-ink mt-2">{t.statistics}</p>
              <p className="text-xs text-ink-3">{t.today}</p>
            </Link>
            <Link href="/pro/queues" className="bg-surface-2 rounded-[18px] p-4 border border-line">
              <Users weight="duotone" size={22} className="text-tornoo-green" />
              <p className="font-black text-ink mt-2">{t.queuePro}</p>
              <p className="text-xs text-ink-3">{t.realtimeQueue}</p>
            </Link>
          </div>
        </div>

        {/* Today stats */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h3 className="font-black text-ink mb-3">{t.todayStats}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-2 rounded-[16px] p-3 text-center border border-line">
              <AnimatedNumber value={today?.clientsServed ?? 0} duration={1.2} delay={0.1} className="text-2xl font-black text-ink block" />
              <p className="text-xs text-ink-3 mt-0.5">{t.served}</p>
            </div>
            <div className="bg-surface-2 rounded-[16px] p-3 text-center border border-line">
              <AnimatedNumber value={totalWaiting} duration={0.9} delay={0.2} className="text-2xl font-black text-ink block" />
              <p className="text-xs text-ink-3 mt-0.5">{t.waiting}</p>
            </div>
            <div className="bg-surface-2 rounded-[16px] p-3 text-center border border-line">
              <AnimatedNumber value={Math.round(today?.avgWaitMinutes ?? 0)} duration={1.0} delay={0.3} suffix=" min" className="text-2xl font-black text-ink block" />
              <p className="text-xs text-ink-3 mt-0.5">{t.avgWait}</p>
            </div>
          </div>
        </div>

        {/* Services / queues */}
        <div className="bg-white rounded-[22px] border border-line shadow-1 p-5">
          <h3 className="font-black text-ink mb-3">{t.whichService}</h3>
          <div className="space-y-2">
            {SERVICES.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center justify-between p-3.5 rounded-[16px] border ${
                  i === 0 ? "border-tornoo-green bg-low-bg" : "border-line"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-grad-navy flex items-center justify-center">
                    <span className="text-white font-black text-sm">{s.label}</span>
                  </div>
                  <span className="font-bold text-ink">{s.name}</span>
                </div>
                <span className="text-sm text-ink-3">{s.count} personnes</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between bg-low-bg rounded-[14px] px-4 py-3 border border-low-rim">
            <span className="font-bold text-sm text-ink">{t.estimatedWaitPro}</span>
            <WaitBadge minutes={28} size="sm" />
          </div>

          <Link
            href="/pro/queues/new"
            className="mt-3 flex items-center justify-center gap-2 h-14 rounded-[15px] bg-tornoo-green text-white font-extrabold w-full"
          >
            <Plus weight="bold" size={20} />
            {t.takeTicket}
          </Link>
        </div>
      </div>
    </div>
  );
}

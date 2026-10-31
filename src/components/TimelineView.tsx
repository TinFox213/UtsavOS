// src/components/TimelineView.tsx
import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CloudRain,
} from 'lucide-react';
import { TimelineMilestone, RunOfShowSlot, EventArchetype } from '../types/event';
import { applyTimelineDelay } from '../shared/timelineEngine';

export interface TimelineViewProps {
  archetype: EventArchetype;
  milestones: TimelineMilestone[];
  runOfShow: RunOfShowSlot[];
  onUpdateRunOfShow: (updated: RunOfShowSlot[]) => void;
  onUpdateMilestones: (updated: TimelineMilestone[]) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  archetype: _archetype,
  milestones,
  runOfShow,
  onUpdateRunOfShow,
  onUpdateMilestones,
}) => {
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'RUN_OF_SHOW'>('RUN_OF_SHOW');
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);

  const handleApplyDelay = (nodeId: string, delayMins: number, scenarioLabel: string) => {
    const updated = applyTimelineDelay(runOfShow, nodeId, delayMins);
    onUpdateRunOfShow(updated);
    setCrisisAlert(`Live Crisis Injected: ${scenarioLabel} (+${delayMins} mins applied). Dependent slots shifted.`);
  };

  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map((m) =>
      m.id === id
        ? { ...m, status: (m.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED') as TimelineMilestone['status'] }
        : m
    );
    onUpdateMilestones(updated);
  };

  const formatMinutesToTime = (totalMinutes: number): string => {
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;
    return `${displayHrs}:${displayMins} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Dual-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 4: Critical Path Timeline & Minute-by-Minute Run-of-Show
          </h2>
          <p className="text-xs text-slate-500">
            Switch between long-range countdown milestones and event-day execution with real-time delay simulation.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('ROADMAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ROADMAP' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Countdown Roadmap (T-180d)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RUN_OF_SHOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'RUN_OF_SHOW' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Event Day Run-of-Show
          </button>
        </div>
      </div>

      {/* Live Crisis Delay Injection Bar */}
      {activeTab === 'RUN_OF_SHOW' && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm tracking-tight">Live Crisis & Delay Simulator (Video Sec 4)</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Curfew Cutoff: 22:00 PM</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w1', 45, 'Bridal Makeup / Floral Setup Delay')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" /> +45m HMU / Setup Delay
            </button>
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w4', 30, 'Catering Delivery Traffic Delay')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" /> +30m Caterer Delay
            </button>
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w5', 60, 'Outdoor Rain Contingency Shift')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-rose-300 flex items-center gap-1.5 cursor-pointer"
            >
              <CloudRain className="w-3.5 h-3.5" /> Sudden Rain Reroute (+60m)
            </button>
          </div>

          {crisisAlert && (
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-semibold">
              {crisisAlert}
            </div>
          )}
        </div>
      )}

      {/* Tab A: Macro Countdown Roadmap */}
      {activeTab === 'ROADMAP' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">CPM Backward Pass Milestones</h3>
          <div className="space-y-3">
            {milestones.map((m) => {
              const isDone = m.status === 'COMPLETED';
              return (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isDone ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => handleToggleMilestone(m.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                          {m.phaseLabel}
                        </span>
                        <span className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {m.title}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Owner: {m.owner} • Check: {m.deliverableCheck}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
                    Due: {m.dueDateIso}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab B: Minute-by-Minute Run-of-Show */}
      {activeTab === 'RUN_OF_SHOW' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Event Day Minute-by-Minute Run-of-Show</h3>
          <div className="space-y-3">
            {runOfShow.map((slot) => {
              const endTimeMins = slot.startTimeMinutes + slot.durationMinutes;
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    slot.hasCurfewConflict
                      ? 'bg-rose-50 border-2 border-rose-500'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        {formatMinutesToTime(slot.startTimeMinutes)} – {formatMinutesToTime(endTimeMins)}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{slot.title}</span>
                    </div>

                    {slot.hasCurfewConflict && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wide animate-pulse">
                        Curfew Conflict (&gt;22:00)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <div>
                      Owner: <span className="font-semibold text-slate-700">{slot.owner}</span> • Duration:{' '}
                      <span className="font-mono font-semibold text-slate-700">{slot.durationMinutes} mins</span> (Buffer: {slot.bufferMinutes}m)
                    </div>
                    {slot.delayAppliedMinutes > 0 && (
                      <span className="font-mono font-bold text-amber-600">
                        +{slot.delayAppliedMinutes}m delayed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// src/components/TimelineView.tsx
import React, { useState } from 'react';
import { TimelineMilestone, RunOfShowSlot, EventArchetype } from '../types/event';
import { applyTimelineDelay } from '../shared/timelineEngine';
import { CrisisSimulatorPanel } from './timeline/CrisisSimulatorPanel';
import { CountdownTab } from './timeline/CountdownTab';
import { RunOfShowTab } from './timeline/RunOfShowTab';

export interface TimelineViewProps {
  archetype: EventArchetype;
  milestones: TimelineMilestone[];
  runOfShow: RunOfShowSlot[];
  onUpdateRunOfShow: (updated: RunOfShowSlot[]) => void;
  onUpdateMilestones: (updated: TimelineMilestone[]) => void;
}

/**
 * Step 4 Critical Path Timeline & Minute-by-Minute Run-of-Show with accessible tablist
 * and real-time crisis propagation simulator.
 */
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 4: Critical Path Timeline & Minute-by-Minute Run-of-Show
          </h2>
          <p className="text-xs text-slate-500">
            Switch between long-range countdown milestones and event-day execution with real-time delay simulation.
          </p>
        </div>

        <div role="tablist" aria-label="Timeline view mode" className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            id="tab-roadmap"
            type="button"
            role="tab"
            aria-selected={activeTab === 'ROADMAP'}
            aria-controls="panel-roadmap"
            onClick={() => setActiveTab('ROADMAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ROADMAP' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Countdown Roadmap (T-180d)
          </button>
          <button
            id="tab-ros"
            type="button"
            role="tab"
            aria-selected={activeTab === 'RUN_OF_SHOW'}
            aria-controls="panel-ros"
            onClick={() => setActiveTab('RUN_OF_SHOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'RUN_OF_SHOW' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Event Day Run-of-Show
          </button>
        </div>
      </div>

      {activeTab === 'RUN_OF_SHOW' && (
        <CrisisSimulatorPanel crisisAlert={crisisAlert} onApplyDelay={handleApplyDelay} />
      )}

      {activeTab === 'ROADMAP' ? (
        <CountdownTab milestones={milestones} onToggleMilestone={handleToggleMilestone} />
      ) : (
        <RunOfShowTab runOfShow={runOfShow} />
      )}
    </div>
  );
};

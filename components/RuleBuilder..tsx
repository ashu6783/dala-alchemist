'use client';

import { useState } from 'react';
import { Plus, Trash2, Settings, Users, Clock, ArrowRight, Layers, ChevronDown } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { Rule } from '@/types/rule';

export default function RuleBuilder() {
  const [type, setType] = useState<Rule['type']>('coRun');
  const [form, setForm] = useState<any>({});
  const [taskInput, setTaskInput] = useState('');
  const rules = useDataStore((state) => state.rules);
  const addRule = useDataStore((state) => state.addRule);
  const removeRule = useDataStore((state) => state.removeRule);

  const handleAddRule = () => {
    if (!isFormValid()) return;

    let ruleData: Rule;

    if (type === 'coRun') {
      const tasks = taskInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      ruleData = {
        type: 'coRun',
        tasks,
      };
    } else {
      ruleData = {
        type,
        ...form,
      } as Rule;
    }

    addRule(ruleData);
    setForm({});
    setTaskInput('');
  };

  const isFormValid = () => {
    switch (type) {
      case 'coRun':
        return taskInput.split(',').filter(Boolean).length > 1;
      case 'slotRestriction':
        return form.group && form.minCommonSlots > 0;
      case 'loadLimit':
        return form.group && form.maxSlotsPerPhase > 0;
      case 'phaseWindow':
        return form.task && form.allowedPhases && form.allowedPhases.length > 0;
      case 'precedence':
        return form.before && form.after && form.before !== form.after;
      default:
        return false;
    }
  };

  const handleRemoveRule = (index: number) => {
    removeRule(index);
  };

  const formatRuleDisplay = (rule: Rule) => {
    switch (rule.type) {
      case 'coRun':
        return `Co-run: ${rule.tasks.join(', ')}`;
      case 'slotRestriction':
        return `Slot Restriction: ${rule.group} needs ${rule.minCommonSlots} common slots`;
      case 'loadLimit':
        return `Load Limit: ${rule.group} max ${rule.maxSlotsPerPhase} slots per phase`;
      case 'phaseWindow':
        return `Phase Window: ${rule.task} allowed in phases ${rule.allowedPhases.join(', ')}`;
      case 'precedence':
        return `Precedence: ${rule.before} must run before ${rule.after}`;
      default:
        return JSON.stringify(rule);
    }
  };

  const getRuleIcon = (ruleType: Rule['type']) => {
    switch (ruleType) {
      case 'coRun':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'slotRestriction':
        return <Settings className="w-5 h-5 text-purple-600" />;
      case 'loadLimit':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'phaseWindow':
        return <Layers className="w-5 h-5 text-green-600" />;
      case 'precedence':
        return <ArrowRight className="w-5 h-5 text-red-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRuleTypeColor = (ruleType: Rule['type']) => {
    switch (ruleType) {
      case 'coRun':
        return 'border-blue-200 bg-blue-50';
      case 'slotRestriction':
        return 'border-purple-200 bg-purple-50';
      case 'loadLimit':
        return 'border-orange-200 bg-orange-50';
      case 'phaseWindow':
        return 'border-green-200 bg-green-50';
      case 'precedence':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-white">Rule Builder</h1>
        </div>
        <p className="text-gray-600">Define and manage scheduling rules for your workflow</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-gray-900">Create New Rule</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Rule Type</label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as Rule['type']);
                setForm({});
              }}
              className="appearance-none w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
            >
              <option value="coRun">Co-run Tasks</option>
              <option value="slotRestriction">Slot Restriction</option>
              <option value="loadLimit">Load Limit</option>
              <option value="phaseWindow">Phase Window</option>
              <option value="precedence">Task Precedence</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${getRuleTypeColor(type)} mb-6`}>
          <div className="flex items-center gap-2 mb-4">
            {getRuleIcon(type)}
            <h3 className="font-medium text-gray-900">
              {type === 'coRun' && 'Co-run Configuration'}
              {type === 'slotRestriction' && 'Slot Restriction Settings'}
              {type === 'loadLimit' && 'Load Limit Parameters'}
              {type === 'phaseWindow' && 'Phase Window Constraints'}
              {type === 'precedence' && 'Task Precedence Order'}
            </h3>
          </div>

          {type === 'coRun' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Tasks that must run together</label>
              <input
                placeholder="Enter task IDs separated by commas (e.g., T1, T2, T3)"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <p className="text-xs text-black flex items-center gap-1">
                <Users className="w-3 h-3" />
                Minimum 2 task IDs required
              </p>
            </div>
          )}

          {type === 'slotRestriction' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                value={form.group || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, group: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Common Slots</label>
              <input
                type="number"
                min="1"
                value={form.minCommonSlots || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, minCommonSlots: +e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>
          )}

          {type === 'loadLimit' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                value={form.group || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, group: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Slots Per Phase</label>
              <input
                type="number"
                min="1"
                value={form.maxSlotsPerPhase || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, maxSlotsPerPhase: +e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>
          )}

          {type === 'phaseWindow' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
              <input
                value={form.task || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, task: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Phases</label>
              <input
                placeholder="Enter phases like 1,2,3"
                value={form.allowedPhases?.join(',') || ''}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    allowedPhases: e.target.value
                      .split(',')
                      .map((s) => +s.trim())
                      .filter((n) => !isNaN(n)),
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>
          )}

          {type === 'precedence' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Before (Predecessor)</label>
              <input
                value={form.before || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, before: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">After (Successor)</label>
              <input
                value={form.after || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev, after: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAddRule}
          disabled={!isFormValid()}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isFormValid()
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add Rule
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Active Rules</h3>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {rules.length}
            </span>
          </div>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No rules defined yet</p>
            <p className="text-gray-400 text-sm">Create your first rule using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${getRuleTypeColor(rule.type)} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  {getRuleIcon(rule.type)}
                  <span className="text-gray-900 font-medium">{formatRuleDisplay(rule)}</span>
                </div>
                <button
                  onClick={() => handleRemoveRule(i)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

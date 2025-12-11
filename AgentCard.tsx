import React from 'react';
import { AgentType } from '../types';
import { Activity, FileText, Briefcase, GraduationCap, Network, BrainCircuit } from 'lucide-react';

interface AgentCardProps {
  type: AgentType;
  isActive: boolean;
  description: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ type, isActive, description }) => {
  const getIcon = () => {
    switch (type) {
      case AgentType.RME: return <FileText className="w-6 h-6" />;
      case AgentType.ADMIN: return <Briefcase className="w-6 h-6" />;
      case AgentType.CLINICAL: return <Activity className="w-6 h-6" />;
      case AgentType.EDUCATION: return <GraduationCap className="w-6 h-6" />;
      case AgentType.COORDINATOR: return <Network className="w-6 h-6" />;
      default: return <BrainCircuit className="w-6 h-6" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case AgentType.RME: return 'bg-blue-100 text-blue-700 border-blue-200';
      case AgentType.ADMIN: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case AgentType.CLINICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
      case AgentType.EDUCATION: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const activeClass = isActive 
    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-xl opacity-100' 
    : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100';

  return (
    <div className={`transition-all duration-300 transform rounded-xl border p-4 flex flex-col items-center gap-3 ${getColor()} ${activeClass}`}>
      <div className={`p-3 rounded-full bg-white shadow-sm`}>
        {getIcon()}
      </div>
      <div className="text-center">
        <h3 className="font-bold text-sm tracking-wide">{type} AGENT</h3>
        <p className="text-xs mt-1 leading-tight opacity-90">{description}</p>
      </div>
      {isActive && (
        <div className="flex items-center gap-1 mt-2">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Processing</span>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
import React from 'react';
import { AgentResponse, AgentType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileCheck, ShieldAlert, HeartPulse, BookOpen } from 'lucide-react';

interface VisualizationPanelProps {
  lastResponse: AgentResponse | null;
  isProcessing: boolean;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ lastResponse, isProcessing }) => {
  if (isProcessing) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse font-medium">Coordinating Agents...</p>
      </div>
    );
  }

  if (!lastResponse) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-8">
        <p>System Ready. Waiting for input.</p>
        <p className="text-sm mt-2">Try asking about patient vitals, billing reports, or post-op care.</p>
      </div>
    );
  }

  const { agentType, structuredData } = lastResponse;

  // Render content based on Agent Type
  switch (agentType) {
    case AgentType.ADMIN:
      const agingData = structuredData?.agingSchedule || [
        { period: '0-30', amount: 45000, riskLevel: 'Low' },
        { period: '30-60', amount: 12000, riskLevel: 'Medium' },
        { period: '60-90', amount: 5000, riskLevel: 'High' },
        { period: '90+', amount: 2000, riskLevel: 'High' },
      ];
      
      return (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <ShieldAlert size={20} />
            </div>
            <h3 className="font-bold text-slate-700">Accounts Receivable Aging</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {agingData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.riskLevel === 'High' ? '#f43f5e' : entry.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-center">
            <div className="p-2 bg-emerald-50 rounded text-emerald-700 border border-emerald-100">
                <span className="block font-bold">Low Risk</span> Current
            </div>
            <div className="p-2 bg-amber-50 rounded text-amber-700 border border-amber-100">
                <span className="block font-bold">Medium Risk</span> 30-60 Days
            </div>
            <div className="p-2 bg-rose-50 rounded text-rose-700 border border-rose-100">
                <span className="block font-bold">High Risk</span> 60+ Days
            </div>
          </div>
        </div>
      );

    case AgentType.RME:
      const fields = structuredData?.extractedFields || { 
          patientName: "N/A", diagnosis: "Pending", icdCode: "---", plan: "Review" 
      };
      return (
        <div className="animate-fadeIn space-y-4">
           <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-700">RME Extraction</h3>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <tbody>
                    <tr className="border-b">
                        <th className="bg-slate-50 px-4 py-3 font-medium text-slate-500 w-1/3">Patient</th>
                        <td className="px-4 py-3 font-semibold text-slate-800">{fields.patientName}</td>
                    </tr>
                    <tr className="border-b">
                        <th className="bg-slate-50 px-4 py-3 font-medium text-slate-500">Diagnosis</th>
                        <td className="px-4 py-3 text-slate-800">{fields.diagnosis}</td>
                    </tr>
                    <tr className="border-b">
                        <th className="bg-slate-50 px-4 py-3 font-medium text-slate-500">ICD-10 Code</th>
                        <td className="px-4 py-3 font-mono text-indigo-600 bg-indigo-50 inline-block m-2 rounded px-2">{fields.icdCode}</td>
                    </tr>
                     <tr>
                        <th className="bg-slate-50 px-4 py-3 font-medium text-slate-500 align-top">Plan</th>
                        <td className="px-4 py-3 text-slate-700 italic">{fields.plan}</td>
                    </tr>
                </tbody>
            </table>
          </div>
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
            Certified compliant with Permenkes No 24 (2022).
          </div>
        </div>
      );

    case AgentType.CLINICAL:
       const risks = structuredData?.riskAssessment || [
           { metric: 'Oxygen Saturation', value: '98%', status: 'Normal' },
           { metric: 'Blood Pressure', value: '145/90', status: 'Warning' },
           { metric: 'Heart Rate', value: '110 bpm', status: 'Critical' }
       ];
       return (
        <div className="animate-fadeIn space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <HeartPulse size={20} />
            </div>
            <h3 className="font-bold text-slate-700">Clinical Decision Support</h3>
          </div>
          
          <div className="space-y-2">
            {risks.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-slate-600">{item.metric}</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{item.value}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                            ${item.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 
                              item.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 
                              'bg-rose-100 text-rose-700'}`}>
                            {item.status}
                        </span>
                    </div>
                </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg">
             <h4 className="text-xs font-bold text-rose-800 mb-1">AI Recommendation</h4>
             <p className="text-xs text-rose-700">Validate anomalous vitals immediately. Review recent medication administration records.</p>
          </div>
        </div>
       );

    case AgentType.EDUCATION:
        const points = structuredData?.keyPoints || [
            { topic: "Rest", explanation: "Ensure 8 hours of sleep." },
            { topic: "Medication", explanation: "Take antibiotics after meals." }
        ];
        return (
            <div className="animate-fadeIn space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <BookOpen size={20} />
                    </div>
                    <h3 className="font-bold text-slate-700">Patient Education Materials</h3>
                </div>
                <div className="grid gap-3">
                    {points.map((pt: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{pt.topic}</h4>
                                <p className="text-slate-600 text-sm mt-1">{pt.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button className="text-xs font-medium text-amber-600 hover:text-amber-700 underline">
                        Download Printable PDF
                    </button>
                </div>
            </div>
        );

    default:
      return null;
  }
};

export default VisualizationPanel;
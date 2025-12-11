import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Stethoscope, Settings, Info } from 'lucide-react';
import { AgentType, Message, AgentResponse } from './types';
import { processHospitalRequest } from './services/geminiService';
import AgentCard from './components/AgentCard';
import VisualizationPanel from './components/VisualizationPanel';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType>(AgentType.COORDINATOR);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setActiveAgent(AgentType.COORDINATOR);
    setLastResponse(null);

    // Simulate thinking/routing delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await processHospitalRequest(userMessage.content);
    
    // Update Active Agent based on result
    setActiveAgent(result.agentType);
    
    // Small delay to allow user to see the agent switch before content loads
    await new Promise(resolve => setTimeout(resolve, 800));

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.content,
      agentResponse: result
    };

    setMessages((prev) => [...prev, botMessage]);
    setLastResponse(result);
    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sample prompts for quick testing
  const samplePrompts = [
    { label: "RME", text: "Dr. Sutomo notes: Patient John Doe, acute bronchitis, prescribed Amoxicillin 500mg tid." },
    { label: "Admin", text: "Show me the aging schedule for unpaid insurance claims over 90 days." },
    { label: "Clinical", text: "Patient has high BP (160/95), dizziness, and history of T2D. Suggest next steps." },
    { label: "Edu", text: "Explain post-surgery wound care for a knee replacement simply to an elderly patient." }
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar / Agent Status */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-indigo-700">
            <div className="p-2 bg-indigo-50 rounded-lg">
                <Stethoscope size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">MediCore AI</h1>
          </div>
          <p className="text-xs text-slate-500 mt-2 ml-1">Hospital Orchestration System</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Active Agents</p>
          
          <AgentCard 
            type={AgentType.RME} 
            isActive={activeAgent === AgentType.RME} 
            description="Medical Records & Compliance"
          />
          <AgentCard 
            type={AgentType.ADMIN} 
            isActive={activeAgent === AgentType.ADMIN} 
            description="Billing, Claims & Finance"
          />
          <AgentCard 
            type={AgentType.CLINICAL} 
            isActive={activeAgent === AgentType.CLINICAL} 
            description="Decision Support System"
          />
          <AgentCard 
            type={AgentType.EDUCATION} 
            isActive={activeAgent === AgentType.EDUCATION} 
            description="Patient Communication"
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>System Status: <span className="text-emerald-500 font-bold">Online</span></span>
            <Settings size={14} className="cursor-pointer hover:text-indigo-600"/>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${activeAgent === AgentType.COORDINATOR ? 'bg-slate-300' : 'bg-indigo-500 animate-pulse'}`}></span>
            <h2 className="font-semibold text-slate-700">
              {activeAgent === AgentType.COORDINATOR ? 'Coordinator Standing By' : `Orchestrating: ${activeAgent}`}
            </h2>
          </div>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
            <Info size={20} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
              <Stethoscope size={64} className="mb-4 text-slate-300" />
              <p className="text-xl font-light text-slate-400">How can the AI assist the hospital today?</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl p-5 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.role === 'assistant' && msg.agentResponse && (
                  <div className="mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 opacity-75">
                    <span className="text-xs font-bold uppercase tracking-wide text-indigo-500">{msg.agentResponse.agentType} Agent</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[10px] text-slate-400 italic">{msg.agentResponse.reasoning}</span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-inherit leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
           {isProcessing && (
            <div className="flex justify-start">
               <div className="bg-white px-6 py-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-3">
                 <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
                 <span className="text-xs text-slate-500 font-medium animate-pulse">
                   {activeAgent === AgentType.COORDINATOR ? 'Analyzing intent...' : `Routing to ${activeAgent}...`}
                 </span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-200">
          
          {/* Quick Prompts */}
          {messages.length === 0 && (
             <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {samplePrompts.map((p, i) => (
                    <button 
                        key={i}
                        onClick={() => setInputValue(p.text)}
                        className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-full text-xs font-medium transition-colors"
                    >
                        {p.label}: {p.text.substring(0, 30)}...
                    </button>
                ))}
             </div>
          )}

          <div className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[50px] py-3 text-sm text-slate-700 placeholder-slate-400"
              placeholder="Describe the task (e.g., 'Analyze chest X-ray report', 'Draft billing summary')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button 
              className={`p-3 rounded-lg transition-all shadow-sm ${
                inputValue.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              AI-generated content can be inaccurate. Always verify clinical recommendations with a licensed professional.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Data Visualization */}
      <div className="w-96 bg-white border-l border-slate-200 hidden xl:flex flex-col shadow-xl z-20">
        <div className="p-5 border-b border-slate-100">
           <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Data Intelligence</h3>
        </div>
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
            <VisualizationPanel lastResponse={lastResponse} isProcessing={isProcessing && activeAgent !== AgentType.COORDINATOR} />
        </div>
      </div>

    </div>
  );
};

export default App;
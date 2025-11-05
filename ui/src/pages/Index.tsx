import { useState } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { FileText } from "lucide-react";

export interface FinancialMetrics {
  grossMargin?: number;
  sgaRatio?: number;
  roe?: number;
  roa?: number;
  currentRatio?: number;
  debtToEquity?: number;
  operatingMargin?: number;
  netMargin?: number;
  assetTurnover?: number;
  quickRatio?: number;
}

export interface AnalysisData {
  companyName: string;
  industry: string;
  metrics: FinancialMetrics;
  summary: string;
  industryBenchmarks: string;
  ragProcess: {
    documentChunks: number;
    processingSteps: string[];
  };
}

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!analysisData ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow mb-4">
                <FileText className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AI Financial Analyst
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload financial reports and get instant AI-powered analysis with industry benchmarks
              </p>
            </div>
            
            <DocumentUpload 
              onAnalysisComplete={setAnalysisData}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </div>
        ) : (
          <AnalysisResults 
            data={analysisData} 
            onReset={() => setAnalysisData(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

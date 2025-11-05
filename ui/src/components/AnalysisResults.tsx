import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft, 
  Building2, 
  Activity,
  Layers,
  CheckCircle2
} from "lucide-react";
import { AnalysisData } from "@/pages/Index";
import { MetricCard } from "@/components/MetricCard";

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

export const AnalysisResults = ({ data, onReset }: AnalysisResultsProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button 
          onClick={onReset} 
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Analyze Another Report
        </Button>
      </div>

      {/* Company Header */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-2">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{data.companyName}</h2>
                <p className="text-muted-foreground">{data.industry} Industry</p>
              </div>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30">
            Analysis Complete
          </Badge>
        </div>
      </Card>

      {/* RAG Process */}
      <Card className="p-6 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                RAG Processing Pipeline
              </h3>
              <p className="text-sm text-muted-foreground">
                Document analyzed using Retrieval Augmented Generation
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.ragProcess.processingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">
                Processed {data.ragProcess.documentChunks} document chunks
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Metrics Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">Financial Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Gross Margin"
            value={data.metrics.grossMargin}
            suffix="%"
            trend="up"
            description="Revenue minus cost of goods sold"
          />
          <MetricCard
            title="SG&A Ratio"
            value={data.metrics.sgaRatio}
            suffix="%"
            trend="down"
            description="Selling, general & administrative expenses"
          />
          <MetricCard
            title="ROE"
            value={data.metrics.roe}
            suffix="%"
            trend="up"
            description="Return on equity"
          />
          <MetricCard
            title="ROA"
            value={data.metrics.roa}
            suffix="%"
            trend="up"
            description="Return on assets"
          />
          <MetricCard
            title="Current Ratio"
            value={data.metrics.currentRatio}
            suffix="x"
            trend="up"
            description="Current assets / current liabilities"
          />
          <MetricCard
            title="Debt-to-Equity"
            value={data.metrics.debtToEquity}
            suffix="x"
            trend="neutral"
            description="Total debt / shareholders' equity"
          />
          <MetricCard
            title="Operating Margin"
            value={data.metrics.operatingMargin}
            suffix="%"
            trend="up"
            description="Operating income / revenue"
          />
          <MetricCard
            title="Net Margin"
            value={data.metrics.netMargin}
            suffix="%"
            trend="up"
            description="Net income / revenue"
          />
          <MetricCard
            title="Asset Turnover"
            value={data.metrics.assetTurnover}
            suffix="x"
            trend="neutral"
            description="Revenue / total assets"
          />
        </div>
      </div>

      {/* AI Summary */}
      <Card className="p-6 border-2">
        <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          AI Performance Summary
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">{data.summary}</p>
        
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold mb-2 text-foreground">Industry Benchmarks</h4>
          <p className="text-sm text-muted-foreground">{data.industryBenchmarks}</p>
        </div>
      </Card>
    </div>
  );
};

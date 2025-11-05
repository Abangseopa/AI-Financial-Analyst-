import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AnalysisData } from "@/pages/Index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DocumentUploadProps {
  onAnalysisComplete: (data: AnalysisData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Retail",
  "Manufacturing",
  "Energy",
  "Real Estate",
  "Consumer Goods",
  "Telecommunications",
  "Transportation",
  "Pharmaceuticals",
  "Automotive",
  "Aerospace & Defense",
  "Entertainment & Media",
  "Hospitality",
  "Agriculture",
  "Construction",
  "Education",
  "Utilities",
  "Other"
];

export const DocumentUpload = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: DocumentUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please upload a financial report first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedIndustry) {
      toast({
        title: "Industry Required",
        description: "Please select an industry for the company.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(20);

    try {
      console.log('Uploading document for analysis...');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('industry', selectedIndustry);
      
      setUploadProgress(40);

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-financial-report`;
      
      console.log('Calling analysis function...');
      const response = await fetch(functionUrl, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Analysis error:', errorData);
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log('Analysis complete:', data);
      
      setUploadProgress(100);
      
      toast({
        title: "Analysis Complete",
        description: "Your financial report has been analyzed successfully.",
      });

      onAnalysisComplete(data);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-8 shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {selectedFile ? (
              <FileText className="w-8 h-8 text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {isDragActive ? "Drop your file here" : "Upload Financial Report"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to select (PDF, DOC, DOCX)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">
              Company Industry
            </Label>
            <Select 
              value={selectedIndustry} 
              onValueChange={setSelectedIndustry}
              disabled={isAnalyzing}
            >
              <SelectTrigger 
                id="industry"
                className="w-full bg-card border-2 focus:border-primary"
              >
                <SelectValue placeholder="Select industry sector" />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 z-50 max-h-[300px]">
                {INDUSTRIES.map((industry) => (
                  <SelectItem 
                    key={industry} 
                    value={industry}
                    className="cursor-pointer hover:bg-muted focus:bg-muted"
                  >
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyzing document...</span>
                <span className="font-semibold text-primary">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Report"}
            </Button>
            
            {!isAnalyzing && (
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setSelectedIndustry("");
                }}
                variant="outline"
                size="lg"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Your document will be analyzed using AI with Retrieval Augmented Generation (RAG) 
              to extract financial metrics and compare against industry benchmarks.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

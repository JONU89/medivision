import Image from 'next/image';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import type { ImageAnalysisAndPredictionOutput } from '@/ai/flows/image-analysis-and-prediction';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from './ui/separator';

interface PredictionResultsProps {
  result: ImageAnalysisAndPredictionOutput;
  imageUrl: string;
  onReset: () => void;
}

const getRiskInfo = (
  risk: string
): { color: string; bgColor: string; Icon: LucideIcon } => {
  switch (risk.toLowerCase()) {
    case 'high':
      return {
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        Icon: AlertOctagon,
      };
    case 'medium':
      return {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        Icon: AlertTriangle,
      };
    case 'low':
    default:
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        Icon: CheckCircle2,
      };
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence > 0.75) return 'bg-destructive';
  if (confidence > 0.4) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function PredictionResults({
  result,
  imageUrl,
  onReset,
}: PredictionResultsProps) {
  const riskInfo = getRiskInfo(result.riskAssessment);

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500">
      <Card className="shadow-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Uploaded Image
            </h2>
            <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
              <Image
                src={imageUrl}
                alt="Uploaded medical scan"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold tracking-tight">
                  Analysis Results
                </span>
                <Badge
                  variant="outline"
                  className={`border-2 text-base font-bold py-1 px-3 ${riskInfo.color} ${riskInfo.bgColor} border-current`}
                >
                  <riskInfo.Icon className="mr-2 h-5 w-5" />
                  {result.riskAssessment} Risk
                </Badge>
              </CardTitle>
            </CardHeader>

            <div className="flex-grow space-y-4">
              <p className="text-muted-foreground">
                The AI has identified the following potential issues based on
                the provided image.
              </p>
              <Separator />
              <div className="space-y-5 max-h-80 overflow-y-auto pr-2">
                {result.predictions.map((prediction, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-foreground">
                        {prediction}
                      </h3>
                      <span className="text-sm font-medium text-muted-foreground">
                        {(result.confidenceLevels[index] * 100).toFixed(0)}%
                        Confidence
                      </span>
                    </div>
                    <Progress
                      value={result.confidenceLevels[index] * 100}
                      className="h-2 [&>div]:"
                      indicatorClassName={getConfidenceColor(
                        result.confidenceLevels[index]
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={onReset} className="mt-6 w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Analyze Another Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add indicatorClassName to Progress component props if it doesn't exist
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    indicatorClassName?: string;
  }
}

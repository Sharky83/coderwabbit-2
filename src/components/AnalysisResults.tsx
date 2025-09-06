import React from "react";
import { ComplexitySummarySection } from "./results/ComplexitySummarySection";
import { SecretsResults } from "./results/SecretsResults";
import { SafetyResults } from "./results/SafetyResults";
import { MypyResults } from "./results/MypyResults";
import { BanditResults } from "./results/BanditResults";
import { VultureResults } from "./results/VultureResults";
import { PylintResults } from "./results/PylintResults";
import { MultiPipAuditResults } from "./results/MultiPipAuditResults";
import { PytestResults } from "./results/PytestResults";
import { HypothesisResults } from "./results/HypothesisResults";
import { CoverageResults } from "./results/CoverageResults";
// If you use a context/provider for repoName and accessToken, import them here
// import { useSession } from "next-auth/react"; // Example if using next-auth
import {
  ComplexitySummaryProps,
  SecretsResultsProps,
  MypyResultsProps,
  VultureResultsProps
} from "./results/resultsTypes";

export interface AnalysisResultsProps {
  result: any;
  repoName: string;
  accessToken: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, repoName, accessToken }) => {
  if (!result) return null;
  const tempDir = result?.tempDir;
  return (
    <>
      {result?.complexitySummary && <ComplexitySummarySection complexitySummary={result.complexitySummary as ComplexitySummaryProps['complexitySummary']} />}
      {result?.testResults?.detectSecrets && <SecretsResults detectSecrets={result.testResults.detectSecrets as SecretsResultsProps['detectSecrets']} />}
      {result?.testResults?.safety && <SafetyResults safety={result.testResults.safety} />}
      {result?.testResults?.mypy && <MypyResults mypy={result.testResults.mypy as MypyResultsProps['mypy']} />}
      {result?.testResults?.bandit && <BanditResults bandit={result.testResults.bandit} />}
      {result?.testResults?.vulture && <VultureResults vulture={result.testResults.vulture as VultureResultsProps['vulture']} />}
      {result?.testResults?.pylint && <PylintResults pylint={result.testResults.pylint} />}
      {result?.testResults?.pipAudit && <MultiPipAuditResults pipAudit={result.testResults.pipAudit} />}
      {result?.testResults?.pytest && <PytestResults pytest={result.testResults.pytest} />}
      {tempDir && (
        <HypothesisResults tempDir={tempDir} accessToken={accessToken} />
      )}
      {result?.testResults?.coverage && <CoverageResults coverage={result.testResults.coverage} />}
    </>
  );
};

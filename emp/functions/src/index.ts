import { oratorFlow } from './flows/orator';
import { spectreFlow } from './flows/spectre';
import { toxinFlow } from './flows/toxin';
import { echoFlow } from './flows/echo';
import { promptGenerationFlow } from './flows/maker/prompt_generation';
import { responseInterpretationFlow } from './flows/maker/response_interpretation';
import { socraticPerturbationFlow } from './flows/maker/socratic_perturbation';
import { generatePersonaFlow } from './flows/ai_helpers/generatePersona';
import { recommendVectorsFlow } from './flows/ai_helpers/recommendVectors';
import { generateInitialPromptsFlow } from './flows/ai_helpers/generateInitialPrompts';
import { generateFollowUpFlow } from './flows/ai_helpers/generateFollowUp';
import { analyzeOperationFlow } from './flows/ai_helpers/analyzeOperation';
import { operationManagementFlow } from './flows/operation_management';
import { reportingFlow } from './flows/reporting';
import { processSpectreTask } from './tasks/processSpectreTask';
import { processToxinTask } from './tasks/processToxinTask';
import { processEchoTask } from './tasks/processEchoTask';
import { threatIntelScraperFlow } from './scheduled/threatIntelScraper';

export const flows = {
  oratorFlow,
  spectreFlow,
  toxinFlow,
  echoFlow,
  promptGenerationFlow,
  responseInterpretationFlow,
  socraticPerturbationFlow,
  generatePersonaFlow,
  recommendVectorsFlow,
  generateInitialPromptsFlow,
  generateFollowUpFlow,
  analyzeOperationFlow,
  operationManagementFlow,
  reportingFlow,
  processSpectreTask,
  processToxinTask,
  processEchoTask,
  threatIntelScraperFlow,
};
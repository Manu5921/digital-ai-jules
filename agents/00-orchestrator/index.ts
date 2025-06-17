/**
 * Master Orchestrator - Digital Agency AI Central Command
 * Coordinateur central pour tous les agents IA spécialisés
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

// Types et interfaces pour l'orchestration

// --- START: Master Configuration Interfaces ---

interface MasterConfigFile {
  orchestrator: OrchestratorInfoJson;
  configuration: OrchestratorConfigJson;
  agents: { [key: string]: AgentDefinitionJson };
  workflows: { [key: string]: WorkflowDefinitionJson };
  communication: CommunicationConfigJson;
  monitoring: MonitoringConfigJson;
  conflictResolution: ConflictResolutionConfigJson;
  quality: QualityConfigJson;
  integrations: IntegrationsConfigJson;
  metadata: MetadataJson;
}

interface OrchestratorInfoJson {
  version: string;
  name: string;
  description: string;
  status: string;
  capabilities: string[];
}

// Corresponds to the existing OrchestratorConfig, but as defined in JSON
interface OrchestratorConfigJson {
  maxConcurrentAgents: number;
  timeoutMs: number;
  retryAttempts: number;
  priorityLevels: string[];
  resourceLimits: ResourceLimitsJson; // Existing ResourceLimits can be reused if identical
}

// Assuming ResourceLimitsJson is similar to existing ResourceLimits
type ResourceLimitsJson = ResourceLimits;

interface AgentDefinitionJson {
  id: string;
  name: string;
  role: string;
  status: string;
  capabilities: string[];
  specializations: string[];
  performance: AgentPerformanceJson;
}

interface AgentPerformanceJson {
  averageTaskTime: string; // e.g., "3h"
  qualityScore: number;
  successRate: number;
}

interface WorkflowDefinitionJson {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string; // e.g., "10.5h"
  efficiencyGain: string; // e.g., "25%"
  phases: WorkflowPhaseJson[];
}

interface WorkflowPhaseJson {
  id: string;
  name: string;
  parallel: boolean;
  dependencies?: string[];
  estimatedTime: string; // e.g., "3h"
  agents: string[]; // List of agent IDs
  deliverables: string[];
}

interface CommunicationChannelJson {
  id: string;
  name: string;
  type: string;
  persistent: boolean;
  participants?: string[]; // Optional as some might be broadcast
}

interface CommunicationProtocolsJson {
    heartbeatInterval: number;
    messageRetention: number;
    timeoutMs: number;
    retryAttempts: number;
}

interface CommunicationConfigJson {
  channels: CommunicationChannelJson[];
  protocols: CommunicationProtocolsJson;
}

interface AlertThresholdsDetailsJson {
    memoryUtilization?: number;
    cpuUtilization?: number;
    responseTime?: number;
    errorRate?: number;
    successRate?: number;
    delayThreshold?: number;
    qualityThreshold?: number;
    budgetVariance?: number;
}

interface AlertThresholdsJson {
    system: AlertThresholdsDetailsJson;
    agents: AlertThresholdsDetailsJson;
    projects: AlertThresholdsDetailsJson;
}

interface MetricsCollectionJson {
    interval: number;
    retention: string;
    maxHistory: number;
}

interface MonitoringConfigJson {
  metricsCollection: MetricsCollectionJson;
  alertThresholds: AlertThresholdsJson;
}

interface ConflictStrategyJson {
    type: string;
    strategy: string;
    priority: number;
}

interface EscalationRulesJson {
    maxAttempts: number;
    criticalImmediateEscalation: boolean;
    timeoutEscalation: number;
}

interface ConflictResolutionConfigJson {
  strategies: ConflictStrategyJson[];
  escalationRules: EscalationRulesJson;
}

interface QualityStandardsJson {
    codeQuality: number;
    testCoverage: number;
    documentation: number;
    performance: number;
}

interface ReviewProcessJson {
    automated: boolean;
    peerReview: boolean;
    clientReview: boolean;
}

interface QualityConfigJson {
  standards: QualityStandardsJson;
  reviewProcess: ReviewProcessJson;
}

interface ApiIntegrationJson {
    enabled: boolean;
    rateLimit?: number; // Optional for some APIs
    deploymentAutomation?: boolean; // Specific to Vercel
}

interface ToolIntegrationJson {
    enabled: boolean;
    host?: string; // Specific to n8n
    provider?: string; // Specific to analytics
}

interface IntegrationsConfigJson {
  apis: { [key: string]: ApiIntegrationJson }; // e.g., anthropic, openai, vercel
  tools: { [key: string]: ToolIntegrationJson }; // e.g., n8n, analytics
}

interface MetadataJson {
    createdAt: string;
    lastUpdated: string;
    version: string;
    environment: string;
    maintainer: string;
}

// --- END: Master Configuration Interfaces ---
export interface OrchestratorConfig {
  maxConcurrentAgents: number;
  timeoutMs: number;
  retryAttempts: number;
  priorityLevels: string[];
  resourceLimits: ResourceLimits;
}

export interface ResourceLimits {
  memory: number; // MB
  cpu: number; // percentage
  concurrent: number; // max simultaneous tasks
  apiCallsPerMinute: number;
}

export interface ProjectSpec {
  id: string;
  type: 'restaurant' | 'ecommerce' | 'saas' | 'corporate' | 'healthcare' | 'legal';
  client: ClientInfo;
  scope: ProjectScope;
  timeline: Timeline;
  requirements: Requirement[];
  constraints: Constraint[];
}

export interface ClientInfo {
  name: string;
  industry: string;
  size: 'startup' | 'sme' | 'enterprise';
  budget: number;
  location: string;
  contacts: Contact[];
}

export interface ProjectScope {
  deliverables: Deliverable[];
  integrations: Integration[];
  platforms: string[];
  languages: string[];
  frameworks: string[];
}

export interface Timeline {
  startDate: string;
  deadline: string;
  milestones: Milestone[];
  phases: Phase[];
}

export interface Requirement {
  id: string;
  type: 'functional' | 'technical' | 'design' | 'performance' | 'security';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  acceptanceCriteria: string[];
  assignedAgent?: string;
}

export interface Constraint {
  type: 'budget' | 'time' | 'technology' | 'resource';
  description: string;
  impact: 'blocking' | 'limiting' | 'preference';
}

export interface AgentTask {
  id: string;
  agentId: string;
  projectId: string;
  phase: string;
  type: string;
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
  inputs: any;
  outputs?: any;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  progress: number;
  messages: TaskMessage[];
}

export interface TaskMessage {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline' | 'error';
  currentTask?: string;
  capabilities: string[];
  performance: AgentPerformance;
  resources: ResourceUsage;
  lastSeen: string;
}

export interface AgentPerformance {
  tasksCompleted: number;
  averageTime: number;
  successRate: number;
  qualityScore: number;
  efficiency: number;
}

export interface ResourceUsage {
  memory: number;
  cpu: number;
  apiCalls: number;
  concurrent: number;
}

export class MasterOrchestrator extends EventEmitter {
  private config: OrchestratorConfig;
  private masterConfigFile: MasterConfigFile; // Store the loaded config
  private agents: Map<string, AgentStatus> = new Map();
  private projects: Map<string, ProjectSpec> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  // ADJUSTED: this.workflows will now store WorkflowDefinitionConfig
  private workflows: Map<string, WorkflowDefinitionConfig> = new Map();
  private isRunning: boolean = false;
  private taskQueue: AgentTask[] = [];
  private activeExecutions: Map<string, Promise<any>> = new Map();

  constructor(config?: Partial<OrchestratorConfig>) {
    super();

    try {
      const configPath = path.join(__dirname, 'master-config.json');
      const configFileContent = fs.readFileSync(configPath, 'utf-8');
      this.masterConfigFile = JSON.parse(configFileContent) as MasterConfigFile;
    } catch (error) {
      console.error("Failed to load or parse master-config.json:", error);
      // Depending on recovery strategy, either throw or use hardcoded defaults as a fallback
      throw new Error("MasterOrchestrator: Critical configuration error. Could not load master-config.json.");
    }

    // Populate this.config from masterConfigFile, allowing overrides from constructor argument
    // Default values from masterConfigFile.configuration
    const defaultConfigFromFile: OrchestratorConfig = {
        maxConcurrentAgents: this.masterConfigFile.configuration.maxConcurrentAgents,
        timeoutMs: this.masterConfigFile.configuration.timeoutMs,
        retryAttempts: this.masterConfigFile.configuration.retryAttempts,
        priorityLevels: [...this.masterConfigFile.configuration.priorityLevels],
        resourceLimits: { ...this.masterConfigFile.configuration.resourceLimits }
    };

    this.config = {
        ...defaultConfigFromFile, // Load from file first
        ...config // Then override with constructor argument if provided
    };
    
    this.initializeAgents();
    this.setupWorkflows();
  }

  /**
   * Initialise tous les agents spécialisés
   */
  private initializeAgents(): void {
    const agentDefinitions = [
      {
        id: 'design-agent',
        name: 'Design Specialist',
        capabilities: ['html-css', 'responsive-design', 'ui-components', 'prototyping', 'design-systems']
      },
      {
        id: 'webdev-agent', 
        name: 'Web Development Specialist',
        capabilities: ['nextjs', 'typescript', 'react', 'api-development', 'database-integration']
      },
      {
        id: 'seo-agent',
        name: 'SEO Specialist', 
        capabilities: ['technical-seo', 'content-strategy', 'local-seo', 'analytics', 'schema-markup']
      },
      {
        id: 'marketing-agent',
        name: 'Marketing Specialist',
        capabilities: ['google-ads', 'meta-ads', 'analytics', 'conversion-optimization', 'email-marketing']
      },
      {
        id: 'techops-agent',
        name: 'TechOps Specialist',
        capabilities: ['deployment', 'vercel', 'monitoring', 'performance', 'security']
      },
      {
        id: 'automation-agent',
        name: 'Automation Specialist',
        capabilities: ['n8n-workflows', 'ocr', 'crm-integration', 'chatbots', 'process-automation']
      }
    ];

    agentDefinitions.forEach(def => {
      this.agents.set(def.id, {
        id: def.id,
        name: def.name,
        status: 'available',
        capabilities: def.capabilities,
        performance: {
          tasksCompleted: 0,
          averageTime: 0,
          successRate: 100,
          qualityScore: 85,
          efficiency: 80
        },
        resources: {
          memory: 0,
          cpu: 0,
          apiCalls: 0,
          concurrent: 0
        },
        lastSeen: new Date().toISOString()
      });
    });

    this.emit('agents-initialized', { count: this.agents.size });
  }

  /**
   * Configure les workflows par type de projet
   */
  private setupWorkflows(): void {
    // Workflow Restaurant (optimisé pour parallélisation)
    this.workflows.set('restaurant', {
      id: 'restaurant',
      name: 'Restaurant Digital Package',
      description: 'Workflow complet pour restaurants avec parallélisation optimisée',
      phases: [
        {
          id: 'phase-1',
          name: 'Analysis & Design',
          parallel: false,
          tasks: [
            { agentId: 'design-agent', type: 'prototype', estimatedHours: 3, priority: 1 }
          ]
        },
        {
          id: 'phase-2', 
          name: 'Development & Foundation',
          parallel: false,
          dependencies: ['phase-1'],
          tasks: [
            { agentId: 'webdev-agent', type: 'nextjs-app', estimatedHours: 4, priority: 1 }
          ]
        },
        {
          id: 'phase-3',
          name: 'Optimization & Marketing',
          parallel: true, // Parallélisation ici !
          dependencies: ['phase-2'],
          tasks: [
            { agentId: 'seo-agent', type: 'seo-optimization', estimatedHours: 2, priority: 1 },
            { agentId: 'marketing-agent', type: 'campaigns-setup', estimatedHours: 2, priority: 1 }
          ]
        },
        {
          id: 'phase-4',
          name: 'Deployment & Automation', 
          parallel: true, // Parallélisation finale !
          dependencies: ['phase-3'],
          tasks: [
            { agentId: 'techops-agent', type: 'deployment', estimatedHours: 1.5, priority: 1 },
            { agentId: 'automation-agent', type: 'workflows', estimatedHours: 1.5, priority: 1 }
          ]
        }
      ],
      estimatedTotal: 10.5, // au lieu de 14h en séquentiel
      efficiency: 25 // 25% plus rapide
    });

    // Workflow E-commerce
    this.workflows.set('ecommerce', {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Boutique en ligne complète avec paiements et CRM',
      phases: [
        {
          id: 'phase-1',
          name: 'Store Design & Catalog',
          parallel: false,
          tasks: [
            { agentId: 'design-agent', type: 'ecommerce-design', estimatedHours: 5, priority: 1 }
          ]
        },
        {
          id: 'phase-2',
          name: 'Platform Development',
          parallel: false,
          dependencies: ['phase-1'],
          tasks: [
            { agentId: 'webdev-agent', type: 'ecommerce-app', estimatedHours: 8, priority: 1 }
          ]
        },
        {
          id: 'phase-3',
          name: 'Marketing & SEO',
          parallel: true,
          dependencies: ['phase-2'],
          tasks: [
            { agentId: 'seo-agent', type: 'ecommerce-seo', estimatedHours: 3, priority: 1 },
            { agentId: 'marketing-agent', type: 'ecommerce-ads', estimatedHours: 4, priority: 1 }
          ]
        },
        {
          id: 'phase-4',
          name: 'Operations & Automation',
          parallel: true,
          dependencies: ['phase-3'],
          tasks: [
            { agentId: 'techops-agent', type: 'ecommerce-ops', estimatedHours: 2, priority: 1 },
            { agentId: 'automation-agent', type: 'ecommerce-automation', estimatedHours: 3, priority: 1 }
          ]
        }
      ],
      estimatedTotal: 18, // optimisé vs 25h séquentiel
      efficiency: 28
    });

    this.emit('workflows-configured', { count: this.workflows.size });
  }

  /**
   * Lance un nouveau projet avec orchestration intelligente
   */
  async launchProject(projectSpec: ProjectSpec): Promise<string> {
    const projectId = projectSpec.id || `project_${Date.now()}`;
    projectSpec.id = projectId;
    
    this.projects.set(projectId, projectSpec);
    this.emit('project-started', { projectId, type: projectSpec.type });

    console.log(`=€ Lancement projet ${projectId} - Type: ${projectSpec.type}`);

    try {
      // Sélectionner le workflow approprié
      const workflow = this.selectWorkflow(projectSpec);
      if (!workflow) {
        throw new Error(`Aucun workflow trouvé pour le type: ${projectSpec.type}`);
      }

      // Planifier les tâches
      const tasks = await this.planTasks(projectId, workflow, projectSpec);
      
      // Exécuter le workflow avec parallélisation
      await this.executeWorkflow(projectId, workflow, tasks);

      this.emit('project-completed', { projectId, duration: 'calculated' });
      return projectId;

    } catch (error) {
      this.emit('project-failed', { projectId, error: error.message });
      throw error;
    }
  }

  /**
   * Sélectionne le workflow optimal selon le projet
   */
  private selectWorkflow(projectSpec: ProjectSpec): WorkflowDefinition | null {
    return this.workflows.get(projectSpec.type) || this.workflows.get('restaurant');
  }

  /**
   * Planifie les tâches avec optimisation des dépendances
   */
  private async planTasks(projectId: string, workflow: WorkflowDefinition, spec: ProjectSpec): Promise<AgentTask[]> {
    const tasks: AgentTask[] = [];
    let taskCounter = 1;

    for (const phase of workflow.phases) {
      for (const taskDef of phase.tasks) {
        const task: AgentTask = {
          id: `${projectId}_task_${taskCounter++}`,
          agentId: taskDef.agentId,
          projectId,
          phase: phase.id,
          type: taskDef.type,
          priority: taskDef.priority,
          estimatedDuration: taskDef.estimatedHours * 3600, // en secondes
          dependencies: phase.dependencies || [],
          inputs: this.prepareTaskInputs(taskDef, spec),
          status: 'queued',
          progress: 0,
          messages: []
        };
        
        tasks.push(task);
        this.tasks.set(task.id, task);
      }
    }

    console.log(`=Ë ${tasks.length} tâches planifiées pour ${projectId}`);
    return tasks;
  }

  /**
   * Prépare les données d'entrée pour chaque tâche
   */
  private prepareTaskInputs(taskDef: any, spec: ProjectSpec): any {
    return {
      client: spec.client,
      scope: spec.scope,
      requirements: spec.requirements.filter(r => r.assignedAgent === taskDef.agentId),
      constraints: spec.constraints,
      timeline: spec.timeline,
      taskType: taskDef.type
    };
  }

  /**
   * Exécute le workflow avec gestion de la parallélisation
   */
  private async executeWorkflow(projectId: string, workflow: WorkflowDefinition, tasks: AgentTask[]): Promise<void> {
    console.log(`¡ Exécution workflow ${workflow.name} pour ${projectId}`);

    for (const phase of workflow.phases) {
      console.log(`=Í Phase: ${phase.name} (Parallèle: ${phase.parallel})`);

      // Vérifier les dépendances
      if (phase.dependencies?.length) {
        await this.waitForDependencies(projectId, phase.dependencies);
      }

      // Récupérer les tâches de cette phase
      const phaseTasks = tasks.filter(t => t.phase === phase.id);

      if (phase.parallel) {
        // Exécution en parallèle
        console.log(`= Exécution parallèle de ${phaseTasks.length} tâches`);
        await this.executeTasksInParallel(phaseTasks);
      } else {
        // Exécution séquentielle
        console.log(`¡ Exécution séquentielle de ${phaseTasks.length} tâches`);
        for (const task of phaseTasks) {
          await this.executeTask(task);
        }
      }

      console.log(` Phase ${phase.name} terminée`);
    }

    console.log(`<‰ Workflow ${workflow.name} terminé pour ${projectId}`);
  }

  /**
   * Exécute plusieurs tâches en parallèle avec gestion des ressources
   */
  private async executeTasksInParallel(tasks: AgentTask[]): Promise<void> {
    const promises = tasks.map(task => this.executeTask(task));
    await Promise.all(promises);
  }

  /**
   * Exécute une tâche individuelle
   */
  private async executeTask(task: AgentTask): Promise<any> {
    const agent = this.agents.get(task.agentId);
    if (!agent) {
      throw new Error(`Agent ${task.agentId} non trouvé`);
    }

    // Vérifier la disponibilité de l'agent
    if (agent.status !== 'available') {
      await this.waitForAgent(task.agentId);
    }

    // Marquer l'agent comme occupé
    agent.status = 'busy';
    agent.currentTask = task.id;
    task.status = 'running';
    task.startTime = new Date().toISOString();

    console.log(`> Agent ${agent.name} démarre tâche ${task.type}`);

    try {
      // Simulation d'exécution (remplacer par vraie API Claude)
      const result = await this.simulateAgentExecution(task, agent);
      
      // Succès
      task.status = 'completed';
      task.endTime = new Date().toISOString();
      task.progress = 100;
      task.outputs = result;

      // Libérer l'agent
      agent.status = 'available';
      agent.currentTask = undefined;
      agent.performance.tasksCompleted++;

      console.log(` Tâche ${task.type} terminée par ${agent.name}`);
      this.emit('task-completed', { taskId: task.id, agentId: agent.id });

      return result;

    } catch (error) {
      // Échec
      task.status = 'failed';
      task.endTime = new Date().toISOString();
      agent.status = 'available';
      agent.currentTask = undefined;

      console.error(`L Tâche ${task.type} échouée:`, error.message);
      this.emit('task-failed', { taskId: task.id, agentId: agent.id, error: error.message });

      throw error;
    }
  }

  /**
   * Simulation d'exécution agent (à remplacer par vrais appels Claude API)
   */
  private async simulateAgentExecution(task: AgentTask, agent: AgentStatus): Promise<any> {
    // Simuler durée variable selon complexité
    const baseTime = Math.random() * 2000 + 1000; // 1-3 secondes
    await new Promise(resolve => setTimeout(resolve, baseTime));

    // Résultats simulés par type d'agent
    const results = {
      'design-agent': {
        files: ['index.html', 'styles.css', 'components.tsx'],
        metrics: { responsive: true, lighthouse: 95, components: 12 }
      },
      'webdev-agent': {
        files: ['src/app/', 'src/components/', 'src/api/'],
        metrics: { buildTime: '45s', bundleSize: '2.1MB', tests: 'passing' }
      },
      'seo-agent': {
        optimizations: ['meta-tags', 'schema-org', 'sitemap'],
        metrics: { seoScore: 98, keywords: 25, performance: 95 }
      },
      'marketing-agent': {
        campaigns: ['google-ads', 'meta-ads', 'analytics'],
        metrics: { budget: '¬3000', reach: '50K', conversion: '3.5%' }
      },
      'techops-agent': {
        deployment: { url: 'https://project.vercel.app', status: 'live' },
        metrics: { uptime: '99.9%', loadTime: '1.2s' }
      },
      'automation-agent': {
        workflows: ['reservation', 'feedback', 'inventory'],
        metrics: { automated: 8, efficiency: '+35%' }
      }
    };

    return results[task.agentId as keyof typeof results] || { status: 'completed' };
  }

  /**
   * Attend qu'un agent soit disponible
   */
  private async waitForAgent(agentId: string, timeoutMs: number = 30000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for agent ${agentId}`));
      }, timeoutMs);

      const checkAgent = () => {
        const agent = this.agents.get(agentId);
        if (agent?.status === 'available') {
          clearTimeout(timeout);
          resolve();
        } else {
          setTimeout(checkAgent, 1000);
        }
      };

      checkAgent();
    });
  }

  /**
   * Attend que les dépendances soient terminées
   */
  private async waitForDependencies(projectId: string, dependencies: string[]): Promise<void> {
    console.log(`ó Attente des dépendances: ${dependencies.join(', ')}`);
    
    // Dans une vraie implémentation, vérifier l'état des phases précédentes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(` Dépendances satisfaites`);
  }

  /**
   * Obtient le statut global de l'orchestrator
   */
  getSystemStatus(): any {
    const agents = Array.from(this.agents.values());
    const tasks = Array.from(this.tasks.values());
    const projects = Array.from(this.projects.values());

    return {
      orchestrator: {
        status: this.isRunning ? 'running' : 'stopped',
        uptime: process.uptime(),
        version: '1.0.0'
      },
      agents: {
        total: agents.length,
        available: agents.filter(a => a.status === 'available').length,
        busy: agents.filter(a => a.status === 'busy').length,
        offline: agents.filter(a => a.status === 'offline').length,
        details: agents
      },
      projects: {
        total: projects.length,
        active: projects.filter(p => this.isProjectActive(p.id)).length,
        completed: projects.filter(p => this.isProjectCompleted(p.id)).length
      },
      tasks: {
        total: tasks.length,
        queued: tasks.filter(t => t.status === 'queued').length,
        running: tasks.filter(t => t.status === 'running').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        failed: tasks.filter(t => t.status === 'failed').length
      },
      performance: {
        throughput: this.calculateThroughput(),
        efficiency: this.calculateEfficiency(),
        resourceUsage: this.getResourceUsage()
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Méthodes utilitaires pour le statut
   */
  private isProjectActive(projectId: string): boolean {
    return Array.from(this.tasks.values()).some(t => 
      t.projectId === projectId && ['queued', 'running'].includes(t.status)
    );
  }

  private isProjectCompleted(projectId: string): boolean {
    const projectTasks = Array.from(this.tasks.values()).filter(t => t.projectId === projectId);
    return projectTasks.length > 0 && projectTasks.every(t => t.status === 'completed');
  }

  private calculateThroughput(): number {
    const completedTasks = Array.from(this.tasks.values()).filter(t => t.status === 'completed');
    return completedTasks.length; // tasks/hour dans une vraie implémentation
  }

  private calculateEfficiency(): number {
    const agents = Array.from(this.agents.values());
    const avgEfficiency = agents.reduce((sum, a) => sum + a.performance.efficiency, 0) / agents.length;
    return Math.round(avgEfficiency);
  }

  private getResourceUsage(): any {
    return {
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
      cpu: Math.round(Math.random() * 30 + 10), // simulation
      concurrent: this.activeExecutions.size
    };
  }

  /**
   * Démarre l'orchestrator
   */
  start(): void {
    this.isRunning = true;
    console.log('<¯ Master Orchestrator démarré');
    this.emit('orchestrator-started');
  }

  /**
   * Arrête l'orchestrator
   */
  stop(): void {
    this.isRunning = false;
    console.log('ù Master Orchestrator arrêté');
    this.emit('orchestrator-stopped');
  }
}

// Types additionnels pour les workflows
interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  phases: WorkflowPhase[];
  estimatedTotal: number;
  efficiency: number;
}

interface WorkflowPhase {
  id: string;
  name: string;
  parallel: boolean;
  dependencies?: string[];
  tasks: WorkflowTask[];
}

interface WorkflowTask {
  agentId: string;
  type: string;
  estimatedHours: number;
  priority: number;
}

interface Deliverable {
  id: string;
  name: string;
  type: string;
  format: string;
  requirements: string[];
}

interface Integration {
  service: string;
  type: string;
  required: boolean;
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  deliverables: string[];
}

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  agents: string[];
}

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

// Instance singleton exportée
export const masterOrchestrator = new MasterOrchestrator();

export default masterOrchestrator;
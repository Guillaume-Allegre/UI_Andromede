import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type Scenario,
  type InsertScenario,
  type Tool,
  type InsertTool,
  type Agent,
  type InsertAgent,
  type SimulationRun,
  type InsertSimulationRun,
  type WorkflowNode,
  type WorkflowEdge,
  type AgentConfig,
  type SimulationResult,
  type SimulationLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Scenarios
  getScenario(id: string): Promise<Scenario | undefined>;
  getScenariosByProject(projectId: string): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  updateScenario(id: string, scenario: Partial<Scenario>): Promise<Scenario | undefined>;
  deleteScenario(id: string): Promise<boolean>;

  // Tools
  getTool(id: string): Promise<Tool | undefined>;
  getToolsByProject(projectId: string): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: string, tool: Partial<Tool>): Promise<Tool | undefined>;
  deleteTool(id: string): Promise<boolean>;

  // Agents
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentsByProject(projectId: string): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, agent: Partial<Agent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Simulation Runs
  getSimulationRun(id: string): Promise<SimulationRun | undefined>;
  getSimulationRunsByScenario(scenarioId: string): Promise<SimulationRun[]>;
  createSimulationRun(run: InsertSimulationRun): Promise<SimulationRun>;
  updateSimulationRun(id: string, run: Partial<SimulationRun>): Promise<SimulationRun | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private scenarios: Map<string, Scenario>;
  private tools: Map<string, Tool>;
  private agents: Map<string, Agent>;
  private simulationRuns: Map<string, SimulationRun>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.scenarios = new Map();
    this.tools = new Map();
    this.agents = new Map();
    this.simulationRuns = new Map();

    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user",
      username: "demo",
      password: "demo123"
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo project
    const demoProject: Project = {
      id: "demo-project",
      name: "Helix",
      description: "AI Agent Platform",
      userId: demoUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(demoProject.id, demoProject);

    // Create demo tools
    const demoTools: Tool[] = [
      {
        id: "tool-outlook",
        name: "Outlook",
        type: "outlook",
        description: "Email Tool",
        config: {},
        isActive: true,
        projectId: demoProject.id
      },
      {
        id: "tool-calendar",
        name: "Calendar",
        type: "calendar",
        description: "Scheduling Tool",
        config: {},
        isActive: true,
        projectId: demoProject.id
      },
      {
        id: "tool-salesforce",
        name: "SalesForce",
        type: "salesforce",
        description: "CRM Tool",
        config: {},
        isActive: true,
        projectId: demoProject.id
      },
      {
        id: "tool-openai",
        name: "OpenAI",
        type: "openai",
        description: "LLM Provider",
        config: {},
        isActive: true,
        projectId: demoProject.id
      }
    ];

    demoTools.forEach(tool => this.tools.set(tool.id, tool));

    // Create demo agents
    const demoAgents: Agent[] = [
      {
        id: "agent-salesgpt",
        name: "SalesGPT",
        type: "openai",
        description: "Intelligent sales agent",
        config: {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 2048,
          tools: ["tool-salesforce", "tool-calendar"]
        },
        projectId: demoProject.id
      }
    ];

    demoAgents.forEach(agent => this.agents.set(agent.id, agent));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject,
      description: insertProject.description ?? null,
      userId: insertProject.userId ?? null,
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = { 
      ...existing, 
      ...projectUpdate, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Scenarios
  async getScenario(id: string): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async getScenariosByProject(projectId: string): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).filter(s => s.projectId === projectId);
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = randomUUID();
    const now = new Date();
    const scenario: Scenario = { 
      ...insertScenario,
      projectId: insertScenario.projectId ?? null,
      description: insertScenario.description ?? null,
      nodes: (insertScenario.nodes as WorkflowNode[]) ?? null,
      edges: (insertScenario.edges as WorkflowEdge[]) ?? null,
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  async updateScenario(id: string, scenarioUpdate: Partial<Scenario>): Promise<Scenario | undefined> {
    const existing = this.scenarios.get(id);
    if (!existing) return undefined;
    
    const updated: Scenario = { 
      ...existing, 
      ...scenarioUpdate, 
      updatedAt: new Date() 
    };
    this.scenarios.set(id, updated);
    return updated;
  }

  async deleteScenario(id: string): Promise<boolean> {
    return this.scenarios.delete(id);
  }

  // Tools
  async getTool(id: string): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async getToolsByProject(projectId: string): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(t => t.projectId === projectId);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = randomUUID();
    const tool: Tool = { 
      ...insertTool,
      projectId: insertTool.projectId ?? null,
      description: insertTool.description ?? null,
      config: insertTool.config ?? null,
      isActive: insertTool.isActive ?? null,
      id 
    };
    this.tools.set(id, tool);
    return tool;
  }

  async updateTool(id: string, toolUpdate: Partial<Tool>): Promise<Tool | undefined> {
    const existing = this.tools.get(id);
    if (!existing) return undefined;
    
    const updated: Tool = { ...existing, ...toolUpdate };
    this.tools.set(id, updated);
    return updated;
  }

  async deleteTool(id: string): Promise<boolean> {
    return this.tools.delete(id);
  }

  // Agents
  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAgentsByProject(projectId: string): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(a => a.projectId === projectId);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { 
      ...insertAgent,
      projectId: insertAgent.projectId ?? null,
      description: insertAgent.description ?? null,
      config: (insertAgent.config as AgentConfig) ?? null,
      id 
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, agentUpdate: Partial<Agent>): Promise<Agent | undefined> {
    const existing = this.agents.get(id);
    if (!existing) return undefined;
    
    const updated: Agent = { ...existing, ...agentUpdate };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Simulation Runs
  async getSimulationRun(id: string): Promise<SimulationRun | undefined> {
    return this.simulationRuns.get(id);
  }

  async getSimulationRunsByScenario(scenarioId: string): Promise<SimulationRun[]> {
    return Array.from(this.simulationRuns.values()).filter(r => r.scenarioId === scenarioId);
  }

  async createSimulationRun(insertRun: InsertSimulationRun): Promise<SimulationRun> {
    const id = randomUUID();
    const now = new Date();
    const run: SimulationRun = { 
      ...insertRun,
      scenarioId: insertRun.scenarioId ?? null,
      results: (insertRun.results as SimulationResult) ?? null,
      metrics: insertRun.metrics ?? null,
      logs: (insertRun.logs as SimulationLog[]) ?? null,
      id, 
      startedAt: now,
      completedAt: null
    };
    this.simulationRuns.set(id, run);
    return run;
  }

  async updateSimulationRun(id: string, runUpdate: Partial<SimulationRun>): Promise<SimulationRun | undefined> {
    const existing = this.simulationRuns.get(id);
    if (!existing) return undefined;
    
    const updated: SimulationRun = { ...existing, ...runUpdate };
    this.simulationRuns.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

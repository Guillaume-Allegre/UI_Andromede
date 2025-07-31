import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type Environment,
  type InsertEnvironment,
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
  type SimulationLog,
  users,
  projects,
  environments,
  scenarios,
  tools,
  agents,
  simulationRuns
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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

  // Environments
  getEnvironment(id: string): Promise<Environment | undefined>;
  getEnvironmentsByUser(userId: string): Promise<Environment[]>;
  createEnvironment(environment: InsertEnvironment): Promise<Environment>;
  updateEnvironment(id: string, environment: Partial<Environment>): Promise<Environment | undefined>;
  deleteEnvironment(id: string): Promise<boolean>;

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

export class DatabaseStorage implements IStorage {



  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...projectUpdate, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Environments
  async getEnvironment(id: string): Promise<Environment | undefined> {
    const [environment] = await db.select().from(environments).where(eq(environments.id, id));
    return environment || undefined;
  }

  async getEnvironmentsByUser(userId: string): Promise<Environment[]> {
    return await db.select().from(environments).where(eq(environments.userId, userId));
  }

  async createEnvironment(insertEnvironment: InsertEnvironment): Promise<Environment> {
    const [environment] = await db.insert(environments).values(insertEnvironment).returning();
    return environment;
  }

  async updateEnvironment(id: string, environmentUpdate: Partial<Environment>): Promise<Environment | undefined> {
    const [updated] = await db
      .update(environments)
      .set({ ...environmentUpdate, updatedAt: new Date() })
      .where(eq(environments.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEnvironment(id: string): Promise<boolean> {
    const result = await db.delete(environments).where(eq(environments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Scenarios
  async getScenario(id: string): Promise<Scenario | undefined> {
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return scenario || undefined;
  }

  async getScenariosByProject(projectId: string): Promise<Scenario[]> {
    return await db.select().from(scenarios).where(eq(scenarios.projectId, projectId));
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const [scenario] = await db.insert(scenarios).values(insertScenario as any).returning();
    return scenario;
  }

  async updateScenario(id: string, scenarioUpdate: Partial<Scenario>): Promise<Scenario | undefined> {
    const [updated] = await db
      .update(scenarios)
      .set({ ...scenarioUpdate, updatedAt: new Date() })
      .where(eq(scenarios.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteScenario(id: string): Promise<boolean> {
    const result = await db.delete(scenarios).where(eq(scenarios.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Tools
  async getTool(id: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool || undefined;
  }

  async getToolsByProject(projectId: string): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.projectId, projectId));
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const [tool] = await db.insert(tools).values(insertTool).returning();
    return tool;
  }

  async updateTool(id: string, toolUpdate: Partial<Tool>): Promise<Tool | undefined> {
    const [updated] = await db
      .update(tools)
      .set(toolUpdate)
      .where(eq(tools.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTool(id: string): Promise<boolean> {
    const result = await db.delete(tools).where(eq(tools.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Agents
  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async getAgentsByProject(projectId: string): Promise<Agent[]> {
    return await db.select().from(agents).where(eq(agents.projectId, projectId));
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent as any).returning();
    return agent;
  }

  async updateAgent(id: string, agentUpdate: Partial<Agent>): Promise<Agent | undefined> {
    const [updated] = await db
      .update(agents)
      .set(agentUpdate)
      .where(eq(agents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Simulation Runs
  async getSimulationRun(id: string): Promise<SimulationRun | undefined> {
    const [run] = await db.select().from(simulationRuns).where(eq(simulationRuns.id, id));
    return run || undefined;
  }

  async getSimulationRunsByScenario(scenarioId: string): Promise<SimulationRun[]> {
    return await db.select().from(simulationRuns).where(eq(simulationRuns.scenarioId, scenarioId));
  }

  async createSimulationRun(insertRun: InsertSimulationRun): Promise<SimulationRun> {
    const [run] = await db.insert(simulationRuns).values(insertRun as any).returning();
    return run;
  }

  async updateSimulationRun(id: string, runUpdate: Partial<SimulationRun>): Promise<SimulationRun | undefined> {
    const [updated] = await db
      .update(simulationRuns)
      .set(runUpdate)
      .where(eq(simulationRuns.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();

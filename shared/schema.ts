import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  projectId: varchar("project_id").references(() => projects.id),
  nodes: json("nodes").$type<WorkflowNode[]>().default([]),
  edges: json("edges").$type<WorkflowEdge[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tools = pgTable("tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'salesforce', 'outlook', 'calendar', 'openai', etc.
  description: text("description"),
  config: json("config").$type<Record<string, any>>().default({}),
  isActive: boolean("is_active").default(true),
  projectId: varchar("project_id").references(() => projects.id),
});

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'openai', 'anthropic', 'custom'
  description: text("description"),
  config: json("config").$type<AgentConfig>().default({}),
  projectId: varchar("project_id").references(() => projects.id),
});

export const simulationRuns = pgTable("simulation_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scenarioId: varchar("scenario_id").references(() => scenarios.id),
  status: text("status").notNull(), // 'running', 'completed', 'failed'
  results: json("results").$type<SimulationResult>(),
  metrics: json("metrics").$type<Record<string, number>>().default({}),
  logs: json("logs").$type<SimulationLog[]>().default([]),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Schema types
export type WorkflowNode = {
  id: string;
  type: 'actor' | 'tool' | 'orchestrator' | 'trigger' | 'reward';
  position: { x: number; y: number };
  data: {
    name: string;
    description?: string;
    config?: Record<string, any>;
    actorType?: 'human' | 'agent' | 'system';
    toolType?: string;
  };
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
};

export type AgentConfig = {
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  systemPrompt?: string;
};

export type SimulationResult = {
  success: boolean;
  completionRate: number;
  successRate: number;
  duration: number;
  errors?: string[];
};

export type SimulationLog = {
  id: string;
  timestamp: number;
  nodeId: string;
  type: 'input' | 'output' | 'error' | 'info';
  message: string;
  data?: Record<string, any>;
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export const insertSimulationRunSchema = createInsertSchema(simulationRuns).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export type InsertSimulationRun = z.infer<typeof insertSimulationRunSchema>;
export type SimulationRun = typeof simulationRuns.$inferSelect;

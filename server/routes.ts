import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertEnvironmentSchema,
  insertScenarioSchema, 
  insertToolSchema, 
  insertAgentSchema,
  insertSimulationRunSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      // For demo, use the demo user
      const projects = await storage.getProjectsByUser("demo-user");
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...projectData,
        userId: "demo-user" // For demo
      });
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Environments
  app.get("/api/environments", async (req, res) => {
    try {
      const environments = await storage.getEnvironmentsByUser("demo-user");
      res.json(environments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environments" });
    }
  });

  app.get("/api/environments/:id", async (req, res) => {
    try {
      const environment = await storage.getEnvironment(req.params.id);
      if (!environment) {
        return res.status(404).json({ error: "Environment not found" });
      }
      res.json(environment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environment" });
    }
  });

  app.post("/api/environments", async (req, res) => {
    try {
      const environmentData = insertEnvironmentSchema.parse(req.body);
      const environment = await storage.createEnvironment({
        ...environmentData,
        userId: "demo-user"
      });
      res.status(201).json(environment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create environment" });
    }
  });

  // Scenarios
  app.get("/api/projects/:projectId/scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getScenariosByProject(req.params.projectId);
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });

  app.post("/api/scenarios", async (req, res) => {
    try {
      const scenarioData = insertScenarioSchema.parse(req.body);
      const scenario = await storage.createScenario(scenarioData);
      res.status(201).json(scenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create scenario" });
    }
  });

  app.put("/api/scenarios/:id", async (req, res) => {
    try {
      const updates = req.body;
      const scenario = await storage.updateScenario(req.params.id, updates);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: "Failed to update scenario" });
    }
  });

  // Tools
  app.get("/api/projects/:projectId/tools", async (req, res) => {
    try {
      const tools = await storage.getToolsByProject(req.params.projectId);
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  app.post("/api/tools", async (req, res) => {
    try {
      const toolData = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(toolData);
      res.status(201).json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create tool" });
    }
  });

  // Agents
  app.get("/api/projects/:projectId/agents", async (req, res) => {
    try {
      const agents = await storage.getAgentsByProject(req.params.projectId);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const agentData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  // Simulation
  app.post("/api/scenarios/:scenarioId/simulate", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }

      // Create simulation run
      const simulationRun = await storage.createSimulationRun({
        scenarioId: req.params.scenarioId,
        status: "running",
        results: undefined,
        metrics: {},
        logs: []
      });

      // Simulate the workflow (simplified)
      setTimeout(async () => {
        const logs = [
          {
            id: "log-1",
            timestamp: Date.now(),
            nodeId: "customer",
            type: "input" as const,
            message: "Customer initiated contact",
            data: { message: "Hi, I'm interested in your product demo." }
          },
          {
            id: "log-2", 
            timestamp: Date.now() + 2000,
            nodeId: "sales-agent",
            type: "output" as const,
            message: "Sales Agent responded",
            data: { message: "I'd be happy to help! Let me check our available demo slots." }
          }
        ];

        const results = {
          success: true,
          completionRate: 94,
          successRate: 87,
          duration: 5000
        };

        await storage.updateSimulationRun(simulationRun.id, {
          status: "completed",
          results,
          metrics: { completionRate: 94, successRate: 87 },
          logs,
          completedAt: new Date()
        });
      }, 3000);

      res.json(simulationRun);
    } catch (error) {
      res.status(500).json({ error: "Failed to start simulation" });
    }
  });

  app.get("/api/simulation-runs/:id", async (req, res) => {
    try {
      const run = await storage.getSimulationRun(req.params.id);
      if (!run) {
        return res.status(404).json({ error: "Simulation run not found" });
      }
      res.json(run);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch simulation run" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

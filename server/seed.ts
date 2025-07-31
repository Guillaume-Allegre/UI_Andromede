import { db } from "./db";
import { users, projects, environments, tools, agents } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create demo user
    const [demoUser] = await db.insert(users).values({
      id: "demo-user",
      username: "demo",
      password: "demo123"
    }).returning();
    console.log("✓ Created demo user");

    // Create demo project
    const [demoProject] = await db.insert(projects).values({
      id: "demo-project",
      name: "Helix",
      description: "AI Agent Platform",
      userId: demoUser.id
    }).returning();
    console.log("✓ Created demo project");

    // Create demo environments
    const demoEnvironments = await db.insert(environments).values([
      {
        id: "env-production",
        name: "Production",
        description: "Live production environment",
        userId: demoUser.id
      },
      {
        id: "env-staging",
        name: "Staging",
        description: "Pre-production testing environment",
        userId: demoUser.id
      },
      {
        id: "env-development",
        name: "Development",
        description: "Development and testing environment",
        userId: demoUser.id
      }
    ]).returning();
    console.log("✓ Created demo environments");

    // Create demo tools
    const demoTools = await db.insert(tools).values([
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
    ]).returning();
    console.log("✓ Created demo tools");

    // Create demo agents
    const demoAgents = await db.insert(agents).values([
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
    ]).returning();
    console.log("✓ Created demo agents");

    console.log("🎉 Database seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
seed().then(() => {
  console.log("✅ Seeding complete");
  process.exit(0);
});

export { seed };
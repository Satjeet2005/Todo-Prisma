import { prisma } from "./src/config/prisma.ts";

async function main() {
  try {
    const exists = await prisma.$queryRaw<{ exists: string | null }[]>`
      SELECT to_regclass('"Todo"') as exists
    `;
    console.log("Todo table exists:", exists[0]?.exists);
    const todo = await prisma.todo.create({
      data: { title: "Ping", description: "Connectivity check" },
    });
    console.log("Inserted:", todo.id);
  } catch (error) {
    console.error("DB error:", error);
    // Log deeper context for Prisma 7
    if (error instanceof Error) {
      console.error("Cause:", (error as any).cause);
      console.error("Code:", (error as any).code);
      console.error("Meta:", (error as any).meta);
    }
  } finally {
    process.exit(0);
  }
}

main();


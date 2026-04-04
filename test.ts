import { prisma } from "./src/config/prisma.ts";

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log("Connection OK:", result);
}

main().catch(console.error);

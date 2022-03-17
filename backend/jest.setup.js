import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { join } from "path";
import { URL } from "url";
import { v4 } from "uuid";

const getTestDbName = (subfix) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("please provide a database url");
  }

  const url = new URL(process.env.DATABASE_URL);
  const dbName = url.pathname.replace("/", "");
  return dbName + subfix;
};

const getTestDbUrl = (subfix) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("please provide a database url");
  }

  const url = process.env.DATABASE_URL;
  return url + subfix;
};

const testUuid = "_test_" + v4().toString().split("-")[0];
const prismaBinary = join(__dirname, "node_modules", ".bin", "prisma");

let prisma = new PrismaClient({
  datasources: { db: { url: getTestDbUrl(testUuid) } },
});

export default prisma;

jest.mock("./common/dbClient", () => prisma);

const initializeTestDatabase = () => {
  const dbName = getTestDbName(testUuid);
  console.log("Creating Database", dbName);

  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: getTestDbUrl(testUuid),
    },
  });
};

const tearDownTestDatabase = async () => {
  const dbName = getTestDbName(testUuid);
  console.log("Dropping Database", dbName);
  await prisma.$executeRawUnsafe(`DROP DATABASE \`${dbName}\``);
  await prisma.$disconnect();
  jest.resetModules(); // this will re-import this file and cause a new schema to be created for the next test
};

beforeAll(initializeTestDatabase);
afterAll(tearDownTestDatabase);

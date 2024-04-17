const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllZoos() {
  const zoos = await prisma.zoo.findMany();
  console.log("Alle Zoos:");
  console.log(zoos);
}

async function getZooInfoWithDepartments() {
  const randomZoo = await prisma.zoo.findFirst({ include: { abteilungen: true } });
  console.log("Zufälliger Zoo mit Abteilungen:");
  console.log(randomZoo);
}

async function getZooInfoWithDepartmentAnimals() {
  const randomZoo = await prisma.zoo.findFirst({ include: { abteilungen: { include: { tiere: true } } } });
  console.log("Zufälliger Zoo mit Abteilungen und Anzahl der Tiere:");
  console.log(randomZoo);
}

async function getEmployeesInZoo(zooId) {
  const employees = await prisma.mitarbeiter.findMany({ where: { abteilungen: { some: { zooId: zooId } } } });
  console.log(`Mitarbeiter im Zoo mit ID ${zooId}:`);
  console.log(employees);
}

async function getEmployeesInZooWithDepartments(zooId) {
  const employees = await prisma.mitarbeiter.findMany({
    where: { abteilungen: { some: { zooId: zooId } } },
    include: { abteilungen: true },
  });
  console.log(`Mitarbeiter im Zoo mit ID ${zooId} und den Abteilungen:`);
  console.log(employees);
}

// Extra
async function getEmployeeDetails(employeeId) {
  const employee = await prisma.mitarbeiter.findUnique({ where: { id: employeeId }, include: { abteilungen: { include: { tiere: true } } } });
  console.log(`Details für Mitarbeiter mit ID ${employeeId}:`);
  console.log(employee);
}

async function main() {
  try {
    await getAllZoos();
    await getZooInfoWithDepartments();
    await getZooInfoWithDepartmentAnimals();
    const zooId = "idvongewünschtezoo"; //zoo id eingeben
    await getEmployeesInZoo(zooId);
    await getEmployeesInZooWithDepartments(zooId);
    const employeeId = "idvongewünschteemployee"; //employee id eingeben
    await getEmployeeDetails(employeeId);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

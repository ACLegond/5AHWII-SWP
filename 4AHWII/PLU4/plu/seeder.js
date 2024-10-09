const { PrismaClient } = require('@prisma/client');
const faker = require('faker');


app.use(cors());
const prisma = new PrismaClient();

async function seedDatabase() {
  // Seed Zoos
  for (let i = 0; i < 5; i++) {
    const zoo = await prisma.zoo.create({
      data: {
        land: faker.address.country(),
        stadt: faker.address.city(),
        adresse: faker.address.streetAddress(),
        baujahr: faker.date.past(),
      },
      
    });
    console.log(zoo);

    // Zoo
    const numDepartments = faker.datatype.number({ min: 2, max: 7 });
    for (let j = 0; j < numDepartments; j++) {
      const department = await prisma.abteilung.create({
        data: {
          name: faker.animal.type(),
          zoo: { connect: { id: zoo.id } },
        },
      });

      // Tiere
      const numAnimals = faker.datatype.number({ min: 5, max: 20 });
      for (let k = 0; k < numAnimals; k++) {
        await prisma.tier.create({
          data: {
            art: faker.animal.type(),
            name: faker.name.firstName(),
            abteilung: { connect: { id: department.id } },
          },
        });
      }
    }
  }

  // itarbeiter
  for (let i = 0; i < 100; i++) {
    const employee = await prisma.mitarbeiter.create({
      data: {
        name: faker.name.findName(),
      },
    });

    // Mitarbeiter in 1-4 Abteilungen 
    const numDepartments = faker.datatype.number({ min: 1, max: 4 });
    const departments = await prisma.abteilung.findMany();
    const selectedDepartments = faker.helpers.shuffle(departments).slice(0, numDepartments);
    await prisma.mitarbeiter.update({
      where: { id: employee.id },
      data: {
        abteilungen: { connect: selectedDepartments.map(department => ({ id: department.id })) },
      },
    });
  }
}

seedDatabase()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

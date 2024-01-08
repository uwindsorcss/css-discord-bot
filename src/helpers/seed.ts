import {Config, logger, prisma} from "@/config";
import fs from "fs";

interface Course {
  code: string;
  name: string;
  description: string;
  notes: string;
  lectureHours: number;
  labHours: number;
  prerequisites: string[];
  corequisites: string[];
  antirequisites: string[];
}

export async function seedDatabase() {
  if (!Config.seed) {
    logger.info("Seed is disabled. Skipping seeding...");
    return;
  } else {
    logger.info("Seeding database...");
  }

  // Check if the courses.json file exists
  if (!fs.existsSync("data/courses.json")) {
    logger.info("data/courses.json does not exist. Skipping seeding...");
    return;
  }

  const courses = JSON.parse(
    fs.readFileSync("data/courses.json", "utf8")
  ) as Course[];

  let count = 0;
  for (const course of courses) {
    const cleanedCode = course.code.trim().toLowerCase();
    const courseCodeRegex = /[a-z]{4}[0-9]{4}/;

    if (!courseCodeRegex.test(cleanedCode) || cleanedCode.length > 8) {
      logger.debug(`Invalid course code: ${course.code}`);
      continue;
    }

    const cleanedName = course.name.trim();
    const cleanedDescription = course.description.replace(/\n/g, "").trim();
    const cleanedNotes = course.notes.trim();

    const cleanRequirements = (requirements: string) => {
      return requirements.replace(/[\(\)]/g, "").trim();
    };

    const prerequisites = course.prerequisites.map((prerequisite) => {
      return {
        requirement: cleanRequirements(prerequisite),
      };
    });
    const corequisites = course.corequisites.map((corequisite) => {
      return {
        requirement: cleanRequirements(corequisite),
      };
    });
    const antirequisites = course.antirequisites.map((antirequisite) => {
      return {
        requirement: cleanRequirements(antirequisite),
      };
    });

    await prisma.course
      .upsert({
        where: {
          code: cleanedCode,
        },
        update: {
          code: cleanedCode,
          name: cleanedName,
          description: cleanedDescription,
          notes: cleanedNotes === "" ? null : cleanedNotes,
          lectureHours: course.lectureHours,
          labHours: course.labHours,
        },
        create: {
          code: cleanedCode,
          name: cleanedName,
          description: cleanedDescription,
          notes: cleanedNotes === "" ? null : cleanedNotes,
          lectureHours: course.lectureHours,
          labHours: course.labHours,
          prerequisites: {
            create: prerequisites,
          },
          corequisites: {
            create: corequisites,
          },
          antirequisites: {
            create: antirequisites,
          },
        },
      })
      .then(() => {
        logger.debug(`Created course ${cleanedCode}`);
        count++;
      })
      .catch((e) => {
        logger.debug(`Failed to create course ${cleanedCode}`);
        console.error(e);
      });
  }
  if (count === 0) {
    logger.info("No courses created.");
  } else {
    logger.info(`Upserted ${count} courses.`);
  }
}

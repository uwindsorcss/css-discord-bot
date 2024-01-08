-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "lectureHours" DECIMAL,
    "labHours" DECIMAL
);

-- CreateTable
CREATE TABLE "Prerequisite" (
    "requirement" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("requirement", "courseCode"),
    CONSTRAINT "Prerequisite_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Corequisite" (
    "requirement" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("requirement", "courseCode"),
    CONSTRAINT "Corequisite_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Antirequisite" (
    "requirement" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("requirement", "courseCode"),
    CONSTRAINT "Antirequisite_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

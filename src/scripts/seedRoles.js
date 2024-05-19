// scripts/seedRoles.js
import mongoose from "mongoose";
import Role from "../models/Role.js";

async function seedRoles() {
  await Role.create([
    {
      id: 1,
      name: "admin",
      permissions: [
        "read:users",
        "create:users",
        "update:users",
        "delete:users",
      ],
    },
    {
      id: 2,
      name: "faculty",
      permissions: ["read:users", "create:users", "update:users"],
    },
    {
      id: 3,
      name: "student",
      permissions: ["read:users"],
    },
  ]);
}

seedRoles()
  .then(() => {
    console.log("Roles seeded successfully");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error seeding roles:", error);
    mongoose.disconnect();
  });

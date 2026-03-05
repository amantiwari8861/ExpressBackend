const Role = require("../model/role.model");

// In-memory cache
const roleMap = new Map(); // key = role name, value = role _id

const loadRoles = async () => {
  const roles = await Role.find();

  if (!roles || roles.length === 0) {
    // throw new Error("No roles found in DB");
    console.error("No roles found in DB");

    console.log("inserting ROLE_USER 1st time");
    const savedRole = await Role.insertOne({ role: "ROLE_USER" });
    roleMap.set(savedRole.role, savedRole._id.toString());
    console.log("inserted ROLE_USER 1st time");
  }

  roles.forEach((role) => {
    roleMap.set(role.role, role._id.toString());
  });

  console.log("Roles cached:", roleMap);
};

// getter function
const getRoleId = (roleName) => {
  const roleId = roleMap.get(roleName);
  console.log("got roleId :", roleId);

  if (!roleId) {
    // throw new Error(`Role ${roleName} not found in cache`);
    console.log(`Role ${roleName} not found in cache`);
    return null;
  }

  return roleId;
};

module.exports = {
  loadRoles,
  getRoleId,
};

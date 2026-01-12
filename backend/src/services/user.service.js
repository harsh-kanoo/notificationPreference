const prisma = require("../config/prisma");

exports.getAllUsers = () => {
  return prisma.users.findMany({
    select: {
      user_id: true,
      name: true,
      email: true,
      city: true,
      gender: true,
      is_active: true,
    },
  });
};

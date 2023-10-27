import prisma from '../../../shared/prisma';

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true, role: true, email: true },
  });
};

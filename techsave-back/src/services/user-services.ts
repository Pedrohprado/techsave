import { prisma } from '../config/prisma.js';

interface UserInformationsProps {
  name: string;
  age: string;
  email: string;
  password: string;
  income: number;
  money_saved: number;
}
export async function createUserService(
  userInformations: UserInformationsProps
) {
  const userCreateInformations = await prisma.user.create({
    data: {
      name: userInformations.name,
      age: userInformations.age,
      email: userInformations.email,
      hashedPassword: userInformations.password,
      income: userInformations.income,
      money_saved: userInformations.money_saved,
    },
  });

  return {
    id: userCreateInformations.id,
  };
}

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    const name = `${user.firstName} ${user.lastName}`;

    if (loggedInUser) {
      // Update existing user with latest data from Clerk
      const updatedUser = await db.user.update({
        where: {
          clerkUserId: user.id,
        },
        data: {
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          updatedAt: new Date(),
        },
      });
      return updatedUser;
    }

    // Create new user if they don't exist
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error in checkUser:", error.message);
    return null;
  }
};
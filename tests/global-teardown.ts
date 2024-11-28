import { deleteUserByEmail } from "../test_util/deleteUser";

async function globalTeardown() {
  const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL;

  if (!email) {
    throw new Error("NEXT_PUBLIC_TEST_USER_EMAIL must be set");
  }
  console.log("deleting user...");
  await deleteUserByEmail(email);
}

export default globalTeardown;

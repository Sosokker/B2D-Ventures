import { FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

async function globalSetup(config: FullConfig) {
  // eslint-disable-next-line no-unused-vars
  const { baseURL, storageState } = config.projects[0].use;
  console.log("setting up...");
  const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL;
  const password = process.env.NEXT_PUBLIC_TEST_USER_PASSWORD;
  const project_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!email || !password) {
    throw new Error("NEXT_PUBLIC_TEST_USER_EMAIL and NEXT_PUBLIC_TEST_USER_PASSWORD must be set");
  }

  if (!project_url || !service_role_key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }

  const supabase = createClient(project_url, service_role_key);
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error != null) {
    console.error("Error details:", error);
    throw new Error(`Sign-up failed: ${error.message}`);
  }

  console.log("User signed up successfully");

  // const browser = await firefox.launch();
  // const page = await browser.newPage();

  // await page.goto(baseURL + "/auth");
  // await page.fill("id=email", email);
  // await page.fill("id=password", password);
  // await page.click("id=login");

  // await page.context().storageState({ path: storageState as string });
  // // show the storage state and context
  // const storage = await page.context().storageState();
  // console.log("storage", storage);
  // const context = page.context();
  // console.log("context", context);
  // console.log("setup done");
  // await browser.close();
}

export default globalSetup;

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedAdmin() {
  const email = "admin@brewlog.ai";
  const password = "admin123456!";

  const { data: existing } = await supabase.auth.admin.listUsers();
  const adminExists = existing?.users.some(u => u.email === email);

  if (adminExists) {
    console.log("Admin already exists");
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const admin = users?.find(u => u.email === email);
    if (admin) {
      await supabase.from("profiles").upsert({
        id: admin.id,
        email: admin.email,
        role: "admin",
        plan_tier: "pro",
      });
      console.log("Admin profile ensured");
    }
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      role: "admin",
      plan_tier: "pro",
    });
    console.log("Admin seeded:", email);
  }
}

seedAdmin();

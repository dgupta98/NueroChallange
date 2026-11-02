/**
 * Seeds the demo school into a fresh Supabase project.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/seed-demo.js
 *
 * Get SUPABASE_SERVICE_ROLE_KEY from:
 *   Supabase dashboard → your project → Project Settings → API → service_role key
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // 1. Demo teacher auth account
  const { data: created, error: authErr } = await supabase.auth.admin.createUser({
    email: "demo.teacher@stepcards.app",
    password: "StepCards-demo-2026",
    email_confirm: true,
    user_metadata: { display_name: "Ms. Rivera" },
  });
  if (authErr) throw new Error("Auth: " + authErr.message);
  const teacherId = created.user.id;
  console.log("✓ Created teacher", teacherId);

  // 2. Organization (trigger auto-adds teacher as admin)
  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name: "Desert Bloom Academy (demo)", created_by: teacherId })
    .select()
    .single();
  if (orgErr) throw new Error("Org: " + orgErr.message);
  console.log("✓ Created org", org.id);

  // 3. Three classes with fixed join codes
  const classDefs = [
    { name: "Morning Group", code: "STEP42" },
    { name: "Baking Club",   code: "BAKE42" },
    { name: "Sky Science",   code: "SKY234" },
  ];

  for (const def of classDefs) {
    const { data: cls, error: clsErr } = await supabase
      .from("classes")
      .insert({ org_id: org.id, teacher_id: teacherId, name: def.name, join_code: def.code })
      .select()
      .single();
    if (clsErr) throw new Error(`Class ${def.code}: ${clsErr.message}`);

    const { error: studErr } = await supabase.from("students").insert([
      { class_id: cls.id, nickname: "Leo", reading_level: "grade2", avatar: "star" },
      { class_id: cls.id, nickname: "Mia", reading_level: "grade6", avatar: "moon" },
    ]);
    if (studErr) throw new Error(`Students in ${def.code}: ${studErr.message}`);
    console.log("✓ Created class", def.code, "with Leo + Mia");
  }

  console.log("\nDone! Update your env vars with the new Supabase project credentials.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

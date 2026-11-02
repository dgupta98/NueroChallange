/**
 * Adds Cam, Sam, and Jin to each existing demo class.
 * Safe to run on a live database — skips any nickname that already exists in the class.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/add-classmates.js
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

const CLASSMATES = [
  { nickname: "Cam", reading_level: "grade4", avatar: "rocket" },
  { nickname: "Sam", reading_level: "grade2", avatar: "tree" },
  { nickname: "Jin", reading_level: "grade6", avatar: "sun" },
];

const CLASS_CODES = ["STEP42", "BAKE42", "SKY234"];

async function main() {
  for (const code of CLASS_CODES) {
    const { data: cls, error: clsErr } = await supabase
      .from("classes")
      .select("id, name")
      .eq("join_code", code)
      .single();

    if (clsErr) {
      console.error(`✗ Class ${code} not found:`, clsErr.message);
      continue;
    }

    const { data: existing } = await supabase
      .from("students")
      .select("nickname")
      .eq("class_id", cls.id);

    const existingNames = new Set((existing ?? []).map((s) => s.nickname));

    const toInsert = CLASSMATES
      .filter((s) => !existingNames.has(s.nickname))
      .map((s) => ({ ...s, class_id: cls.id }));

    if (toInsert.length === 0) {
      console.log(`  ${code} (${cls.name}): all classmates already present, skipped`);
      continue;
    }

    const { error: insertErr } = await supabase.from("students").insert(toInsert);
    if (insertErr) {
      console.error(`✗ Insert into ${code}:`, insertErr.message);
    } else {
      console.log(`✓ ${code} (${cls.name}): added ${toInsert.map((s) => s.nickname).join(", ")}`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

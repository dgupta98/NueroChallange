/**
 * Adds Mr. Chen (teacher 2) + his classes + demo lessons with student activity
 * to the live Supabase database. Also adds rich lesson history for Ms. Rivera's classes.
 *
 * Safe to re-run — skips rows that already exist.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/add-demo-content.js
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

// ── Step builders ──────────────────────────────────────────────────────────────

function steps(level, variants) {
  const texts = variants[level] ?? variants.grade6;
  return texts.map((text, i) => ({ n: i + 1, text, icon_keyword: null }));
}

// ── Lesson blueprints ─────────────────────────────────────────────────────────

const BLUEPRINTS = {
  "wash-hands": {
    title: "Wash hands",
    instruction: "Everyone wash your hands before snack time. Use soap and scrub for 20 seconds, then dry with a paper towel.",
    variants: {
      grade2:         ["Go to sink", "Wet hands", "Add soap", "Scrub 20 sec", "Rinse off", "Dry hands"],
      grade4:         ["Walk to the sink now", "Turn on the water tap", "Put soap on your hands", "Rub hands for 20 seconds", "Rinse the soap off", "Dry hands with paper towel"],
      grade6:         ["Walk to the sink", "Turn on the water and wet both hands", "Squeeze soap onto your palms", "Rub your hands together for 20 seconds", "Rinse all the soap off under the water", "Dry your hands with a paper towel"],
      pictogram_only: ["Sink", "Water", "Soap", "Rub", "Rinse", "Dry"],
    },
  },
  "pack-up": {
    title: "Pack up your things",
    instruction: "Time to pack up — put your papers in your folder, your folder in your bag, pencil in the case, then zip your bag.",
    variants: {
      grade2:         ["Papers in folder", "Folder in bag", "Pencil in case", "Zip bag"],
      grade4:         ["Put your papers in the folder", "Put folder in your backpack", "Put pencil in pencil case", "Zip up your backpack"],
      grade6:         ["Put your papers inside your folder", "Place the folder in your backpack", "Put your pencil in the pencil case", "Zip your backpack closed"],
      pictogram_only: ["Papers", "Folder", "Pencil", "Zip"],
    },
  },
  "line-up": {
    title: "Line up at the door",
    instruction: "Please line up at the door for outdoor time. Walk quietly and keep your hands to yourself.",
    variants: {
      grade2:         ["Stand up", "Push in chair", "Walk to door", "Line up"],
      grade4:         ["Stand up from your seat", "Push your chair in gently", "Walk to the classroom door", "Line up quietly"],
      grade6:         ["Stand up from your seat", "Push your chair in", "Walk calmly to the classroom door", "Stand quietly in the line"],
      pictogram_only: ["Stand", "Chair", "Walk", "Line"],
    },
  },
  "measure-flour": {
    title: "Measure the flour",
    instruction: "We're measuring flour today. Get the bowl and measuring cups, scoop the flour, level it off, and pour it into the bowl.",
    variants: {
      grade2:         ["Get bowl", "Get cup", "Scoop flour", "Level off", "Pour in bowl"],
      grade4:         ["Get the mixing bowl out", "Take the measuring cup", "Scoop flour into cup", "Level off the top", "Pour flour in the bowl"],
      grade6:         ["Take out the large mixing bowl", "Pick up the measuring cup", "Scoop flour into the measuring cup", "Level off the top with a knife", "Pour the flour into the mixing bowl"],
      pictogram_only: ["Bowl", "Cup", "Scoop", "Level", "Pour"],
    },
  },
  "clean-baking": {
    title: "Clean up baking station",
    instruction: "Clean up your baking station — wipe the counter, put tools in the sink, fold your apron, then wash your hands.",
    variants: {
      grade2:         ["Wipe counter", "Tools in sink", "Fold apron", "Wash hands"],
      grade4:         ["Wipe down the counter now", "Put all tools in the sink", "Take off and fold your apron", "Wash your hands with soap"],
      grade6:         ["Wipe the counter surface clean with a cloth", "Put all baking tools into the sink", "Remove your apron and fold it neatly", "Wash your hands thoroughly with soap and water"],
      pictogram_only: ["Wipe", "Sink", "Apron", "Wash"],
    },
  },
  "mix-dough": {
    title: "Mix the cookie dough",
    instruction: "Now we'll mix the cookie dough. Add the butter, the sugar, and the egg, then mix until everything is smooth.",
    variants: {
      grade2:         ["Add butter", "Add sugar", "Add egg", "Mix smooth"],
      grade4:         ["Put butter in the bowl", "Add sugar to the bowl", "Crack in one egg", "Mix until smooth"],
      grade6:         ["Add the softened butter to the mixing bowl", "Pour in the measured sugar", "Crack one egg into the bowl", "Mix everything together until the dough is smooth"],
      pictogram_only: ["Butter", "Sugar", "Egg", "Mix"],
    },
  },
  "science-notebook": {
    title: "Set up science notebook",
    instruction: "Get your science notebook, write today's date at the top, draw an observation box, and write what you see.",
    variants: {
      grade2:         ["Get notebook", "Write date", "Draw box", "Write what you see"],
      grade4:         ["Get your science notebook", "Write today's date at the top", "Draw a box for your observation", "Write down what you notice"],
      grade6:         ["Take out your science notebook", "Write today's date at the top of a new page", "Draw a large box for your observation sketch", "Write down what you can see right now"],
      pictogram_only: ["Notebook", "Date", "Draw", "Write"],
    },
  },
  "moon-observation": {
    title: "Record moon observation",
    instruction: "Look at the moon chart, find today's phase, draw the moon shape in your notebook, and write one thing you notice.",
    variants: {
      grade2:         ["Look at chart", "Find today", "Draw moon", "Write one thing"],
      grade4:         ["Look at the moon chart on the wall", "Find where we are in the cycle", "Draw the moon shape in your notebook", "Write one thing you notice"],
      grade6:         ["Look at the moon phase chart on the wall", "Find today's position in the lunar cycle", "Draw the current moon shape in your science notebook", "Write one observation about the moon"],
      pictogram_only: ["Chart", "Find", "Draw", "Write"],
    },
  },
  "start-lab": {
    title: "Begin today's lab",
    instruction: "Put on your safety glasses, open your lab sheet to page 3, read the question at the top, then write your prediction.",
    variants: {
      grade2:         ["Put on glasses", "Open lab sheet", "Read question", "Write prediction"],
      grade4:         ["Put on your safety glasses now", "Open your lab sheet to page 3", "Read the question at the top", "Write your prediction below"],
      grade6:         ["Put on your safety glasses", "Open your lab sheet to page 3", "Read the experiment question at the top carefully", "Write your prediction in the space provided"],
      pictogram_only: ["Glasses", "Sheet", "Read", "Write"],
    },
  },
  "kitchen-setup": {
    title: "Set up kitchen station",
    instruction: "Put on your apron, wash your hands, get your cutting board and knife out, then wait for instructions.",
    variants: {
      grade2:         ["Put on apron", "Wash hands", "Get board", "Get knife", "Wait"],
      grade4:         ["Put your apron on now", "Wash your hands with soap", "Get your cutting board out", "Get your knife from the drawer", "Wait for Mr. Chen"],
      grade6:         ["Put on your apron", "Wash your hands thoroughly with soap", "Place your cutting board on the counter", "Take your knife from the designated drawer", "Wait at your station for further instructions"],
      pictogram_only: ["Apron", "Wash", "Board", "Knife", "Wait"],
    },
  },
  "make-sandwich": {
    title: "Make a sandwich",
    instruction: "Get 2 slices of bread, spread the filling, add your toppings, put the second slice on top, and cut in half.",
    variants: {
      grade2:         ["Get 2 slices", "Spread filling", "Add toppings", "Put top slice", "Cut in half"],
      grade4:         ["Take 2 slices of bread from the bag", "Spread the filling on one slice", "Add your chosen toppings", "Place the second slice on top", "Cut the sandwich in half"],
      grade6:         ["Take 2 slices of bread from the bag", "Spread your chosen filling evenly on one slice", "Add your toppings in a single layer", "Place the second slice on top of the toppings", "Cut the sandwich diagonally in half"],
      pictogram_only: ["Bread", "Spread", "Toppings", "Top", "Cut"],
    },
  },
  "clean-kitchen": {
    title: "Clean up after cooking",
    instruction: "Put leftover food away, wash your tools at the sink, wipe your counter, take off your apron, and wash your hands.",
    variants: {
      grade2:         ["Put food away", "Wash tools", "Wipe counter", "Off with apron", "Wash hands"],
      grade4:         ["Put leftover food in the fridge", "Wash your tools at the sink", "Wipe down your counter", "Take off your apron", "Wash your hands thoroughly"],
      grade6:         ["Put any leftover food back in the fridge or bin", "Wash all your tools in the sink with soap", "Wipe down your entire counter surface", "Remove your apron and hang it up", "Wash your hands with soap and water"],
      pictogram_only: ["Food", "Wash", "Wipe", "Apron", "Hands"],
    },
  },
  "art-setup": {
    title: "Set up art supplies",
    instruction: "Put on your art smock, get your paintbrushes and palette, fill your water cup, and lay a sheet of newspaper down.",
    variants: {
      grade2:         ["Put on smock", "Get brushes", "Get palette", "Fill water cup", "Lay newspaper"],
      grade4:         ["Put your art smock on", "Get your paintbrushes and palette", "Fill your water cup halfway", "Lay a sheet of newspaper on the table"],
      grade6:         ["Put on your art smock", "Collect your paintbrushes and colour palette", "Fill your water cup about halfway", "Lay a sheet of newspaper flat on your workspace"],
      pictogram_only: ["Smock", "Brush", "Palette", "Water", "Newspaper"],
    },
  },
  "clean-brushes": {
    title: "Clean brushes after class",
    instruction: "Rinse each brush in your water cup, wipe them on a paper towel, reshape the bristles, and lay them flat to dry.",
    variants: {
      grade2:         ["Rinse brushes", "Wipe on towel", "Reshape bristles", "Lay flat to dry"],
      grade4:         ["Rinse each brush in your water cup", "Wipe them on a paper towel", "Reshape the bristles gently", "Lay the brushes flat to dry"],
      grade6:         ["Rinse each brush thoroughly in your water cup", "Wipe the brush on a paper towel to remove excess water", "Gently reshape the bristles with your fingers", "Lay the brushes flat on the tray to dry"],
      pictogram_only: ["Rinse", "Wipe", "Reshape", "Flat"],
    },
  },
  "watercolor-project": {
    title: "Start watercolour project",
    instruction: "Write your name on the back of your paper, wet your brush, pick 3 colours, and paint the background first.",
    variants: {
      grade2:         ["Write your name", "Wet the brush", "Pick 3 colours", "Paint background"],
      grade4:         ["Write your name on the back of the paper", "Wet your brush in the water cup", "Choose 3 colours from your palette", "Paint the background first"],
      grade6:         ["Write your name on the back of your paper", "Wet your paintbrush in your water cup", "Choose 3 colours you want to use today", "Start by painting the background colour first"],
      pictogram_only: ["Name", "Wet", "Colours", "Background"],
    },
  },
  "morning-checkin": {
    title: "Morning check-in",
    instruction: "Hang up your coat and bag, sign your name on the attendance sheet, check the board for today's plan, and go to your seat.",
    variants: {
      grade2:         ["Hang up coat", "Hang up bag", "Sign name", "Check board", "Go to seat"],
      grade4:         ["Hang up your coat on your hook", "Hang up your bag", "Sign your name on the sheet", "Check the board for today's plan", "Go to your seat"],
      grade6:         ["Hang your coat on your labelled hook", "Hang up your bag", "Sign your name on the attendance sheet", "Check the whiteboard for today's schedule", "Walk to your assigned seat"],
      pictogram_only: ["Coat", "Bag", "Sign", "Board", "Seat"],
    },
  },
  "pack-lunch": {
    title: "Pack your lunch bag",
    instruction: "Put your lunchbox in your bag, add your water bottle, zip the bag, and put it next to the door.",
    variants: {
      grade2:         ["Put lunchbox in bag", "Add water bottle", "Zip bag", "By the door"],
      grade4:         ["Put your lunchbox inside your bag", "Add your water bottle to the side pocket", "Zip up your bag", "Place it next to the classroom door"],
      grade6:         ["Place your lunchbox inside your school bag", "Add your water bottle to the side pocket", "Zip your bag closed", "Put your bag next to the classroom door"],
      pictogram_only: ["Lunchbox", "Bottle", "Zip", "Door"],
    },
  },
  "afternoon-wind-down": {
    title: "Afternoon wind-down",
    instruction: "Tidy your workspace, put your things in your bag, sit quietly in your seat, and wait for the bell.",
    variants: {
      grade2:         ["Tidy workspace", "Things in bag", "Sit quietly", "Wait for bell"],
      grade4:         ["Tidy up your workspace now", "Put all your things in your bag", "Sit quietly in your seat", "Wait for the end-of-day bell"],
      grade6:         ["Tidy up your workspace and put everything in order", "Place all your belongings in your bag", "Sit quietly at your seat", "Wait for the end-of-day bell"],
      pictogram_only: ["Tidy", "Bag", "Sit", "Wait"],
    },
  },
};

// ── Class/lesson plans ────────────────────────────────────────────────────────

const RIVERA_CLASSES = [
  {
    code: "STEP42",
    lessons: [
      { key: "wash-hands",  status: "ended", daysAgo: 6 },
      { key: "pack-up",     status: "ended", daysAgo: 3 },
      { key: "line-up",     status: "live",  daysAgo: 0 },
    ],
  },
  {
    code: "BAKE42",
    lessons: [
      { key: "measure-flour", status: "ended", daysAgo: 5 },
      { key: "clean-baking",  status: "ended", daysAgo: 2 },
      { key: "mix-dough",     status: "live",  daysAgo: 0 },
    ],
  },
  {
    code: "SKY234",
    lessons: [
      { key: "science-notebook", status: "ended", daysAgo: 7 },
      { key: "moon-observation", status: "ended", daysAgo: 4 },
      { key: "start-lab",        status: "live",  daysAgo: 0 },
    ],
  },
];

const CHEN_CLASSES = [
  {
    code: "COOK42",
    name: "Cooking Basics",
    lessons: [
      { key: "kitchen-setup",  status: "ended", daysAgo: 5 },
      { key: "make-sandwich",  status: "ended", daysAgo: 3 },
      { key: "clean-kitchen",  status: "live",  daysAgo: 0 },
    ],
  },
  {
    code: "ART234",
    name: "Art Studio",
    lessons: [
      { key: "art-setup",          status: "ended", daysAgo: 6 },
      { key: "clean-brushes",      status: "ended", daysAgo: 3 },
      { key: "watercolor-project", status: "live",  daysAgo: 0 },
    ],
  },
  {
    code: "LIFE42",
    name: "Life Skills",
    lessons: [
      { key: "morning-checkin",       status: "ended", daysAgo: 4 },
      { key: "pack-lunch",            status: "ended", daysAgo: 2 },
      { key: "afternoon-wind-down",   status: "live",  daysAgo: 0 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysAgoISO(n, offsetSeconds = 0) {
  return new Date(Date.now() - n * 86400_000 - offsetSeconds * 1000).toISOString();
}

async function addLessons(classDef, teacherId) {
  const { data: cls } = await db.from("classes").select("id").eq("join_code", classDef.code).single();
  if (!cls) { console.log(`  ✗ Class ${classDef.code} not found, skipping`); return; }

  const { data: students } = await db.from("students").select("id, nickname, reading_level").eq("class_id", cls.id).order("nickname");
  if (!students?.length) { console.log(`  ✗ No students in ${classDef.code}`); return; }

  for (const lessonDef of classDef.lessons) {
    const bp = BLUEPRINTS[lessonDef.key];
    if (!bp) { console.log(`  ✗ No blueprint for ${lessonDef.key}`); continue; }

    // Skip if lesson already exists
    const { data: existing } = await db.from("lessons").select("id").eq("class_id", cls.id).eq("title", bp.title).maybeSingle();
    if (existing) { console.log(`  ~ ${classDef.code}/${bp.title} already exists, skipping`); continue; }

    const createdAt = daysAgoISO(lessonDef.daysAgo, 3600);
    const approvedAt = lessonDef.status !== "review" ? daysAgoISO(lessonDef.daysAgo, 3000) : null;
    const endedAt = lessonDef.status === "ended" ? daysAgoISO(lessonDef.daysAgo, 300) : null;

    const { data: lesson, error: lErr } = await db.from("lessons").insert({
      class_id: cls.id,
      created_by: teacherId,
      title: bp.title,
      instruction: bp.instruction,
      routine_key: lessonDef.key,
      status: lessonDef.status,
      created_at: createdAt,
      approved_at: approvedAt,
      ended_at: endedAt,
    }).select("id").single();

    if (lErr) { console.log(`  ✗ Lesson ${bp.title}:`, lErr.message); continue; }

    // Build lesson_cards for each student
    const cards = students.map((s, idx) => {
      const level = s.reading_level ?? "grade6";
      const stepList = steps(level, bp.variants);
      const total = stepList.length;

      let currentStep = total;
      let completedAt = lessonDef.status === "ended" ? daysAgoISO(lessonDef.daysAgo, 600 + idx * 120) : null;
      let helpCount = 0;
      let helpStep = null;
      let feeling = null;

      if (lessonDef.status === "live") {
        // Mix of progress: first student done, some in the middle, one needs help
        if (idx === 0) {
          currentStep = total;
          completedAt = daysAgoISO(0, 600);
          feeling = "happy";
        } else if (idx === 1) {
          currentStep = Math.floor(total / 2);
          helpStep = currentStep;
          helpCount = 1;
        } else if (idx === 2) {
          currentStep = Math.floor(total * 0.7);
          feeling = "calm";
        } else {
          currentStep = 1;
        }
      } else {
        // Ended: some students had help requests
        if (idx === 1) helpCount = 1;
        if (idx === 3) helpCount = 2;
        if (idx % 2 === 0) feeling = idx === 0 ? "happy" : "calm";
      }

      return {
        lesson_id: lesson.id,
        class_id: cls.id,
        student_id: s.id,
        steps: stepList,
        current_step: currentStep,
        completed_at: completedAt,
        help_count: helpCount,
        help_step: helpStep,
        feeling: feeling,
        updated_at: daysAgoISO(lessonDef.daysAgo, 300 + idx * 60),
      };
    });

    const { error: cErr } = await db.from("lesson_cards").insert(cards);
    if (cErr) { console.log(`  ✗ Cards for ${bp.title}:`, cErr.message); continue; }
    console.log(`  ✓ ${classDef.code}/${bp.title} (${lessonDef.status}) with ${cards.length} cards`);
  }

  // Update completion_history on students for fading simulation
  for (const s of students) {
    const endedLessons = classDef.lessons.filter((l) => l.status === "ended");
    const history = {};
    for (const l of endedLessons) history[l.key] = 3 + Math.floor(Math.random() * 4);
    await db.from("students").update({ completion_history: history }).eq("id", s.id);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Ms. Rivera's lessons ──────────────────────────────────────────────────
  const { data: riveraList } = await db.auth.admin.listUsers({ page: 1, perPage: 100 });
  const rivera = { user: riveraList?.users?.find((u) => u.email === "demo.teacher@stepcards.app") };
  if (!rivera?.user) { console.log("✗ Ms. Rivera not found — run seed-demo.js first"); process.exit(1); }
  const riveraId = rivera.user.id;
  console.log("Adding lessons for Ms. Rivera…");
  for (const cls of RIVERA_CLASSES) await addLessons(cls, riveraId);

  // ── 2. Create Mr. Chen if not yet present ────────────────────────────────────
  let chenId;
  const { data: allUsers2 } = await db.auth.admin.listUsers({ page: 1, perPage: 100 });
  const existingChen = { user: allUsers2?.users?.find((u) => u.email === "demo.teacher2@stepcards.app") };
  if (existingChen?.user) {
    chenId = existingChen.user.id;
    console.log("Mr. Chen already exists, skipping auth creation");
  } else {
    const { data: created, error: authErr } = await db.auth.admin.createUser({
      email: "demo.teacher2@stepcards.app",
      password: "StepCards-demo-2026",
      email_confirm: true,
      user_metadata: { display_name: "Mr. Chen" },
    });
    if (authErr) throw new Error("Auth for Mr. Chen: " + authErr.message);
    chenId = created.user.id;
    console.log("✓ Created Mr. Chen", chenId);
  }

  // ── 3. Create Mr. Chen's org ──────────────────────────────────────────────────
  let orgId;
  const { data: existingOrg } = await db.from("organizations").select("id").eq("created_by", chenId).maybeSingle();
  if (existingOrg) {
    orgId = existingOrg.id;
    console.log("Mr. Chen org already exists, skipping");
  } else {
    const { data: org, error: orgErr } = await db.from("organizations").insert({
      name: "Sunrise Learning Center (demo)",
      created_by: chenId,
    }).select("id").single();
    if (orgErr) throw new Error("Org for Mr. Chen: " + orgErr.message);
    orgId = org.id;
    console.log("✓ Created org", orgId);
  }

  // ── 4. Create Mr. Chen's classes + students ───────────────────────────────────
  const CHEN_STUDENTS = [
    { nickname: "Alex",  reading_level: "pictogram_only", avatar: "heart"    },
    { nickname: "River", reading_level: "grade6",         avatar: "leaf"     },
    { nickname: "Mel",   reading_level: "grade4",         avatar: "triangle" },
    { nickname: "Kai",   reading_level: "grade2",         avatar: "square"   },
    { nickname: "Fen",   reading_level: "grade6",         avatar: "circle"   },
  ];

  console.log("Adding Mr. Chen's classes…");
  for (const classDef of CHEN_CLASSES) {
    let classId;
    const { data: existingCls } = await db.from("classes").select("id").eq("join_code", classDef.code).maybeSingle();
    if (existingCls) {
      classId = existingCls.id;
      console.log(`  ~ Class ${classDef.code} already exists`);
    } else {
      const { data: cls, error: clsErr } = await db.from("classes").insert({
        org_id: orgId,
        teacher_id: chenId,
        name: classDef.name,
        join_code: classDef.code,
      }).select("id").single();
      if (clsErr) { console.log(`  ✗ Class ${classDef.code}:`, clsErr.message); continue; }
      classId = cls.id;

      // Add students
      const { error: studErr } = await db.from("students").insert(
        CHEN_STUDENTS.map((s) => ({ ...s, class_id: classId }))
      );
      if (studErr) { console.log(`  ✗ Students in ${classDef.code}:`, studErr.message); continue; }
      console.log(`  ✓ Class ${classDef.code} (${classDef.name}) with ${CHEN_STUDENTS.length} students`);
    }

    await addLessons(classDef, chenId);
  }

  console.log("\nDone! Both demo teachers now have classes and lesson history.");
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isValidCode, normalizeCode } from "./step-cards/codes";

/** A signed-in teacher joins an organization with the invite code their admin shared. */
export const joinOrganization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ code: z.string().max(12) }).parse(data))
  .handler(async ({ data, context }) => {
    const code = normalizeCode(data.code);
    if (!isValidCode(code)) throw new Error("That invite code doesn't look right. It has 6 letters and numbers.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: org } = await supabaseAdmin.from("organizations").select("id, name").eq("invite_code", code).maybeSingle();
    if (!org) throw new Error("We couldn't find an organization with that invite code.");
    const { error } = await supabaseAdmin
      .from("organization_members")
      .upsert({ org_id: org.id, user_id: context.userId, role: "teacher" }, { onConflict: "org_id,user_id", ignoreDuplicates: true });
    if (error) throw new Error("Couldn't join the organization. Please try again.");
    return { orgId: org.id, name: org.name };
  });

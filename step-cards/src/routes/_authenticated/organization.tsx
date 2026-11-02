import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { membershipsQuery } from "@/lib/queries";
import { formatCode } from "@/lib/step-cards/codes";
import { independence } from "@/lib/step-cards/metrics";

export const Route = createFileRoute("/_authenticated/organization")({
  head: () => ({
    meta: [
      { title: "Organization overview — Step Cards" },
      { name: "description", content: "Teachers, classes and independence across your organization." },
      { property: "og:title", content: "Organization overview — Step Cards" },
      { property: "og:description", content: "Teachers, classes and independence across your organization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrganizationPage,
});

function useOrgOverview(orgId: string | undefined) {
  return useQuery({
    queryKey: ["org-overview", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const id = orgId as string;
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const [members, classes] = await Promise.all([
        supabase.from("organization_members").select("id, user_id, role, created_at").eq("org_id", id),
        supabase.from("classes").select("id, name, teacher_id, created_at, students(count)").eq("org_id", id),
      ]);
      if (members.error) throw new Error(members.error.message);
      if (classes.error) throw new Error(classes.error.message);
      const userIds = (members.data ?? []).map((m) => m.user_id);
      const classIds = (classes.data ?? []).map((c) => c.id);
      const [profiles, lessons, cards] = await Promise.all([
        userIds.length ? supabase.from("profiles").select("id, display_name").in("id", userIds) : Promise.resolve({ data: [], error: null }),
        classIds.length
          ? supabase.from("lessons").select("id, class_id, created_at").in("class_id", classIds).gte("created_at", since)
          : Promise.resolve({ data: [], error: null }),
        classIds.length
          ? supabase.from("lesson_cards").select("class_id, current_step, help_count, completed_at, updated_at").in("class_id", classIds).gte("updated_at", since)
          : Promise.resolve({ data: [], error: null }),
      ]);
      return {
        members: members.data ?? [],
        classes: classes.data ?? [],
        profiles: new Map((profiles.data ?? []).map((p) => [p.id, p.display_name])),
        lessons: lessons.data ?? [],
        cards: cards.data ?? [],
      };
    },
  });
}

function OrganizationPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const queryClient = useQueryClient();
  const { data: memberships, isLoading } = useQuery({ ...membershipsQuery(userId), enabled: !!userId });
  const adminMembership = memberships?.find((m) => m.role === "admin");
  const org = adminMembership?.organizations;
  const { data, error } = useOrgOverview(org?.id);
  const [removing, setRemoving] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from("organization_members").delete().eq("id", memberId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setRemoving(null);
      queryClient.invalidateQueries({ queryKey: ["org-overview"] });
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!org)
    return (
      <div className="notice-info flex-col items-start gap-3 p-6 text-base">
        <p>This page is for organization admins. You can set up an organization from your classes page.</p>
        <Link to="/dashboard" className="btn-primary">Go to my classes</Link>
      </div>
    );

  const stats = independence(data?.cards ?? []);
  const studentTotal = (data?.classes ?? []).reduce((sum, c) => sum + ((c.students as unknown as { count: number }[])[0]?.count ?? 0), 0);
  const lessonsByClass = new Map<string, number>();
  data?.lessons.forEach((l) => lessonsByClass.set(l.class_id, (lessonsByClass.get(l.class_id) ?? 0) + 1));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Organization overview</p>
          <h1 className="display-lg mt-1">{org.name}</h1>
        </div>
        <div className="surface-quiet px-5 py-4">
          <p className="text-sm text-muted-foreground">Teacher invite code</p>
          <p className="font-display text-3xl font-semibold tracking-[0.2em]">{formatCode(org.invite_code)}</p>
          <p className="text-sm text-muted-foreground">Teachers enter it after creating their account.</p>
        </div>
      </div>

      {error && <p className="notice-error">{error.message}</p>}

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="font-display text-xl font-semibold">Last 30 days</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Teachers", String(data?.members.length ?? 0)],
            ["Classes · students", `${data?.classes.length ?? 0} · ${studentTotal}`],
            ["Instructions given", String(data?.lessons.length ?? 0)],
            ["Steps done without help", stats.independentPct === null ? "—" : `${stats.independentPct}%`],
          ].map(([label, value]) => (
            <div key={label} className="surface p-5">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-muted-foreground prose-width">
          “Steps done without help” is the pilot measure: steps students completed, minus Help me requests. {stats.stepsCompleted} steps and {stats.helpRequests} help requests so far.
        </p>
      </section>

      <section aria-labelledby="teachers-heading">
        <h2 id="teachers-heading" className="font-display text-xl font-semibold">Teachers</h2>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {data?.members.map((m) => {
            const name = data.profiles.get(m.user_id) || "Teacher";
            const classCount = data.classes.filter((c) => c.teacher_id === m.user_id).length;
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{name}{m.user_id === userId ? " (you)" : ""}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.role === "admin" ? "Admin" : "Teacher"} · {classCount} class{classCount === 1 ? "" : "es"}
                  </p>
                </div>
                {m.role === "teacher" &&
                  (removing === m.id ? (
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm">Remove {name} from {org.name}?</span>
                      <button type="button" className="btn bg-destructive font-bold text-primary-foreground" onClick={() => remove.mutate(m.id)}>
                        Yes, remove
                      </button>
                      <button type="button" className="btn-ghost" onClick={() => setRemoving(null)}>Keep</button>
                    </span>
                  ) : (
                    <button type="button" className="btn-ghost text-sm" onClick={() => setRemoving(m.id)}>
                      Remove
                    </button>
                  ))}
              </li>
            );
          })}
        </ul>
        {data && data.members.length <= 1 && (
          <p className="mt-3 text-muted-foreground">Share the invite code above so teachers can join.</p>
        )}
      </section>

      <section aria-labelledby="classes-heading">
        <h2 id="classes-heading" className="font-display text-xl font-semibold">Classes</h2>
        {data?.classes.length ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left">
              <thead className="border-b border-border text-sm text-muted-foreground">
                <tr>
                  <th className="p-4 font-bold">Class</th>
                  <th className="p-4 font-bold">Teacher</th>
                  <th className="p-4 font-bold">Students</th>
                  <th className="p-4 font-bold">Instructions (30 days)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.classes.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4">
                      <Link to="/classes/$classId" params={{ classId: c.id }} className="font-bold text-primary hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-4">{data.profiles.get(c.teacher_id) || "Teacher"}</td>
                    <td className="p-4">{(c.students as unknown as { count: number }[])[0]?.count ?? 0}</td>
                    <td className="p-4">{lessonsByClass.get(c.id) ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">No classes yet. Classes created by your teachers appear here.</p>
        )}
      </section>
    </div>
  );
}

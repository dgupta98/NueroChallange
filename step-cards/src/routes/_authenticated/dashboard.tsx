import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { joinOrganization } from "@/lib/org.functions";
import { membershipsQuery, myClassesQuery, profileQuery } from "@/lib/queries";
import { formatCode } from "@/lib/step-cards/codes";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My classes — Step Cards" },
      { name: "description", content: "Your Step Cards classes, class codes and live cards." },
      { property: "og:title", content: "My classes — Step Cards" },
      { property: "og:description", content: "Your Step Cards classes, class codes and live cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const { data: profile } = useQuery({ ...profileQuery(userId), enabled: !!userId });
  const { data: memberships, isLoading: loadingOrgs } = useQuery({ ...membershipsQuery(userId), enabled: !!userId });
  const { data: classes, isLoading } = useQuery({ ...myClassesQuery(userId), enabled: !!userId });
  const adminOrg = memberships?.find((m) => m.role === "admin")?.organizations;
  const anyOrg = memberships?.[0]?.organizations;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{anyOrg ? anyOrg.name : "Your workspace"}</p>
          <h1 className="display-lg mt-1">Hello{profile?.display_name ? `, ${profile.display_name}` : ""}</h1>
        </div>
        {adminOrg && (
          <Link to="/organization" className="btn-outline">
            View organization overview
          </Link>
        )}
      </div>

      <section aria-labelledby="classes-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="classes-heading" className="font-display text-2xl font-semibold">My classes</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="text-muted-foreground">Loading your classes…</p>}
          {classes?.map((c) => {
            const studentCount = (c.students as unknown as { count: number }[])[0]?.count ?? 0;
            const live = (c.lessons as { status: string }[]).some((l) => l.status === "live");
            return (
              <Link
                key={c.id}
                to="/classes/$classId"
                params={{ classId: c.id }}
                className="surface group flex flex-col gap-4 p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold">{c.name}</h3>
                  {live && (
                    <span className="chip border-success/40 bg-success-soft text-success-foreground">
                      <span aria-hidden="true">●</span> Cards live
                    </span>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Students</dt>
                    <dd className="text-lg font-bold">{studentCount}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Class code</dt>
                    <dd className="font-display text-lg font-semibold tracking-wider">{formatCode(c.join_code)}</dd>
                  </div>
                </dl>
                <span className="mt-auto font-bold text-primary group-hover:underline">Open class →</span>
              </Link>
            );
          })}
          <NewClassCard orgId={anyOrg?.id ?? null} userId={userId} />
        </div>
      </section>

      {!loadingOrgs && !memberships?.length && <OrganizationSetup userId={userId} />}
    </div>
  );
}

function NewClassCard({ orgId, userId }: { orgId: string | null; userId: string }) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const create = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .insert({ name: name.trim(), teacher_id: userId, org_id: orgId })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate({ to: "/classes/$classId/students", params: { classId: data.id } });
    },
  });

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (name.trim()) create.mutate();
      }}
      className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-border-strong p-6"
    >
      <label htmlFor="new-class" className="text-lg font-semibold">Create a class</label>
      <input
        id="new-class"
        className="field"
        placeholder="For example: Cooking, period 2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
      />
      {create.error && <p className="notice-error">{create.error.message}</p>}
      <button type="submit" className="btn-primary mt-auto" disabled={!name.trim() || create.isPending}>
        {create.isPending ? "Creating…" : "Create class"}
      </button>
    </form>
  );
}

function OrganizationSetup({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const join = useServerFn(joinOrganization);
  const [code, setCode] = useState("");
  const [orgName, setOrgName] = useState("");

  const joinMutation = useMutation({
    mutationFn: () => join({ data: { code } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("organizations").insert({ name: orgName.trim(), created_by: userId });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <section aria-labelledby="org-heading" className="surface-quiet p-6 sm:p-8">
      <h2 id="org-heading" className="font-display text-2xl font-semibold">Part of a school or program?</h2>
      <p className="mt-2 text-muted-foreground prose-width">
        Joining an organization lets your admin support you. You can also keep working on your own — this is optional.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <form
          className="flex flex-col gap-3 rounded-xl bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault();
            joinMutation.mutate();
          }}
        >
          <label htmlFor="invite" className="font-semibold">I have an invite code</label>
          <input id="invite" className="field font-display tracking-widest uppercase" value={code} onChange={(e) => setCode(e.target.value)} maxLength={8} placeholder="ABC 234" />
          {joinMutation.error && <p className="notice-error">{joinMutation.error.message}</p>}
          <button className="btn-primary" disabled={code.trim().length < 6 || joinMutation.isPending}>
            {joinMutation.isPending ? "Joining…" : "Join organization"}
          </button>
        </form>
        <form
          className="flex flex-col gap-3 rounded-xl bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <label htmlFor="org-name" className="font-semibold">Set up my organization</label>
          <input id="org-name" className="field" value={orgName} onChange={(e) => setOrgName(e.target.value)} maxLength={120} placeholder="For example: Desert Sky School" />
          {createMutation.error && <p className="notice-error">{createMutation.error.message}</p>}
          <button className="btn-outline" disabled={orgName.trim().length < 2 || createMutation.isPending}>
            {createMutation.isPending ? "Creating…" : "Create organization"}
          </button>
          <p className="text-sm text-muted-foreground">You'll become its admin and get a code to invite teachers.</p>
        </form>
      </div>
    </section>
  );
}

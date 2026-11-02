import { Link } from "@tanstack/react-router";

import { formatCode } from "@/lib/step-cards/codes";

export function ClassHeader({
  classId,
  name,
  joinCode,
  current,
}: {
  classId: string;
  name: string;
  joinCode: string;
  current: "class" | "students";
}) {
  return (
    <div className="space-y-5">
      <Link to="/dashboard" className="btn-ghost -ml-3 text-muted-foreground">
        ← My classes
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="display-lg">{name}</h1>
          <nav aria-label="Class" className="mt-4 flex gap-2">
            <Link
              to="/classes/$classId"
              params={{ classId }}
              className={current === "class" ? "btn-selected" : "btn-outline"}
              aria-current={current === "class" ? "page" : undefined}
            >
              Instructions
            </Link>
            <Link
              to="/classes/$classId/students"
              params={{ classId }}
              className={current === "students" ? "btn-selected" : "btn-outline"}
              aria-current={current === "students" ? "page" : undefined}
            >
              Students
            </Link>
          </nav>
        </div>
        <div className="surface-quiet px-5 py-4">
          <p className="text-sm text-muted-foreground">Class code for students</p>
          <p className="font-display text-3xl font-semibold tracking-[0.2em]">{formatCode(joinCode)}</p>
          <p className="text-sm text-muted-foreground">They open the Join page and type it in.</p>
        </div>
      </div>
    </div>
  );
}

const PICTO = (id: number) => `https://api.arasaac.org/v1/pictograms/${id}?color=true`;

const VERSIONS = [
  { who: "Leo", level: "Early reader", text: "Soap hands", pic: PICTO(34846) },
  { who: "Sam", level: "Developing reader", text: "Rub soap on your hands", pic: PICTO(34846) },
  { who: "Maya", level: "Confident reader", text: "Rub soap on both hands for 20 seconds.", pic: PICTO(34846) },
];

/** A static picture of the product: one spoken instruction becomes three personal cards. */
export function HeroDemo() {
  return (
    <div className="relative" aria-label="Example: one spoken instruction becomes three personal step cards">
      <div className="surface relative z-10 mx-auto max-w-sm p-4">
        <p className="text-sm text-muted-foreground">The teacher says</p>
        <p className="mt-1 font-display text-lg font-medium">"Wash your hands with soap, then sit down."</p>
      </div>
      <div aria-hidden="true" className="mx-auto h-8 w-px bg-border-strong" />
      <div className="grid gap-3 sm:grid-cols-3">
        {VERSIONS.map((v) => (
          <figure key={v.who} className="surface flex flex-col items-center gap-3 p-4 text-center">
            <figcaption className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{v.who}</span>
              <span>Step 2 of 4</span>
            </figcaption>
            <img src={v.pic} alt="" width={88} height={88} className="h-22 w-22 object-contain" loading="eager" />
            <p className="font-bold leading-snug">{v.text}</p>
            <span className="chip text-xs">{v.level}</span>
          </figure>
        ))}
      </div>
    </div>
  );
}

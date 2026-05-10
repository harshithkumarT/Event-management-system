export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? <p className="mb-3 text-sm uppercase tracking-[0.25em] text-accent-300">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
      {description ? <p className="mt-3 text-slate-300">{description}</p> : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);
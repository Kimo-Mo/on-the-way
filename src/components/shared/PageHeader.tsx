export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="mb-7">
      <h1 className="text-3xl leading-9 font-bold tracking-normal capitalize">{title}</h1>
      <p className="mt-1 text-base leading-6 text-muted-foreground">{subtitle}</p>
    </div>
  );
};

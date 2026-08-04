export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your portfolio is being set up.</h1>
        <p className="text-muted-foreground">
          Content will be served from the content API and managed from the dashboard.
        </p>
      </div>
    </main>
  );
}

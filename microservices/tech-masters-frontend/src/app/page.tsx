import ProgramList from "@/components/ProgramList";

// Define the expected Program type (same as in ProgramList)
type Program = {
  title: string;
  inst: string;
  field: string;
  status: string;
  statusLabel: string;
  sortDate: string;
  dateLabel: string;
  deadlineEU: string;
  deadlineNonEU: string;
  windowLabel: string;
  desc: string;
  tags: string[];
  lang: string;
  url: string;
  applyUrl: string;
  feeEU: string;
  feeEUNote: string;
  feeNonEU: string;
  feeApp: string;
  feeFree: boolean;
};

export default async function Home() {
  // Fetch from the backend API microservice
  // Next.js will automatically cache this for Vercel deployments (SSG behavior)
  let programs: Program[] = [];
  try {
    const res = await fetch(process.env.API_URL || 'http://localhost:8000/api/programs');
    if (res.ok) {
      programs = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch programs from backend:", error);
  }

  return (
    <main className="min-h-screen bg-black selection:bg-blue-500/30">
      <ProgramList initialPrograms={programs} />
    </main>
  );
}

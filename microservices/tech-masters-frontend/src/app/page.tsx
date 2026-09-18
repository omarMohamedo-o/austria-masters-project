import ProgramList, { Program, University } from "@/components/ProgramList";

export default async function Home() {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  let programs: Program[] = [];
  let universities: University[] = [];

  try {
    const [progRes, uniRes] = await Promise.allSettled([
      fetch(`${apiUrl}/api/programs`),
      fetch(`${apiUrl}/api/universities`)
    ]);

    if (progRes.status === "fulfilled" && progRes.value.ok) {
      programs = await progRes.value.json();
    }
    if (uniRes.status === "fulfilled" && uniRes.value.ok) {
      universities = await uniRes.value.json();
    }
  } catch (error) {
    console.error("Failed to fetch data from backend:", error);
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-slate-100 selection:bg-teal-500/30">
      <ProgramList initialPrograms={programs} initialUniversities={universities} />
    </main>
  );
}

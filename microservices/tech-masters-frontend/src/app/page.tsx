import ProgramList, { Program, University, Ad } from "@/components/ProgramList";

export default async function Home() {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  const adsUrl = process.env.ADS_URL || "http://localhost:4000";

  let programs: Program[] = [];
  let universities: University[] = [];
  let adsData: { topBanner?: Ad; inFeedAds?: Ad[]; analytics?: any } = {};

  try {
    const [progRes, uniRes, adsRes] = await Promise.allSettled([
      fetch(`${apiUrl}/api/programs`),
      fetch(`${apiUrl}/api/universities`),
      fetch(`${adsUrl}/api/ads`)
    ]);

    if (progRes.status === "fulfilled" && progRes.value.ok) {
      programs = await progRes.value.json();
    }
    if (uniRes.status === "fulfilled" && uniRes.value.ok) {
      universities = await uniRes.value.json();
    }
    if (adsRes.status === "fulfilled" && adsRes.value.ok) {
      adsData = await adsRes.value.json();
    }
  } catch (error) {
    console.error("Failed to fetch data from microservices:", error);
  }

  return (
    <main className="min-h-screen bg-[#0e1413] text-slate-100 selection:bg-teal-500/30">
      <ProgramList
        initialPrograms={programs}
        initialUniversities={universities}
        initialAds={adsData}
      />
    </main>
  );
}

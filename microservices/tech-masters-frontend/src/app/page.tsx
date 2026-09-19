import ProgramList, { Program, University, Ad } from "@/components/ProgramList";
import fs from "fs";
import path from "path";

export default async function Home() {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  const adsUrl = process.env.ADS_URL || "http://localhost:4000";

  let programs: Program[] = [];
  let universities: University[] = [];
  let adsData: { topBanner?: Ad; inFeedAds?: Ad[]; analytics?: any } = {};

  try {
    const [progRes, uniRes, adsRes] = await Promise.allSettled([
      fetch(`${apiUrl}/api/programs`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/universities`, { cache: "no-store" }),
      fetch(`${adsUrl}/api/ads`, { cache: "no-store" })
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

  // Guaranteed fallback: If backend was not reached during SSR, read directly from data/programs.json
  if (programs.length === 0) {
    try {
      const fallbackPath = path.resolve(process.cwd(), "../../data/programs.json");
      if (fs.existsSync(fallbackPath)) {
        programs = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
      }
    } catch (e) {
      console.error("Failed reading fallback programs:", e);
    }
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

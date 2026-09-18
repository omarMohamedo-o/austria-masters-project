import fs from "fs";
import path from "path";
import ProgramList from "@/components/ProgramList";

export default function Home() {
  // Read programs.json at build/server time
  // The path depends on where the Next.js app is run relative to the data dir
  const dataPath = path.join(process.cwd(), "..", "data", "programs.json");
  let programs = [];
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8");
    programs = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to read programs.json:", error);
  }

  return (
    <main className="min-h-screen bg-black selection:bg-blue-500/30">
      <ProgramList initialPrograms={programs} />
    </main>
  );
}

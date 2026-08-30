import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Button, Card } from "../components/ui";

export default function UniversityDashboard() {
  const [message, setMessage] = useState("");
  const students = useQuery({
    queryKey: ["university-students"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me/");
      return data;
    },
  });

  async function issueCredential() {
    const { data: students } = await api.get("/students/");
    const list = Array.isArray(students) ? students : students.results ?? [];
    const sp1042 = list.find((s: { student_id: string }) => s.student_id === "SP-1042");
    if (!sp1042) {
      setMessage("SP-1042 not found — run seed_demo");
      return;
    }
    try {
      await api.post("/students/issue/", {
        student: sp1042.id,
        credential_type: "academic",
        gpa: 3.82,
        years_completed: 3,
        university: "Bindura University of Science Education",
      });
      setMessage("Credential issued to SP-1042");
    } catch {
      setMessage("Credential may already exist.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">University Issuer</h1>
        <p className="text-white/50">{students.data?.university_name || "Bindura University of Science Education"}</p>
      </div>
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Issue Credential</h2>
        <div className="glass-panel rounded-xl p-4 text-sm text-white/75">
          <p>Student: SP-1042</p>
          <p>GPA: 3.82 | Year: 3 | Enrollment: Active</p>
        </div>
        <Button className="mt-4" onClick={issueCredential}>Issue Credential</Button>
        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
      </Card>
    </div>
  );
}

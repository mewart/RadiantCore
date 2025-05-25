// CodexDashboard.jsx — React UI for Codex CRUD
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/input";

const API_BASE = "http://localhost:3200/api/codex";
const API_KEY = "RadiantCoreRules!27x9";

async function listCodices() {
  const res = await fetch(`${API_BASE}/list`, {
    headers: { "x-api-key": API_KEY },
  });
  return await res.json();
}

async function saveCodex(title, body) {
  const res = await fetch(`${API_BASE}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ title, body }),
  });
  return await res.json();
}

async function deleteCodex(title) {
  const codices = await listCodices();
  const match = codices.find((c) => c.title === title);
  if (!match) throw new Error("Codex not found");
  const res = await fetch(`${API_BASE}/delete/${match.uuid}`, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY },
  });
  return await res.json();
}

export default function CodexDashboard() {
  const [codices, setCodices] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const refreshCodices = async () => {
    try {
      const data = await listCodices();
      setCodices(data);
    } catch (err) {
      console.error("Failed to list codices", err);
    }
  };

  useEffect(() => {
    refreshCodices();
  }, []);

  const handleSave = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    const result = await saveCodex(newTitle.trim(), newBody.trim());
    setStatusMessage(result.message);
    refreshCodices();
  };

  const handleDelete = async (title) => {
    if (window.confirm(`Delete codex titled "${title}"?`)) {
      await deleteCodex(title);
      refreshCodices();
    }
  };

  return (
    <div className="p-6 space-y-6 text-white">
      <h2 className="text-2xl font-bold">Codex Dashboard</h2>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">Create or Update Codex</h3>
          <Input
            placeholder="Codex Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Codex Body"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
          <div className="flex gap-4">
            <Button className="w-full" onClick={handleSave}>Save</Button>
          </div>
          {statusMessage && <p className="text-sm text-zinc-400">{statusMessage}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-semibold text-lg mb-2">All Codices</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {codices.map((codex) => (
              <div key={codex.uuid} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-zinc-800 rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{codex.title}</div>
                  <div className="text-sm text-zinc-400 break-all">UUID: {codex.uuid}</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button className="min-w-[80px] h-10 px-4" variant="outline" onClick={() => {
                    setNewTitle(codex.title);
                    setNewBody(codex.entry_body || codex.body);
                  }}>Edit</Button>
                  <Button className="min-w-[80px] h-10 px-4" variant="destructive" onClick={() => handleDelete(codex.title)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <style>{`
        aside .space-y-2 {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        aside button {
          width: 100% !important;
          justify-content: flex-start !important;
          padding: 0.75rem 1rem !important;
          font-weight: 500;
          border-radius: 0.5rem;
          margin: 0 !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}

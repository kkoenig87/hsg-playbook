import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Dein MockAPI-Endpunkt
const MOCKAPI_URL = "https://68e58a6d21dd31f22cc20e06.mockapi.io/plays";

app.use(cors());
app.use(express.json());

// --- ALLE SPIELZÜGE LADEN ---
app.get("/plays", async (req, res) => {
  try {
    const response = await fetch(MOCKAPI_URL);
    const plays = await response.json();
    res.json(plays);
  } catch (err) {
    console.error("Fehler beim Laden der Spielzüge:", err);
    res.status(500).json({ error: "Fehler beim Laden der Spielzüge" });
  }
});

// --- NEUEN SPIELZUG ANLEGEN ---
app.post("/plays", async (req, res) => {
  try {
    const response = await fetch(MOCKAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const newPlay = await response.json();
    res.json(newPlay);
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// --- SPIELZUG LÖSCHEN ---
app.delete("/plays/:id", async (req, res) => {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${req.params.id}`, {
      method: "DELETE",
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Fehler beim Löschen:", err);
    res.status(500).json({ error: "Fehler beim Löschen" });
  }
});

// --- SERVER STARTEN ---
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});

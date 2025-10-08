const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // falls Node <18, ansonsten native fetch nutzen
const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static('./')); // Statische Dateien (playbook.html etc.)

const MOCKAPI_BASE = 'https://68e58a6d21dd31f22cc20e06.mockapi.io/plays';
const ADMIN_PW = 'coach2025!';

// === GET /api/plays ===
app.get('/api/plays', async (req, res) => {
  try {
    const response = await fetch(MOCKAPI_BASE);
    const data = await response.json();
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({error:'Fehler beim Laden der Spielzüge'});
  }
});

// === POST /api/plays ===
app.post('/api/plays', async (req,res) => {
  const { password, title, desc, cat, pos, srcType, src } = req.body;
  if(password !== ADMIN_PW) return res.status(403).json({error:'Ungültiges Passwort'});

  try {
    const response = await fetch(MOCKAPI_BASE, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, desc, cat, pos, srcType, src })
    });
    const data = await response.json();
    res.json({success:true, data});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'Fehler beim Speichern'});
  }
});

// === DELETE /api/plays/:id ===
app.delete('/api/plays/:id', async (req,res) => {
  const { password } = req.body;
  if(password !== ADMIN_PW) return res.status(403).json({error:'Ungültiges Passwort'});

  try {
    const response = await fetch(`${MOCKAPI_BASE}/${req.params.id}`, { method:'DELETE' });
    const data = await response.json();
    res.json({success:true, data});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'Fehler beim Löschen'});
  }
});

app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));

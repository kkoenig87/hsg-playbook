const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.ADMIN_PASSWORD; // Admin-Passwort

app.use(bodyParser.json());

const path = require('path');
app.use('/api', express.static(path.join(__dirname, 'api'))); // API bleibt erreichbar

// Playbook.html korrekt ausliefern
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'playbook.html'));
});

// Optional: direkte URL /playbook.html
app.get('/playbook.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'playbook.html'));
});

const playsFile = path.join(__dirname, 'api', 'plays.json');

// Lade bestehende Plays oder erstelle neue Datei
if (!fs.existsSync(playsFile)) {
    fs.writeFileSync(playsFile, JSON.stringify([]));
}

// Spielerinnen: Liste aller Plays
app.get('/api/plays', (req, res) => {
    const plays = JSON.parse(fs.readFileSync(playsFile));
    res.json(plays);
});

// Admin: neuen Play hinzufügen
app.post('/api/plays', (req, res) => {
    const { password, play } = req.body;
    if (password !== PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    if (!play) return res.status(400).json({ error: 'No play provided' });

    const plays = JSON.parse(fs.readFileSync(playsFile));
    plays.push(play);
    fs.writeFileSync(playsFile, JSON.stringify(plays, null, 2));
    res.json({ success: true, plays });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

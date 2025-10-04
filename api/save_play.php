<?php
// Einfacher Passwortschutz
$PASSWORD = 'coach2025!';
if (!isset($_POST['password']) || $_POST['password'] !== $PASSWORD) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

// Datei-Pfad
$file = __DIR__ . '/plays.json';

// Lade bestehende Daten oder lege neue Datei an
if (file_exists($file)) {
    $plays = json_decode(file_get_contents($file), true);
    if (!$plays) $plays = [];
} else {
    $plays = [];
}

// Neue Spielzüge aus POST-Daten hinzufügen
if (isset($_POST['play'])) {
    $plays[] = $_POST['play'];
    file_put_contents($file, json_encode($plays, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "plays" => $plays]);
} else {
    echo json_encode(["error" => "No play provided"]);
}
?>

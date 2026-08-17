-- ==========================================================
-- OBSERVADOR PSICOLÓGICO — Seed Data
-- Plantilla Athletic Club Femenino 2026-27
-- Datos de: https://www.athletic-club.eus/equipos/athletic-club-femenino/2026-27/plantilla/
-- ==========================================================

-- Porteras
INSERT INTO players (full_name, short_name, dorsal, position, birth_date, birth_place, status, seasons, official_matches) VALUES
  ('Adriana Nanclares Romero', 'A. Nanclares', 1, 'Portera', '2002-05-09', 'Miranda de Ebro (Burgos)', 'disponible', 4, 82),
  ('Eunate Astralaga Aranguren', 'Astralaga', 13, 'Portera', NULL, NULL, 'disponible', NULL, NULL),
  ('Elene Aldekoa Arrúe', 'Elene', 25, 'Portera', NULL, NULL, 'disponible', NULL, NULL),
  ('Ziara Vega Uribarri', 'Ziara Vega', 30, 'Portera', NULL, NULL, 'disponible', NULL, NULL);

-- Defensas
INSERT INTO players (full_name, short_name, dorsal, position, birth_date, birth_place, status, seasons, official_matches) VALUES
  ('Maddi Torre Larrañaga', 'Maddi', 2, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Naia Landaluze Marquínez', 'Landaluze', 3, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Bibiane Schulze Solano', 'Bibi', 4, 'Defensa', '1998-11-12', 'Bad Soden (Alemania)', 'disponible', 6, 59),
  ('Ane Elexpuru Anorga', 'Elexpuru', 5, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Eider Arana Mugueta', 'Eider', 12, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Garazi Facila Giralte', 'Gara', 15, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Amaia Martínez de la Peña', 'Amaia M', 18, 'Defensa', NULL, NULL, 'disponible', NULL, NULL),
  ('Nerea Benito Zaldíbar', 'Nerea B.', 22, 'Defensa', NULL, NULL, 'disponible', NULL, NULL);

-- Centrocampistas
INSERT INTO players (full_name, short_name, dorsal, position, birth_date, birth_place, status, seasons, official_matches) VALUES
  ('Maite Valero Elia', 'Valero', 6, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Irene Oguiza Martínez', 'Oguiza', 8, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Leire Baños Indakoetxea', 'L. Baños', 10, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Clara Pinedo Castresana', 'Pinedo', 14, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Amaia Iribarren Arteta', 'Iribarren', 16, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Marina Artero Moreno', 'M. Artero', 20, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL),
  ('Elene Gurtubay Loyo', 'Gurtubay', 24, 'Centrocampista', NULL, NULL, 'disponible', NULL, NULL);

-- Delanteras
INSERT INTO players (full_name, short_name, dorsal, position, birth_date, birth_place, status, seasons, official_matches) VALUES
  ('Jone Amezaga Martínez', 'J. Amezaga', 7, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Patricia Zugasti Osés', 'P. Zugasti', 9, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Ane Azkona Fuente', 'Azkona', 11, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Sara Ortega Ruiz', 'S. Ortega', 17, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Maitane Vilariño Mendinueta', 'Vilariño', 19, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Ane Campos Andúeza', 'Campos', 21, 'Delantera', NULL, NULL, 'disponible', NULL, NULL),
  ('Daniela Agote Aguirre', 'Agote', 23, 'Delantera', NULL, NULL, 'disponible', NULL, NULL);

-- Cuerpo técnico
INSERT INTO staff (name, role) VALUES
  ('Víctor Martín', 'Entrenador'),
  ('Gontxal Idoate', '2º Entrenador'),
  ('Daniel Boya', 'Preparador Físico'),
  ('Roberto Cantarero', 'Analista'),
  ('Manex Sagarna', 'Entrenador de Porteras');

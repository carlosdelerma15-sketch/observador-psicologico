-- ==========================================================
-- OBSERVADOR PSICOLÓGICO — Esquema de Base de Datos
-- Athletic Club Femenino · Liga F 2026-27
-- SQLite / PostgreSQL compatible
-- ==========================================================

-- Jugadoras
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  dorsal INTEGER,
  position TEXT CHECK(position IN ('Portera','Defensa','Centrocampista','Delantera')),
  birth_date TEXT,
  birth_place TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'disponible' CHECK(status IN ('disponible','lesionada','rotación','sancionada')),
  seasons INTEGER,
  official_matches INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evaluaciones psicológicas individuales
CREATE TABLE IF NOT EXISTS evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  eval_date DATE NOT NULL,
  session_type TEXT CHECK(session_type IN ('Entrenamiento','Partido')),
  evaluator TEXT,
  
  -- Atención y concentración (0-10)
  atencion_mantiene INTEGER CHECK(atencion_mantiene BETWEEN 0 AND 10),
  atencion_relevante INTEGER CHECK(atencion_relevante BETWEEN 0 AND 10),
  atencion_recupera INTEGER CHECK(atencion_recupera BETWEEN 0 AND 10),
  atencion_fatiga INTEGER CHECK(atencion_fatiga BETWEEN 0 AND 10),
  atencion_conductas TEXT,
  
  -- Respuesta ante el error (0-10)
  error_reaccion_proporcional INTEGER CHECK(error_reaccion_proporcional BETWEEN 0 AND 10),
  error_recuperacion_rapida INTEGER CHECK(error_recuperacion_rapida BETWEEN 0 AND 10),
  error_implicacion_siguiente INTEGER CHECK(error_implicacion_siguiente BETWEEN 0 AND 10),
  error_evita_enganche INTEGER CHECK(error_evita_enganche BETWEEN 0 AND 10),
  error_conducta_despues TEXT,
  
  -- Confianza y seguridad (0-10)
  confianza_decidida INTEGER CHECK(confianza_decidida BETWEEN 0 AND 10),
  confianza_responsabilidad INTEGER CHECK(confianza_responsabilidad BETWEEN 0 AND 10),
  confianza_sigue_intentando INTEGER CHECK(confianza_sigue_intentando BETWEEN 0 AND 10),
  confianza_presion INTEGER CHECK(confianza_presion BETWEEN 0 AND 10),
  confianza_conductas TEXT,
  
  -- Regulación emocional (0-10)
  regulacion_frustracion INTEGER CHECK(regulacion_frustracion BETWEEN 0 AND 10),
  regulacion_estabilidad INTEGER CHECK(regulacion_estabilidad BETWEEN 0 AND 10),
  regulacion_funcional INTEGER CHECK(regulacion_funcional BETWEEN 0 AND 10),
  regulacion_tolera_adverso INTEGER CHECK(regulacion_tolera_adverso BETWEEN 0 AND 10),
  regulacion_desencadenantes TEXT,
  
  -- Comunicación (0-10)
  comunicacion_companeras INTEGER CHECK(comunicacion_companeras BETWEEN 0 AND 10),
  comunicacion_constructiva INTEGER CHECK(comunicacion_constructiva BETWEEN 0 AND 10),
  comunicacion_info_util INTEGER CHECK(comunicacion_info_util BETWEEN 0 AND 10),
  comunicacion_escucha INTEGER CHECK(comunicacion_escucha BETWEEN 0 AND 10),
  comunicacion_adversa INTEGER CHECK(comunicacion_adversa BETWEEN 0 AND 10),
  comunicacion_observaciones TEXT,
  
  -- Motivación e implicación (0-10)
  motivacion_intensidad INTEGER CHECK(motivacion_intensidad BETWEEN 0 AND 10),
  motivacion_persistencia INTEGER CHECK(motivacion_persistencia BETWEEN 0 AND 10),
  motivacion_protagonismo INTEGER CHECK(motivacion_protagonismo BETWEEN 0 AND 10),
  motivacion_no_destaca INTEGER CHECK(motivacion_no_destaca BETWEEN 0 AND 10),
  motivacion_observaciones TEXT,
  
  -- Conductas de mejora y aprendizaje (0-10)
  mejora_escucha INTEGER CHECK(mejora_escucha BETWEEN 0 AND 10),
  mejora_pregunta INTEGER CHECK(mejora_pregunta BETWEEN 0 AND 10),
  mejora_aplica INTEGER CHECK(mejora_aplica BETWEEN 0 AND 10),
  mejora_justifica INTEGER CHECK(mejora_justifica BETWEEN 0 AND 10),
  mejora_enfada INTEGER CHECK(mejora_enfada BETWEEN 0 AND 10),
  mejora_disminuye INTEGER CHECK(mejora_disminuye BETWEEN 0 AND 10),
  mejora_otro TEXT,
  
  -- Conductas ante presión (respuestas abiertas)
  presion_marcador_adverso TEXT,
  presion_final_partido TEXT,
  presion_error_propio TEXT,
  presion_error_companera TEXT,
  presion_correccion_entrenador TEXT,
  presion_decision_arbitral TEXT,
  
  -- Observaciones generales
  observaciones_generales TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Índices para evaluaciones
CREATE INDEX IF NOT EXISTS idx_evaluations_player ON evaluations(player_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON evaluations(eval_date);
CREATE INDEX IF NOT EXISTS idx_evaluations_player_date ON evaluations(player_id, eval_date);

-- Métricas grupales
CREATE TABLE IF NOT EXISTS group_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eval_date DATE NOT NULL,
  session_type TEXT CHECK(session_type IN ('Entrenamiento','Partido')),
  cohesion INTEGER CHECK(cohesion BETWEEN 0 AND 10),
  resiliencia INTEGER CHECK(resiliencia BETWEEN 0 AND 10),
  comunicacion INTEGER CHECK(comunicacion BETWEEN 0 AND 10),
  asimilacion_carga INTEGER CHECK(asimilacion_carga BETWEEN 0 AND 10),
  observaciones TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sociograma / Mapa de liderazgo
CREATE TABLE IF NOT EXISTS leadership_map (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eval_date DATE NOT NULL,
  player_id INTEGER NOT NULL,
  role TEXT CHECK(role IN ('líder_formal','líder_informal','conectora','aislada','emergente')),
  influence_score INTEGER CHECK(influence_score BETWEEN 0 AND 10),
  connections TEXT, -- JSON array de player_ids
  notes TEXT,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leadership_player ON leadership_map(player_id);

-- Dinámicas e intervenciones grupales
CREATE TABLE IF NOT EXISTS group_dynamics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_date DATE NOT NULL,
  event_type TEXT CHECK(event_type IN ('charla_grupal','dinámica_cohesión','evento_externo','intervención_individual','reunión_staff')),
  title TEXT NOT NULL,
  description TEXT,
  participants TEXT, -- JSON array
  impact_score INTEGER CHECK(impact_score BETWEEN 0 AND 10),
  impact_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dynamics_date ON group_dynamics(event_date);

-- Cuerpo técnico
CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

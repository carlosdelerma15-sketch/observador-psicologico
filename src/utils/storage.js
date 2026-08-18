// Capa de persistencia — localStorage
// API preparada para migración a backend REST en Fase 2

const STORAGE_KEYS = {
  EVALUATIONS: 'op_evaluations',
  GROUP_METRICS: 'op_group_metrics',
  LEADERSHIP_MAP: 'op_leadership_map',
  GROUP_DYNAMICS: 'op_group_dynamics',
  PLAYER_OVERRIDES: 'op_player_overrides',
  TEAM_OBSERVATIONS: 'op_team_observations',
};


function getStore(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// === EVALUACIONES INDIVIDUALES ===

export function saveEvaluation(evaluation) {
  const evals = getStore(STORAGE_KEYS.EVALUATIONS);
  const newEval = {
    ...evaluation,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  evals.push(newEval);
  setStore(STORAGE_KEYS.EVALUATIONS, evals);
  return newEval;
}

export function getEvaluationsForPlayer(playerId) {
  const evals = getStore(STORAGE_KEYS.EVALUATIONS);
  return evals
    .filter((e) => e.playerId === playerId)
    .sort((a, b) => new Date(b.evalDate) - new Date(a.evalDate));
}

export function getLatestEvaluation(playerId) {
  const evals = getEvaluationsForPlayer(playerId);
  return evals.length > 0 ? evals[0] : null;
}

export function getAllEvaluations() {
  return getStore(STORAGE_KEYS.EVALUATIONS);
}

export function deleteEvaluation(evalId) {
  const evals = getStore(STORAGE_KEYS.EVALUATIONS);
  const filtered = evals.filter((e) => e.id !== evalId);
  setStore(STORAGE_KEYS.EVALUATIONS, filtered);
}

// === MÉTRICAS GRUPALES ===

export function saveGroupMetric(metric) {
  const metrics = getStore(STORAGE_KEYS.GROUP_METRICS);
  const newMetric = {
    ...metric,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  metrics.push(newMetric);
  setStore(STORAGE_KEYS.GROUP_METRICS, metrics);
  return newMetric;
}

export function getGroupMetrics() {
  return getStore(STORAGE_KEYS.GROUP_METRICS).sort(
    (a, b) => new Date(b.evalDate) - new Date(a.evalDate)
  );
}

// === MAPA DE LIDERAZGO ===

export function saveLeadershipMap(data) {
  setStore(STORAGE_KEYS.LEADERSHIP_MAP, data);
}

export function getLeadershipMap() {
  return getStore(STORAGE_KEYS.LEADERSHIP_MAP);
}

// === DINÁMICAS GRUPALES ===

export function saveGroupDynamic(dynamic) {
  const dynamics = getStore(STORAGE_KEYS.GROUP_DYNAMICS);
  const newDynamic = {
    ...dynamic,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  dynamics.push(newDynamic);
  setStore(STORAGE_KEYS.GROUP_DYNAMICS, dynamics);
  return newDynamic;
}

export function getGroupDynamics() {
  return getStore(STORAGE_KEYS.GROUP_DYNAMICS).sort(
    (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
  );
}

export function deleteGroupDynamic(dynamicId) {
  const dynamics = getStore(STORAGE_KEYS.GROUP_DYNAMICS);
  const filtered = dynamics.filter((d) => d.id !== dynamicId);
  setStore(STORAGE_KEYS.GROUP_DYNAMICS, filtered);
}

// === OVERRIDES DE JUGADORAS (estado, etc.) ===

export function savePlayerOverride(playerId, overrides) {
  const all = getStore(STORAGE_KEYS.PLAYER_OVERRIDES);
  const existing = all.find((o) => o.playerId === playerId);
  if (existing) {
    Object.assign(existing, overrides);
  } else {
    all.push({ playerId, ...overrides });
  }
  setStore(STORAGE_KEYS.PLAYER_OVERRIDES, all);
}

export function getPlayerOverrides(playerId) {
  const all = getStore(STORAGE_KEYS.PLAYER_OVERRIDES);
  return all.find((o) => o.playerId === playerId) || {};
}

export function getAllPlayerOverrides() {
  return getStore(STORAGE_KEYS.PLAYER_OVERRIDES);
}

// === OBSERVACIÓN DEL EQUIPO (EVALUACIÓN GRUPAL COMPLETA) ===

export function saveTeamObservation(observation) {
  const list = getStore(STORAGE_KEYS.TEAM_OBSERVATIONS);
  const newObs = {
    ...observation,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  list.push(newObs);
  setStore(STORAGE_KEYS.TEAM_OBSERVATIONS, list);
  return newObs;
}

export function getTeamObservations() {
  return getStore(STORAGE_KEYS.TEAM_OBSERVATIONS).sort(
    (a, b) => new Date(b.evalDate) - new Date(a.evalDate)
  );
}

export function getLatestTeamObservation() {
  const list = getTeamObservations();
  return list.length > 0 ? list[0] : null;
}


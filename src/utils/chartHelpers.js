// Utilidades para dibujar gráficos con Canvas API

/**
 * Dibuja un gráfico de araña (radar/spider chart)
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {Object} options - Configuración
 */
export function drawSpiderChart(ctx, {
  data = [],         // Array de { label, value (0-10), color }
  centerX,
  centerY,
  radius,
  maxValue = 10,
  showLabels = true,
  fillColor = 'rgba(238, 37, 35, 0.15)',
  strokeColor = '#ee2523',
  gridColor = 'rgba(148, 163, 184, 0.2)',
  labelColor = '#94a3b8',
  dotColor = '#ee2523',
  fontSize = 11,
}) {
  const numAxes = data.length;
  if (numAxes < 3) return;

  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2; // Start from top

  // Draw grid circles
  const gridLevels = 5;
  for (let i = 1; i <= gridLevels; i++) {
    const r = (radius / gridLevels) * i;
    ctx.beginPath();
    for (let j = 0; j <= numAxes; j++) {
      const angle = startAngle + angleStep * j;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axes
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + angleStep * i;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw data polygon
  ctx.beginPath();
  for (let i = 0; i <= numAxes; i++) {
    const idx = i % numAxes;
    const angle = startAngle + angleStep * idx;
    const value = (data[idx].value / maxValue) * radius;
    const x = centerX + value * Math.cos(angle);
    const y = centerY + value * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw data points
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + angleStep * i;
    const value = (data[i].value / maxValue) * radius;
    const x = centerX + value * Math.cos(angle);
    const y = centerY + value * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = dotColor;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw labels
  if (showLabels) {
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + angleStep * i;
      const labelRadius = radius + 24;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);

      // Ajustar posición de texto según ángulo
      if (Math.abs(Math.cos(angle)) > 0.8) {
        ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
      } else {
        ctx.textAlign = 'center';
      }

      // Truncar label si es muy largo
      const label = data[i].label.length > 14
        ? data[i].label.substring(0, 12) + '…'
        : data[i].label;

      ctx.fillText(label, x, y);

      // Mostrar valor numérico debajo
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = data[i].color || strokeColor;
      ctx.fillText(data[i].value.toFixed(1), x, y + fontSize + 2);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = labelColor;
    }
  }
}

/**
 * Dibuja un gráfico de líneas para evolución temporal
 */
export function drawLineChart(ctx, {
  data = [],         // Array de { date, values: { key: value } }
  keys = [],         // Array de { id, label, color }
  width,
  height,
  padding = { top: 20, right: 20, bottom: 40, left: 40 },
  maxValue = 10,
  gridColor = 'rgba(148, 163, 184, 0.15)',
  labelColor = '#94a3b8',
}) {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  if (data.length === 0) return;

  // Draw grid
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (plotHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Y-axis labels
    const value = maxValue - (maxValue / gridLines) * i;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), padding.left - 8, y);
  }

  // X-axis labels (dates)
  const xStep = data.length > 1 ? plotWidth / (data.length - 1) : 0;
  data.forEach((point, i) => {
    const x = padding.left + xStep * i;
    ctx.font = '9px Inter, sans-serif';
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const dateLabel = point.date ? point.date.substring(5) : '';
    ctx.fillText(dateLabel, x, height - padding.bottom + 8);
  });

  // Draw lines for each key
  keys.forEach((key) => {
    ctx.beginPath();
    let hasData = false;

    data.forEach((point, i) => {
      const value = point.values[key.id];
      if (value === undefined || value === null) return;

      const x = padding.left + xStep * i;
      const y = padding.top + plotHeight - (value / maxValue) * plotHeight;

      if (!hasData) {
        ctx.moveTo(x, y);
        hasData = true;
      } else {
        ctx.lineTo(x, y);
      }
    });

    if (hasData) {
      ctx.strokeStyle = key.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw dots
      data.forEach((point, i) => {
        const value = point.values[key.id];
        if (value === undefined || value === null) return;

        const x = padding.left + xStep * i;
        const y = padding.top + plotHeight - (value / maxValue) * plotHeight;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = key.color;
        ctx.fill();
      });
    }
  });
}

/**
 * Dibuja un gauge circular (para métricas grupales)
 */
export function drawGauge(ctx, {
  centerX,
  centerY,
  radius,
  value = 0,
  maxValue = 10,
  label = '',
  color = '#ee2523',
  bgColor = 'rgba(148, 163, 184, 0.15)',
  labelColor = '#e2e8f0',
}) {
  const startAngle = 0.75 * Math.PI;
  const endAngle = 2.25 * Math.PI;
  const totalArc = endAngle - startAngle;
  const valueAngle = startAngle + (value / maxValue) * totalArc;

  // Background arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = bgColor;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, valueAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value text
  ctx.font = 'bold 24px Outfit, sans-serif';
  ctx.fillStyle = labelColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toFixed(1), centerX, centerY - 4);

  // Label
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(label, centerX, centerY + 20);
}

/**
 * Escala para pantallas de alta resolución (Retina)
 */
export function setupHiDPI(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

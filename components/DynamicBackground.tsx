'use client';

import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { useEffect, useMemo, useState } from 'react';

interface Point {
  cx: number;
  cy: number;
  r: number;
  fillColor: string;
  opacity: number;
}

interface LinePath {
  start: Point;
  end: Point;
}

const COLORS = ['#00D4FF', '#7B2CBF', '#FFFFFF'];

const DynamicBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  const svgContent = useMemo(() => {
    const width = 3000;
    const height = 1500;
    const circles: string[] = [];
    const lines: string[] = [];
    const movingDots: string[] = [];

    const pds = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 250,
      tries: 30,
    });

    const points = (pds.fill() as [number, number][]).map(([cx, cy]): Point => ({
      cx,
      cy,
      r: Math.random() * 8 + 4,
      fillColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.3 + 0.2,
    }));

    const selectedPoints = points.slice(0, Math.min(points.length, 22));

    selectedPoints.forEach((p: Point, i: number) => {
      circles.push(
        `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.fillColor}" opacity="${p.opacity}" style="--i: ${i};"/>`,
      );
    });

    const delaunayPoints: [number, number][] = selectedPoints.map((p: Point) => [p.cx, p.cy]);
    const delaunay = Delaunator.from(delaunayPoints);
    const triangles = delaunay.triangles;

    for (let i = 0; i < triangles.length; i += 3) {
      const p1: Point = selectedPoints[triangles[i]];
      const p2: Point = selectedPoints[triangles[i + 1]];
      const p3: Point = selectedPoints[triangles[i + 2]];
      const strokeColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const opacity = Math.random() * 0.2 + 0.1;

      const linePaths: LinePath[] = [
        { start: p1, end: p2 },
        { start: p2, end: p3 },
        { start: p3, end: p1 },
      ];

      linePaths.forEach(({ start, end }: LinePath) => {
        lines.push(
          `<path d="M${start.cx},${start.cy} L${end.cx},${end.cy}" fill="none" stroke="${strokeColor}" stroke-width="1" opacity="${opacity}"/>`,
        );

        const duration = 2 + Math.random() * 2;
        movingDots.push(`
          <circle r="2" fill="${strokeColor}" opacity="${Math.min(opacity + 0.2, 0.9)}">
            <animateMotion
              dur="${duration}s"
              repeatCount="indefinite"
              calcMode="linear"
              path="M${start.cx},${start.cy} L${end.cx},${end.cy}"
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              begin="${Math.random() * duration}s"
            />
          </circle>
        `);
      });
    }

    return `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect fill="#1A1A2E" fill-opacity="0" width="${width}" height="${height}"/>
        <g id="OBJECTS">
          ${lines.join('')}
          ${circles.join('')}
          ${movingDots.join('')}
        </g>
      </svg>
    `;
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), 500);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1000ms ease',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default DynamicBackground;

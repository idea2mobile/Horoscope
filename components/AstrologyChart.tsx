import React, { useMemo } from 'react';
import { ChartData, THAI_ZODIAC_NAMES } from '../types';

interface AstrologyChartProps {
  data: ChartData;
}

const AstrologyChart: React.FC<AstrologyChartProps> = ({ data }) => {
  const size = 500;
  const center = size / 2;
  const outerRadius = 240;
  const zodiacRadius = 180;
  const innerRadius = 100;

  // Helper to get coordinates from angle (degrees)
  // Thai charts often place Aries (0) at the top (12 o'clock) and count counter-clockwise.
  // Standard Math: 0 deg is 3 o'clock. 
  // To make 0 index (Aries) be at 12 o'clock (90 deg in math) and go CCW:
  // Angle = -90 + (index * 30) ? No.
  // We want Index 0 (Aries) centered at Top. Top is -90deg (or 270).
  // Let's stick to standard map: Index 0 starts at angle -105 (to center the wedge at -90).
  
  const getCoordinates = (angleInDegrees: number, radius: number) => {
    // Convert to radians. Subtract 90 degrees to rotate so 0 is at 12 o'clock.
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  // Group planets by zodiac sign to avoid overlapping text
  const planetsByZodiac = useMemo(() => {
    const groups: { [key: number]: string[] } = {};
    
    // Add Ascendant (Lagana/L)
    const ascIndex = data.ascendant.zodiacIndex;
    if (!groups[ascIndex]) groups[ascIndex] = [];
    groups[ascIndex].push("ล"); // Thai symbol for Lagana

    // Add Planets
    data.planets.forEach(p => {
      if (!groups[p.zodiacIndex]) groups[p.zodiacIndex] = [];
      groups[p.zodiacIndex].push(p.symbol);
    });

    return groups;
  }, [data]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-square p-2">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle cx={center} cy={center} r={outerRadius} fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
        <circle cx={center} cy={center} r={zodiacRadius} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={innerRadius} fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={30} fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />

        {/* Zodiac Slices */}
        {THAI_ZODIAC_NAMES.map((name, index) => {
          // Each slice is 30 degrees.
          // We want Index 0 (Aries) to be at the top (12 o'clock).
          // 12 o'clock is -90 degrees.
          // The slice should center on -90. So it spans -105 to -75.
          // However, in standard trigonometry, we'll map 0..11 to angles counter-clockwise starting from top.
          const startAngle = index * 30 - 15; // Shift back 15 deg to center the wedge at 0, 30, 60... relative to top
          const endAngle = startAngle + 30;

          // Lines
          const p1 = getCoordinates(index * 30 + 15, innerRadius); // Corner of inner
          const p2 = getCoordinates(index * 30 + 15, outerRadius); // Corner of outer

          // Centroid for text
          const textPos = getCoordinates(index * 30, (zodiacRadius + innerRadius) / 2); // Middle of planet ring
          const labelPos = getCoordinates(index * 30, (outerRadius + zodiacRadius) / 2); // Middle of label ring

          return (
            <g key={index}>
              {/* Divider Lines */}
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="1" />
              
              {/* Zodiac Name */}
              <text 
                x={labelPos.x} 
                y={labelPos.y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#94a3b8" 
                fontSize="12"
                transform={`rotate(${index * 30}, ${labelPos.x}, ${labelPos.y})`}
              >
                {name}
              </text>

              {/* Planets in this sector */}
              {planetsByZodiac[index] && (
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold fill-yellow-400"
                  fontSize={planetsByZodiac[index].length > 4 ? "14" : "18"}
                  style={{ filter: 'url(#glow)' }}
                >
                  {/* Simple layout: split into two lines if many planets */}
                  {planetsByZodiac[index].length <= 3 ? (
                     planetsByZodiac[index].join(' ')
                  ) : (
                    <>
                       <tspan x={textPos.x} dy="-0.5em">{planetsByZodiac[index].slice(0, Math.ceil(planetsByZodiac[index].length/2)).join(' ')}</tspan>
                       <tspan x={textPos.x} dy="1.2em">{planetsByZodiac[index].slice(Math.ceil(planetsByZodiac[index].length/2)).join(' ')}</tspan>
                    </>
                  )}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Center decorative text */}
        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" fontSize="24" fontWeight="bold">
          ดวง
        </text>
      </svg>
      
      {/* Legend for Symbols (Optional, helps techy aesthetic) */}
      <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 font-mono hidden md:block opacity-50">
        <div>๑:Sun</div>
        <div>๒:Moon</div>
        <div>๓:Mars</div>
        <div>๔:Mer</div>
        <div>๕:Jup</div>
        <div>๖:Ven</div>
        <div>๗:Sat</div>
        <div>๘:Rahu</div>
        <div>๙:Ketu</div>
        <div>๐:Ura</div>
      </div>
    </div>
  );
};

export default AstrologyChart;

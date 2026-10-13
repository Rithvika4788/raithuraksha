// Realistic field disaster photographs generated as high-fidelity SVG Data URLs with geotag & audit watermarks

export function getCropDamagePhotoUrl(
  type: 'flood' | 'drought' | 'heatwave' | 'heavy_rainfall',
  farmName: string,
  district: string,
  village: string,
  lat: number,
  lng: number,
  date: string,
  sha256Prefix: string
): string {
  if (type === 'flood' || type === 'heavy_rainfall') {
    // Flooded paddy field with waterlogging, submerged tillers, murky brown water and cloudy sky
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="skyFlood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#64748B" />
          <stop offset="60%" stop-color="#94A3B8" />
          <stop offset="100%" stop-color="#CBD5E1" />
        </linearGradient>
        <linearGradient id="floodWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#785A3C" />
          <stop offset="40%" stop-color="#5C4033" />
          <stop offset="100%" stop-color="#3E2723" />
        </linearGradient>
        <linearGradient id="paddyGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4D7C0F" />
          <stop offset="100%" stop-color="#285210" />
        </linearGradient>
      </defs>
      <!-- Overcast Sky -->
      <rect width="800" height="240" fill="url(#skyFlood)" />
      <!-- Distant tree line / bund -->
      <path d="M0,230 Q100,215 200,225 T400,220 T600,228 T800,220 L800,250 L0,250 Z" fill="#2E473B" opacity="0.8" />
      <path d="M50,235 Q150,225 300,232 T600,228 T800,234 L800,260 L0,260 Z" fill="#1F3529" />
      
      <!-- Flood Water Body (inundated field) -->
      <rect y="245" width="800" height="355" fill="url(#floodWater)" />
      
      <!-- Water ripples & mud sedimentation -->
      <path d="M0,280 Q200,290 400,280 T800,285 L800,295 Q500,288 0,295 Z" fill="#4E3629" opacity="0.6"/>
      <path d="M0,340 Q250,355 500,345 T800,350 L800,360 Q400,352 0,360 Z" fill="#6B4E3D" opacity="0.5"/>
      <path d="M0,420 Q200,435 450,425 T800,430 L800,442 Q350,432 0,440 Z" fill="#4E3629" opacity="0.7"/>
      <path d="M0,510 Q280,525 550,515 T800,520 L800,535 Q450,525 0,535 Z" fill="#3D2817" opacity="0.8"/>
      
      <!-- Submerged Paddy Crop Stalks / Lodged Flowering Tillers -->
      ${Array.from({ length: 45 }).map((_, i) => {
        const x = 20 + i * 17 + (i % 3) * 5;
        const y = 310 + (i % 7) * 35;
        const lean = 12 + (i % 5) * 8;
        return `<path d="M${x},${y} Q${x + lean},${y - 45} ${x + lean * 1.6},${y - 65} Q${x + lean * 1.8},${y - 50} ${x + 6},${y}" fill="url(#paddyGreen)" opacity="0.9" stroke="#365314" stroke-width="1.5" />
        <ellipse cx="${x + lean * 1.5}" cy="${y - 60}" rx="6" ry="14" fill="#A3E635" opacity="0.6" transform="rotate(30 ${x + lean * 1.5} ${y - 60})" />`;
      }).join('\n')}

      <!-- Water Reflection & Floating Debris -->
      <ellipse cx="260" cy="460" rx="140" ry="8" fill="#8D6E63" opacity="0.4" />
      <ellipse cx="620" cy="380" rx="90" ry="5" fill="#A1887F" opacity="0.3" />
      <circle cx="140" cy="390" r="16" fill="#4E342E" opacity="0.7" />

      <!-- Field Survey Verification HUD & Geotag Banner -->
      <rect x="0" y="515" width="800" height="85" fill="rgba(15, 23, 42, 0.88)" />
      <rect x="0" y="512" width="800" height="3" fill="#10B981" />
      
      <!-- Official Watermark Stamp -->
      <rect x="20" y="20" width="230" height="58" rx="8" fill="rgba(15, 23, 42, 0.75)" stroke="#34D399" stroke-width="1.5" />
      <text x="32" y="42" font-family="monospace, sans-serif" font-size="12" font-weight="bold" fill="#34D399">✓ TELANGANA AGRI-INSPECTION</text>
      <text x="32" y="62" font-family="monospace, sans-serif" font-size="10" fill="#E2E8F0">VERIFIED FIELD EVIDENCE PHOTO</text>

      <!-- Bottom Geotag Details -->
      <text x="24" y="540" font-family="sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">${farmName} — INUNDATION &amp; LODGING DAMAGE</text>
      <text x="24" y="560" font-family="monospace, sans-serif" font-size="11" fill="#94A3B8">Location: Village ${village}, Dist. ${district} | GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</text>
      <text x="24" y="580" font-family="monospace, sans-serif" font-size="10" fill="#34D399">Incident Date: ${date} | SHA-256: ${sha256Prefix}...</text>
      
      <!-- Right Badge -->
      <rect x="625" y="530" width="150" height="55" rx="6" fill="#B91C1C" />
      <text x="700" y="552" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SUBMERSION</text>
      <text x="700" y="570" font-family="sans-serif" font-size="10" fill="#FEE2E2" text-anchor="middle">DEPTH: ~2.5 FEET</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else if (type === 'drought') {
    // Drought: Cracked black soil, parched earth, wilted stunted cotton crop
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="skyDrought" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="50%" stop-color="#FCD34D" />
          <stop offset="100%" stop-color="#FEF08A" />
        </linearGradient>
        <linearGradient id="parchedGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#78350F" />
          <stop offset="50%" stop-color="#451A03" />
          <stop offset="100%" stop-color="#291204" />
        </linearGradient>
      </defs>
      <!-- Blazing Sun & Scorching Sky -->
      <rect width="800" height="220" fill="url(#skyDrought)" />
      <circle cx="680" cy="80" r="50" fill="#FFFBEB" opacity="0.9" />
      <circle cx="680" cy="80" r="80" fill="#FBBF24" opacity="0.3" />

      <!-- Deep cracked soil earth -->
      <rect y="200" width="800" height="400" fill="url(#parchedGround)" />

      <!-- Deep Mud Cracks (Polygon paths) -->
      <path d="M100,220 L150,300 L220,380 L180,480 L230,550 M150,300 L90,360 L40,420 M220,380 L320,410 L410,480 L440,550 M320,410 L280,470 L290,540 M410,480 L480,510" stroke="#1C0B02" stroke-width="4.5" fill="none"/>
      <path d="M400,220 L450,290 L420,360 L500,420 L580,500 L560,560 M450,290 L530,310 L620,360 M500,420 L460,490 L480,550 M620,360 L680,430 L740,490 M680,430 L640,510 L660,560" stroke="#1C0B02" stroke-width="5" fill="none"/>
      <path d="M650,210 L700,270 L780,320 L760,420 M700,270 L640,320 L580,380" stroke="#1C0B02" stroke-width="4" fill="none"/>
      <path d="M0,280 L60,340 L30,420 L80,490" stroke="#1C0B02" stroke-width="4" fill="none"/>

      <!-- Wilted, Dried, Browned Crop Bushes -->
      ${Array.from({ length: 18 }).map((_, i) => {
        const x = 50 + i * 42 + (i % 2) * 15;
        const y = 300 + (i % 4) * 55;
        return `<path d="M${x},${y} Q${x - 8},${y - 30} ${x - 20},${y - 45} M${x},${y} Q${x + 5},${y - 35} ${x + 18},${y - 50} M${x},${y} Q${x + 12},${y - 20} ${x + 28},${y - 28}" stroke="#78350F" stroke-width="3" fill="none"/>
        <ellipse cx="${x - 18}" cy="${y - 42}" rx="5" ry="12" fill="#B45309" opacity="0.8" transform="rotate(-35 ${x - 18} ${y - 42})"/>
        <ellipse cx="${x + 16}" cy="${y - 46}" rx="5" ry="10" fill="#92400E" opacity="0.85" transform="rotate(30 ${x + 16} ${y - 46})"/>
        <ellipse cx="${x + 26}" cy="${y - 26}" rx="4" ry="8" fill="#78350F" opacity="0.9" transform="rotate(45 ${x + 26} ${y - 26})"/>`;
      }).join('\n')}

      <!-- Field Survey Verification HUD & Geotag Banner -->
      <rect x="0" y="515" width="800" height="85" fill="rgba(15, 23, 42, 0.88)" />
      <rect x="0" y="512" width="800" height="3" fill="#F59E0B" />
      
      <!-- Stamp -->
      <rect x="20" y="20" width="230" height="58" rx="8" fill="rgba(15, 23, 42, 0.75)" stroke="#F59E0B" stroke-width="1.5" />
      <text x="32" y="42" font-family="monospace, sans-serif" font-size="12" font-weight="bold" fill="#F59E0B">✓ TELANGANA AGRI-INSPECTION</text>
      <text x="32" y="62" font-family="monospace, sans-serif" font-size="10" fill="#E2E8F0">DROUGHT STRESS AUDIT PHOTO</text>

      <text x="24" y="540" font-family="sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">${farmName} — SOIL DESICCATION &amp; WILTING</text>
      <text x="24" y="560" font-family="monospace, sans-serif" font-size="11" fill="#94A3B8">Location: Village ${village}, Dist. ${district} | GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</text>
      <text x="24" y="580" font-family="monospace, sans-serif" font-size="10" fill="#F59E0B">Incident Date: ${date} | SHA-256: ${sha256Prefix}...</text>

      <rect x="625" y="530" width="150" height="55" rx="6" fill="#D97706" />
      <text x="700" y="552" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SEVERE DROUGHT</text>
      <text x="700" y="570" font-family="sans-serif" font-size="10" fill="#FEF3C7" text-anchor="middle">SOIL MOISTURE: -88%</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else {
    // Heatwave / Thermal desiccation: Scorched yellowed chilli crop, leaf curl, flower shedding
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="skyHeat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FECDD3" />
          <stop offset="60%" stop-color="#FED7AA" />
          <stop offset="100%" stop-color="#FFEDD5" />
        </linearGradient>
        <linearGradient id="soilHeat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9A3412" />
          <stop offset="100%" stop-color="#431407" />
        </linearGradient>
      </defs>
      <!-- Hazy High Temperature Sky -->
      <rect width="800" height="230" fill="url(#skyHeat)" />
      <circle cx="400" cy="70" r="60" fill="#FFF1F2" opacity="0.9" />
      <circle cx="400" cy="70" r="110" fill="#FB7185" opacity="0.25" />

      <!-- Field Bed -->
      <rect y="210" width="800" height="390" fill="url(#soilHeat)" />

      <!-- Scorched Furrows & Crop Rows -->
      <path d="M0,280 Q400,295 800,280 L800,310 Q400,325 0,310 Z" fill="#7C2D12" />
      <path d="M0,370 Q400,388 800,370 L800,405 Q400,422 0,405 Z" fill="#5A1A06" />
      <path d="M0,470 Q400,490 800,470 L800,510 Q400,530 0,510 Z" fill="#381003" />

      <!-- Scorched, Yellowed, Curled Chilli plants with flower drop -->
      ${Array.from({ length: 24 }).map((_, i) => {
        const x = 35 + i * 32 + (i % 3) * 6;
        const y = 320 + (i % 3) * 65;
        return `<path d="M${x},${y} L${x - 6},${y - 35} M${x},${y} L${x + 8},${y - 40} M${x},${y} L${x},${y - 48}" stroke="#854D0E" stroke-width="2.5" />
        <ellipse cx="${x - 8}" cy="${y - 38}" rx="6" ry="14" fill="#CA8A04" opacity="0.85" transform="rotate(-40 ${x - 8} ${y - 38})" />
        <ellipse cx="${x + 10}" cy="${y - 42}" rx="6" ry="13" fill="#A16207" opacity="0.8" transform="rotate(35 ${x + 10} ${y - 42})" />
        <ellipse cx="${x}" cy="${y - 50}" rx="5" ry="11" fill="#854D0E" opacity="0.9" />
        <circle cx="${x + 14}" cy="${y - 2}" r="3" fill="#DC2626" opacity="0.75" />
        <circle cx="${x - 10}" cy="${y + 2}" r="2.5" fill="#B45309" opacity="0.75" />`;
      }).join('\n')}

      <!-- Field Survey Verification HUD & Geotag Banner -->
      <rect x="0" y="515" width="800" height="85" fill="rgba(15, 23, 42, 0.88)" />
      <rect x="0" y="512" width="800" height="3" fill="#EF4444" />

      <rect x="20" y="20" width="230" height="58" rx="8" fill="rgba(15, 23, 42, 0.75)" stroke="#EF4444" stroke-width="1.5" />
      <text x="32" y="42" font-family="monospace, sans-serif" font-size="12" font-weight="bold" fill="#EF4444">✓ TELANGANA AGRI-INSPECTION</text>
      <text x="32" y="62" font-family="monospace, sans-serif" font-size="10" fill="#E2E8F0">THERMAL STRESS AUDIT PHOTO</text>

      <text x="24" y="540" font-family="sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">${farmName} — HEATWAVE LEAF BLIGHT &amp; FLOWER SHED</text>
      <text x="24" y="560" font-family="monospace, sans-serif" font-size="11" fill="#94A3B8">Location: Village ${village}, Dist. ${district} | GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</text>
      <text x="24" y="580" font-family="monospace, sans-serif" font-size="10" fill="#EF4444">Incident Date: ${date} | SHA-256: ${sha256Prefix}...</text>

      <rect x="625" y="530" width="150" height="55" rx="6" fill="#DC2626" />
      <text x="700" y="552" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">HEATWAVE DESICCATION</text>
      <text x="700" y="570" font-family="sans-serif" font-size="10" fill="#FEE2E2" text-anchor="middle">PEAK TEMP: 43.2°C</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}

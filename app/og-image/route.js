import { NextResponse } from 'next/server';

export async function GET() {
  // Simple SVG image for Open Graph
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#214929"/>
      <rect x="0" y="0" width="1200" height="630" fill="url(#grad1)"/>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#214929;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a5f35;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Logo/Brand Area -->
      <circle cx="300" cy="315" r="80" fill="#FCD900" opacity="0.9"/>
      <text x="300" y="325" font-family="serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#214929">🍌</text>
      
      <!-- Main Title -->
      <text x="600" y="280" font-family="serif" font-size="64" font-weight="bold" text-anchor="middle" fill="white">
        Pisang Ijo Evi
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="340" font-family="sans-serif" font-size="32" text-anchor="middle" fill="#F4E4C1">
        Es Pisang Ijo Khas Makassar
      </text>
      
      <!-- Description -->
      <text x="600" y="390" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#EBDEC5">
        Dessert Lembut, Manis, dan Autentik
      </text>
      
      <!-- Website URL -->
      <text x="600" y="450" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#D4AF37">
        pisangijoevi.web.id
      </text>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="150" r="20" fill="#D4AF37" opacity="0.3"/>
      <circle cx="1100" cy="480" r="25" fill="#F4E4C1" opacity="0.3"/>
      <circle cx="950" cy="150" r="15" fill="#FCD900" opacity="0.4"/>
      <circle cx="150" cy="500" r="18" fill="#EBDEC5" opacity="0.3"/>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
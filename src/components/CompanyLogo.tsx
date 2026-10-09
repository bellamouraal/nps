import React from 'react';

interface CompanyLogoProps {
  companyName: string;
  color?: string;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ companyName, color, className = 'w-10 h-10' }) => {
  const norm = companyName.toLowerCase().trim();

  // Known corporate logos crafted with clean geometric SVG
  if (norm.includes('nubank')) {
    return (
      <div className={`${className} rounded-lg bg-[#820ad1] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0`} title="Nubank">
        <span className="font-semibold tracking-tighter text-base">nu</span>
      </div>
    );
  }

  if (norm.includes('mercado livre') || norm.includes('mercadolivre')) {
    return (
      <div className={`${className} rounded-lg bg-[#ffe600] flex items-center justify-center text-[#2d3277] shadow-xs shrink-0`} title="Mercado Livre">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 11.5a3.5 3.5 0 0 1 7 0v.5M10.5 7v5" />
          <path d="M4 14.5c1.5-2 4-2.5 6.5-1.5 2.5 1 5 .5 6.5-1.5" />
        </svg>
      </div>
    );
  }

  if (norm.includes('itaú') || norm.includes('itau')) {
    return (
      <div className={`${className} rounded-lg bg-[#ec7000] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0`} title="Itaú">
        <span className="font-bold tracking-tight text-xs bg-[#003399] px-1 py-0.5 rounded">Itaú</span>
      </div>
    );
  }

  if (norm.includes('ifood')) {
    return (
      <div className={`${className} rounded-lg bg-[#ea1d2c] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0`} title="iFood">
        <span className="font-extrabold tracking-tight text-xs">iF</span>
      </div>
    );
  }

  if (norm.includes('stone')) {
    return (
      <div className={`${className} rounded-lg bg-[#00a868] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0`} title="Stone">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M12 4.5v15M4.5 12h15" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>
    );
  }

  if (norm.includes('aws') || norm.includes('amazon')) {
    return (
      <div className={`${className} rounded-lg bg-[#232f3e] flex items-center justify-center text-[#ff9900] font-bold text-xs shadow-xs shrink-0`} title="AWS">
        <span className="font-bold tracking-tighter">AWS</span>
      </div>
    );
  }

  if (norm.includes('totvs')) {
    return (
      <div className={`${className} rounded-lg bg-[#005ca9] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0`} title="TOTVS">
        <span className="font-bold tracking-tight">TOTVS</span>
      </div>
    );
  }

  if (norm.includes('ambev')) {
    return (
      <div className={`${className} rounded-lg bg-[#111827] flex items-center justify-center text-[#f1a80a] font-bold text-xs shadow-xs shrink-0`} title="Ambev">
        <span className="font-extrabold tracking-widest text-[11px]">ABV</span>
      </div>
    );
  }

  // Fallback monogram if no custom logo is specified:
  // Derive 2 letter monogram from company name
  const words = companyName.trim().split(/\s+/);
  const initials = words.length > 1 
    ? (words[0][0] + words[1][0]).toUpperCase()
    : companyName.slice(0, 2).toUpperCase();

  const brandBg = color || '#334155';

  return (
    <div 
      className={`${className} rounded-lg flex items-center justify-center text-white font-semibold text-xs tracking-wide shrink-0 shadow-xs`}
      style={{ backgroundColor: brandBg }}
      title={companyName}
    >
      <span>{initials}</span>
    </div>
  );
};

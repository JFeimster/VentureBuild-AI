
import JSZip from 'jszip';
import { ApiResponse, AutomatedBuildPackage, StrategicAdvisoryReport, GeneratedCodebase, CodeFile } from '../types';

/**
 * Prepares a flat array of files for the project, regardless of output type.
 */
export const generateProjectFiles = (data: ApiResponse, projectName: string): CodeFile[] => {
  const files: CodeFile[] = [];
  const { assistantOutput } = data;

  files.push({
    path: 'project_data.json',
    content: JSON.stringify(data, null, 2)
  });

  if (assistantOutput.outputType === 'GENERATED_CODEBASE' && assistantOutput.codebase) {
    const codebase = assistantOutput.codebase;
    codebase.files.forEach(file => {
      files.push({ path: file.path, content: file.content });
    });

    if (!codebase.files.find(f => f.path.toLowerCase() === 'readme.md')) {
      const fallbackReadme = generateFallbackReadme(codebase.techStack, projectName, codebase.setupInstructions);
      files.push({ path: 'README.md', content: fallbackReadme });
    }
  } else if (assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE' && assistantOutput.package) {
    const pkg = assistantOutput.package;
    files.push({ path: 'README.md', content: generatePackageReadme(pkg, projectName) });
    files.push({ path: 'index.html', content: generateHtmlSite(pkg, projectName) });
    files.push({ path: 'styles.css', content: generateCss(pkg) });
    files.push({ path: 'robots.txt', content: 'User-agent: *\nAllow: /' });
  } else if (assistantOutput.outputType === 'STRATEGIC_ADVISORY_REPORT' && assistantOutput.report) {
    const report = assistantOutput.report;
    files.push({ path: 'README.md', content: generateReportReadme(report, projectName) });
  }

  return files;
};

export const downloadProjectZip = async (data: ApiResponse, projectName: string) => {
  const zip = new JSZip();
  const folderName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const root = zip.folder(folderName);
  if (!root) return;

  const projectFiles = generateProjectFiles(data, projectName);
  projectFiles.forEach(file => {
    root.file(file.path, file.content);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}_venture_build.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const generateHtmlSite = (pkg: AutomatedBuildPackage, name: string, embeddedCss?: string): string => {
  const heroImage = pkg.preliminaryBrandAssetPack.generatedImages?.find(
    img => img.section.toLowerCase().includes('hero')
  )?.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Premium Solutions</title>
    <meta name="description" content="${pkg.aiCraftedStrategicCopy.missionStatement}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    ${embeddedCss ? `<style>${embeddedCss}</style>` : `<link rel="stylesheet" href="styles.css">`}
</head>
<body>
    <div class="wrapper">
        <header class="header glass-panel">
            <div class="container nav-container">
                <div class="logo text-gradient">${name}</div>
                <nav class="nav-links">
                    <a href="#features" class="hover-underline">Features</a>
                    <a href="#pricing" class="hover-underline">Pricing</a>
                </nav>
                <div class="nav-cta">
                    <a href="#" class="btn btn-primary hover-scale">${pkg.aiCraftedStrategicCopy.callsToAction[0]?.text || 'Get Started'}</a>
                </div>
            </div>
        </header>

        <section class="hero parallax" style="--bg-image: url('${heroImage}');">
            <div class="hero-overlay"></div>
            <div class="container hero-container relative z-10">
                <div class="hero-content reveal-on-scroll">
                    <h1 class="hero-title text-gradient">${pkg.aiCraftedStrategicCopy.valueProposition}</h1>
                    <p class="hero-subtitle">${pkg.aiCraftedStrategicCopy.missionStatement}</p>
                    <div class="cta-group">
                        <a href="#" class="btn btn-primary btn-lg hover-scale">${pkg.aiCraftedStrategicCopy.callsToAction[1]?.text || 'Start Now'}</a>
                        <a href="#features" class="btn btn-secondary btn-lg hover-scale glass-panel">Learn More</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="section features">
            <div class="container">
                <div class="section-header reveal-on-scroll">
                    <span class="badge">Innovation</span>
                    <h2>Engineered for Excellence</h2>
                </div>
                <div class="grid">
                    ${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map((f, i) => `
                    <div class="card feature-card hover-lift reveal-on-scroll" style="transition-delay: ${i * 150}ms">
                        <div class="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        <h4>${f.featureName}</h4>
                        <p>${f.benefitCopy}</p>
                    </div>`).join('')}
                </div>
            </div>
        </section>

        <section id="pricing" class="section pricing bg-slate-50/50">
            <div class="container">
                <div class="section-header reveal-on-scroll">
                    <span class="badge">Pricing</span>
                    <h2>Simple, High-Value Tiers</h2>
                </div>
                <div class="grid pricing-grid">
                    ${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map((t, i) => `
                    <div class="card pricing-card hover-lift reveal-on-scroll ${i === 1 ? 'featured' : ''}" style="transition-delay: ${i * 200}ms">
                        ${i === 1 ? '<div class="popular-tag">Most Popular</div>' : ''}
                        <h4>${t.tierName}</h4>
                        <div class="price">${t.price}</div>
                        <ul class="feature-list">
                            ${t.features.map(feat => `<li>${feat}</li>`).join('')}
                        </ul>
                        <a href="#" class="btn ${i === 1 ? 'btn-primary' : 'btn-outline'} full-width hover-scale">Choose ${t.tierName}</a>
                    </div>`).join('')}
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <h3 class="text-gradient">${name}</h3>
                        <p>&copy; ${new Date().getFullYear()} Venture Build AI Partner.</p>
                    </div>
                    <div class="footer-links">
                         <a href="#" class="hover-underline">Privacy</a>
                         <a href="#" class="hover-underline">Terms</a>
                         <a href="#" class="hover-underline">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
          observer.observe(el);
        });

        // Parallax Effect
        window.addEventListener('scroll', () => {
          const scrolled = window.pageYOffset;
          const parallaxElements = document.querySelectorAll('.parallax');
          parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.backgroundPositionY = (scrolled * speed) + 'px';
          });
        });
      });
    </script>
</body>
</html>`;
};

export const generateCss = (pkg: AutomatedBuildPackage): string => {
  const colors = pkg.preliminaryBrandAssetPack.curatedColorPalette;
  const primary = colors.find(c => c.role.toLowerCase().includes('primary'))?.hex || '#4f46e5';
  const secondary = colors.find(c => c.role.toLowerCase().includes('secondary'))?.hex || '#818cf8';
  const background = colors.find(c => c.role.toLowerCase().includes('background'))?.hex || '#ffffff';
  const text = colors.find(c => c.role.toLowerCase().includes('text'))?.hex || '#0f172a';
  
  return `
:root {
    --primary: ${primary};
    --primary-glow: ${primary}40;
    --secondary: ${secondary};
    --bg: ${background};
    --text: ${text};
    --text-muted: ${text}99;
    --white: #ffffff;
    --radius: 20px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

* { box-sizing: border-box; scroll-behavior: smooth; }

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

/* --- ADVANCED ANIMATIONS --- */

.reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 1s var(--ease), transform 1s var(--ease);
}

.reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.hover-lift {
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.hover-lift:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.hover-scale {
    transition: transform 0.3s var(--ease);
}

.hover-scale:hover {
    transform: scale(1.05);
}

.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(135deg, var(--text) 0%, var(--primary) 100%);
}

.hover-underline {
    position: relative;
    text-decoration: none;
    color: inherit;
}

.hover-underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: var(--primary);
    transition: width 0.3s var(--ease);
}

.hover-underline:hover::after {
    width: 100%;
}

/* --- LAYOUT & COMPONENTS --- */

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.header {
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -0.03em;
}

.nav-links {
    display: flex;
    gap: 40px;
}

@media (max-width: 768px) {
    .nav-links { display: none; }
}

.hero {
    min-height: 80vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-image: var(--bg-image);
    background-size: cover;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.4));
}

.hero-title {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.04em;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 600px;
    margin-bottom: 40px;
}

.cta-group {
    display: flex;
    gap: 20px;
}

.btn {
    padding: 14px 32px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: var(--primary);
    color: white;
    box-shadow: 0 10px 30px var(--primary-glow);
}

.btn-secondary {
    background: white;
    color: var(--text);
    border: 1px solid rgba(0,0,0,0.1);
}

.btn-lg { padding: 18px 40px; font-size: 1.1rem; }

.section { padding: 120px 0; }

.section-header { text-align: center; margin-bottom: 80px; }

.badge {
    background: var(--primary-glow);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 8px 16px;
    border-radius: 100px;
    margin-bottom: 20px;
    display: inline-block;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
}

.card {
    background: white;
    padding: 48px;
    border-radius: var(--radius);
    border: 1px solid rgba(0,0,0,0.05);
}

.card-icon {
    width: 60px;
    height: 60px;
    background: var(--primary-glow);
    color: var(--primary);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
}

.pricing-card.featured {
    border: 3px solid var(--primary);
    position: relative;
}

.popular-tag {
    position: absolute;
    top: 24px;
    right: 24px;
    background: var(--primary);
    color: white;
    font-size: 0.7rem;
    padding: 6px 12px;
    border-radius: 100px;
    font-weight: 800;
}

.price {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 32px;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin-bottom: 40px;
}

.feature-list li {
    padding-left: 30px;
    position: relative;
    margin-bottom: 16px;
    color: var(--text-muted);
}

.feature-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 900;
}

.footer {
    padding: 80px 0;
    border-top: 1px solid rgba(0,0,0,0.05);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media (max-width: 640px) {
    .footer-content { flex-direction: column; text-align: center; gap: 40px; }
}
`;
};

export const generateFallbackReadme = (stack: string, name: string, instructions?: string): string => {
  if (instructions) return instructions;
  const baseHeader = `# ${name}\n\nGenerated by Venture Build AI Partner.\n\n`;
  switch (stack) {
    case 'NEXT_JS':
      return baseHeader + `## Next.js Startup\n\n1. \`npm install\`\n2. \`npm run dev\``;
    case 'STATIC_WEBSITE':
      return baseHeader + `## Deployment\n\nDrag and drop the folder to Vercel/Netlify.`;
    default:
      return baseHeader + `## Instructions\n\nRefer to project files.`;
  }
};

export const generatePackageReadme = (pkg: AutomatedBuildPackage, name: string): string => {
  return `# ${name} - Strategy Pack\n\n## Value Prop\n${pkg.aiCraftedStrategicCopy.valueProposition}\n\n## Features\n${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map(f => `- ${f.featureName}: ${f.benefitCopy}`).join('\n')}`;
};

export const generateReportReadme = (report: StrategicAdvisoryReport, name: string): string => {
  return `# ${name} - Advisory\n\nGoal: Launch.\n\nIntegrations: ${report.integrationAndTechStackBlueprint.essentialIntegrations.map(i => i.tool).join(', ')}`;
};

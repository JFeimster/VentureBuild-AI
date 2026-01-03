
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
    <div class="cursor-dot"></div>
    <div class="wrapper">
        <header class="header glass-panel">
            <div class="container nav-container">
                <div class="logo text-gradient">${name}</div>
                <nav class="nav-links">
                    <a href="#features" class="hover-underline">Features</a>
                    <a href="#pricing" class="hover-underline">Pricing</a>
                </nav>
                <div class="nav-cta">
                    <a href="#" class="btn btn-primary btn-glow hover-scale">${pkg.aiCraftedStrategicCopy.callsToAction[0]?.text || 'Get Started'}</a>
                </div>
            </div>
        </header>

        <section class="hero parallax-container">
            <div class="parallax-bg" style="background-image: url('${heroImage}');"></div>
            <div class="hero-overlay"></div>
            <div class="container hero-container relative z-10">
                <div class="hero-content" data-reveal="up">
                    <h1 class="hero-title text-gradient">${pkg.aiCraftedStrategicCopy.valueProposition}</h1>
                    <p class="hero-subtitle">${pkg.aiCraftedStrategicCopy.missionStatement}</p>
                    <div class="cta-group">
                        <a href="#" class="btn btn-primary btn-lg btn-glow hover-scale">${pkg.aiCraftedStrategicCopy.callsToAction[1]?.text || 'Start Now'}</a>
                        <a href="#features" class="btn btn-secondary btn-lg hover-scale glass-panel">Learn More</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="section features">
            <div class="container">
                <div class="section-header" data-reveal="up">
                    <span class="badge">Innovation</span>
                    <h2 class="display-title">Engineered for Excellence</h2>
                </div>
                <div class="grid feature-grid">
                    ${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map((f, i) => `
                    <div class="card feature-card hover-lift" data-reveal="up" data-delay="${i * 100}">
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
                <div class="section-header" data-reveal="up">
                    <span class="badge">Pricing</span>
                    <h2 class="display-title">Simple, High-Value Tiers</h2>
                </div>
                <div class="grid pricing-grid">
                    ${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map((t, i) => `
                    <div class="card pricing-card hover-lift ${i === 1 ? 'featured' : ''}" data-reveal="${i % 2 === 0 ? 'left' : 'right'}" data-delay="${i * 150}">
                        ${i === 1 ? '<div class="popular-tag">Most Popular</div>' : ''}
                        <h4>${t.tierName}</h4>
                        <div class="price">${t.price}</div>
                        <ul class="feature-list">
                            ${t.features.map(feat => `<li>${feat}</li>`).join('')}
                        </ul>
                        <a href="#" class="btn ${i === 1 ? 'btn-primary btn-glow' : 'btn-outline'} full-width hover-scale">Choose ${t.tierName}</a>
                    </div>`).join('')}
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="footer-content" data-reveal="fade">
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
        // --- Intersection Observer for Entrance Animations ---
        const revealCallback = (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const delay = entry.target.dataset.delay || 0;
              setTimeout(() => {
                entry.target.classList.add('is-visible');
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-reveal]').forEach((el) => {
          revealObserver.observe(el);
        });

        // --- Performance-Optimized Parallax Scrolling ---
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const scrolled = window.pageYOffset;
              const parallaxBgs = document.querySelectorAll('.parallax-bg');
              parallaxBgs.forEach(bg => {
                const speed = 0.35;
                const offset = scrolled * speed;
                bg.style.transform = \`translate3d(0, \${offset}px, 0)\`;
              });
              ticking = false;
            });
            ticking = true;
          }
        });

        // --- Smooth Cursor Follower (Subtle Polish) ---
        const cursor = document.querySelector('.cursor-dot');
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
            document.querySelectorAll('a, button').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
            });
        } else {
            cursor.style.display = 'none';
        }
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
    --primary-rgb: ${hexToRgb(primary)};
    --secondary: ${secondary};
    --bg: ${background};
    --text: ${text};
    --text-muted: ${text}99;
    --white: #ffffff;
    --radius: 24px;
    --radius-sm: 12px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --transition-base: 0.5s var(--ease);
}

* { box-sizing: border-box; scroll-behavior: smooth; }

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

/* --- REVEAL SYSTEM --- */

[data-reveal] {
    opacity: 0;
    transition: opacity 1s var(--ease), transform 1.2s var(--ease);
}

[data-reveal="up"] { transform: translateY(40px); }
[data-reveal="down"] { transform: translateY(-40px); }
[data-reveal="left"] { transform: translateX(-40px); }
[data-reveal="right"] { transform: translateX(40px); }
[data-reveal="fade"] { transform: none; }

[data-reveal].is-visible {
    opacity: 1;
    transform: translate(0, 0);
}

/* --- INTERACTIVE POLISH --- */

.cursor-dot {
    width: 8px;
    height: 8px;
    background: var(--primary);
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.3s var(--ease), height 0.3s var(--ease), opacity 0.3s var(--ease);
}

.cursor-dot.expand {
    width: 40px;
    height: 40px;
    opacity: 0.15;
}

.hover-lift {
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
}

.hover-lift:hover {
    transform: translateY(-12px);
    box-shadow: 0 40px 80px -15px rgba(var(--primary-rgb), 0.15);
    border-color: rgba(var(--primary-rgb), 0.2);
}

.hover-scale {
    transition: transform 0.3s var(--ease);
}

.hover-scale:hover {
    transform: scale(1.04);
}

.btn-glow:hover {
    box-shadow: 0 0 30px rgba(var(--primary-rgb), 0.4);
}

/* --- LAYOUT & GLASSMORPHISM --- */

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
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
    font-weight: 500;
}

.hover-underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: var(--primary);
    transition: width 0.4s var(--ease);
}

.hover-underline:hover::after {
    width: 100%;
}

/* --- HEADER --- */

.header {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    padding: 16px 0;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -0.04em;
}

.nav-links {
    display: flex;
    gap: 48px;
}

@media (max-width: 768px) {
    .nav-links { display: none; }
}

/* --- HERO & PARALLAX --- */

.hero {
    min-height: 95vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding-top: 100px;
}

.parallax-container {
    perspective: 1px;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
}

.parallax-bg {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 120%;
    background-size: cover;
    background-position: center;
    z-index: -1;
    will-change: transform;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2), rgba(255,255,255,0.95) 80%);
    z-index: 0;
}

.hero-title {
    font-size: 5rem;
    font-weight: 900;
    line-height: 1.05;
    margin-bottom: 24px;
    letter-spacing: -0.05em;
    max-width: 900px;
}

@media (max-width: 768px) {
    .hero-title { font-size: 3rem; }
}

.hero-subtitle {
    font-size: 1.4rem;
    color: var(--text-muted);
    max-width: 650px;
    margin-bottom: 48px;
    font-weight: 400;
}

.cta-group {
    display: flex;
    gap: 24px;
}

/* --- UI COMPONENTS --- */

.btn {
    padding: 16px 40px;
    border-radius: var(--radius-sm);
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: transform 0.3s var(--ease), background 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-secondary {
    background: white;
    color: var(--text);
    border: 1px solid rgba(0,0,0,0.08);
}

.btn-lg { padding: 20px 48px; font-size: 1.15rem; }

.section { padding: 160px 0; }

.section-header { text-align: center; margin-bottom: 100px; }

.display-title {
    font-size: 3.5rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    margin-top: 16px;
}

@media (max-width: 768px) {
    .display-title { font-size: 2.5rem; }
}

.badge {
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 100px;
    letter-spacing: 0.1em;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 40px;
}

.card {
    background: white;
    padding: 56px;
    border-radius: var(--radius);
    border: 1px solid rgba(0,0,0,0.04);
}

.card-icon {
    width: 64px;
    height: 64px;
    background: rgba(var(--primary-rgb), 0.08);
    color: var(--primary);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;
}

.pricing-card.featured {
    border: 3px solid var(--primary);
    position: relative;
    transform: scale(1.05);
    z-index: 10;
}

@media (max-width: 768px) {
    .pricing-card.featured { transform: none; }
}

.popular-tag {
    position: absolute;
    top: 32px;
    right: 32px;
    background: var(--primary);
    color: white;
    font-size: 0.75rem;
    padding: 8px 16px;
    border-radius: 100px;
    font-weight: 800;
}

.price {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 40px;
    letter-spacing: -0.03em;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin-bottom: 48px;
}

.feature-list li {
    padding-left: 36px;
    position: relative;
    margin-bottom: 20px;
    color: var(--text-muted);
    font-weight: 500;
}

.feature-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 900;
}

.footer {
    padding: 100px 0;
    border-top: 1px solid rgba(0,0,0,0.04);
    background: #fafafa;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media (max-width: 640px) {
    .footer-content { flex-direction: column; text-align: center; gap: 48px; }
}
`;
};

// --- HELPER FUNCTIONS ---

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
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

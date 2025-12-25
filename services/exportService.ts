
import JSZip from 'jszip';
import { ApiResponse, AutomatedBuildPackage, StrategicAdvisoryReport, GeneratedCodebase, CodeFile } from '../types';

/**
 * Prepares a flat array of files for the project, regardless of output type.
 * This is used by both the ZIP downloader and the Vercel deployer.
 */
export const generateProjectFiles = (data: ApiResponse, projectName: string): CodeFile[] => {
  const files: CodeFile[] = [];
  const { assistantOutput } = data;

  // Always include raw data
  files.push({
    path: 'project_data.json',
    content: JSON.stringify(data, null, 2)
  });

  if (assistantOutput.outputType === 'GENERATED_CODEBASE' && assistantOutput.codebase) {
    const codebase = assistantOutput.codebase;
    
    // Add existing files from codebase
    codebase.files.forEach(file => {
      files.push({ path: file.path, content: file.content });
    });

    // Add generic README if not present
    if (!codebase.files.find(f => f.path.toLowerCase() === 'readme.md')) {
      const fallbackReadme = generateFallbackReadme(codebase.techStack, projectName, codebase.setupInstructions);
      files.push({ path: 'README.md', content: fallbackReadme });
    }

    // Ensure EMBED_WIDGET has a demo index.html if missing
    if (codebase.techStack === 'EMBED_WIDGET' && !codebase.files.find(f => f.path === 'index.html')) {
      const demoHtml = generateWidgetDemoHtml(projectName);
      files.push({ path: 'index.html', content: demoHtml });
    }

    // Ensure NEXT_JS has a package.json if missing (critical for Vercel)
    if (codebase.techStack === 'NEXT_JS' && !codebase.files.find(f => f.path === 'package.json')) {
      files.push({ 
        path: 'package.json', 
        content: JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          version: '0.1.0',
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint"
          },
          dependencies: {
            "react": "^18",
            "react-dom": "^18",
            "next": "14.1.0"
          }
        }, null, 2) 
      });
    }

  } else if (assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE' && assistantOutput.package) {
    const pkg = assistantOutput.package;
    
    // Generate README
    files.push({ path: 'README.md', content: generatePackageReadme(pkg, projectName) });

    // Generate HTML Site
    files.push({ path: 'index.html', content: generateHtmlSite(pkg, projectName) });

    // Generate CSS
    files.push({ path: 'styles.css', content: generateCss(pkg) });

    // Generate robots.txt
    files.push({ path: 'robots.txt', content: 'User-agent: *\nAllow: /' });

  } else if (assistantOutput.outputType === 'STRATEGIC_ADVISORY_REPORT' && assistantOutput.report) {
    const report = assistantOutput.report;
    files.push({ path: 'README.md', content: generateReportReadme(report, projectName) });
  }

  return files;
};

export const downloadProjectZip = async (data: ApiResponse, projectName: string) => {
  const zip = new JSZip();
  // Sanitize folder name
  const folderName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const root = zip.folder(folderName);

  if (!root) return;

  // Generate all files
  const projectFiles = generateProjectFiles(data, projectName);

  // Add files to zip
  projectFiles.forEach(file => {
    root.file(file.path, file.content);
  });

  // Generate ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Trigger Download
  const url = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}_venture_build.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const generateWidgetDemoHtml = (name: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Widget Demo</title>
    <meta name="description" content="Demo page for ${name} widget integration.">
    <link rel="stylesheet" href="widget.css">
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 0; margin: 0; background: #f8fafc; color: #334155; display: flex; flex-direction: column; min-height: 100vh; }
        .header { background: #fff; padding: 1.5rem 2rem; border-bottom: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .header h1 { margin: 0; font-size: 1.5rem; color: #0f172a; }
        .container { max-width: 900px; margin: 3rem auto; padding: 0 1.5rem; flex: 1; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); margin-bottom: 2rem; }
        .instructions { background: #f0f9ff; padding: 1.5rem; border-radius: 8px; border: 1px solid #bae6fd; color: #0369a1; margin-bottom: 2rem; }
        .code-block { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 6px; font-family: monospace; overflow-x: auto; margin-top: 0.5rem; }
        .label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.5rem; display: block; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${name} Widget Integration</h1>
    </header>

    <div class="container">
        <div class="instructions">
            <h3 style="margin-top:0">Integration Instructions</h3>
            <p>To add this widget to your site, simply include the CSS and JS files as shown below.</p>
            
            <div style="margin-top: 1rem;">
                <span class="label">1. Add Stylesheet to &lt;head&gt;</span>
                <div class="code-block">&lt;link rel="stylesheet" href="widget.css"&gt;</div>
            </div>

            <div style="margin-top: 1rem;">
                <span class="label">2. Add Script to Body End</span>
                <div class="code-block">&lt;script src="widget.js"&gt;&lt;/script&gt;</div>
            </div>
        </div>
        
        <span class="label">Live Preview</span>
        <div class="card">
            <p style="margin-bottom: 1.5rem; font-style: italic; color: #94a3b8;">The widget typically renders below or attaches to a specific element.</p>
            
            <!-- Widget Container Hook (Common pattern) -->
            <div id="widget-root"></div>
            <div class="widget-container"></div>
            
            <!-- Fallback text if widget fails -->
            <noscript>Please enable JavaScript to view the widget.</noscript>
        </div>
    </div>

    <!-- Integration Script -->
    <script src="widget.js"></script>
</body>
</html>`;
};

export const generateFallbackReadme = (stack: string, name: string, instructions?: string): string => {
  if (instructions) return instructions;

  const baseHeader = `# ${name}\n\nGenerated by Venture Build AI.\n\n`;

  switch (stack) {
    case 'NEXT_JS':
      return baseHeader + 
        `## Getting Started\n\nThis is a Next.js project.\n\n` +
        `1. Install dependencies:\n   \`\`\`bash\n   npm install\n   \`\`\`\n\n` +
        `2. Run the development server:\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n\n` +
        `3. Open [http://localhost:3000](http://localhost:3000) with your browser.`;
    
    case 'STATIC_WEBSITE':
      return baseHeader + 
        `## Deployment\n\n` +
        `You can deploy this static site easily using:\n` +
        `- **Vercel**: Drag and drop the folder.\n` +
        `- **Netlify**: Drag and drop the folder.\n` +
        `- **GitHub Pages**: Push to a repository and enable Pages.\n\n` +
        `## Local Development\n\nSimply open \`index.html\` in your browser.`;

    case 'EMBED_WIDGET':
      return baseHeader +
        `## Implementation\n\n` +
        `1. Include \`widget.css\` in your document head.\n` +
        `2. Include \`widget.js\` at the end of your document body.\n` +
        `3. Open \`index.html\` to see the live demo.`;
      
    default:
      return baseHeader + `## Instructions\n\nRefer to the project files for implementation details.`;
  }
};

export const generatePackageReadme = (pkg: AutomatedBuildPackage, name: string): string => {
  return `# ${name} - Venture Build Package

## Value Proposition
${pkg.aiCraftedStrategicCopy.valueProposition}

## Mission Statement
${pkg.aiCraftedStrategicCopy.missionStatement}

## Template Link
${pkg.coreProjectFile.templateLink}

## Key Features
${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map(f => `- **${f.featureName}**: ${f.benefitCopy}`).join('\n')}

## Pricing
${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map(t => `- **${t.tierName}** (${t.price}): ${t.features.join(', ')}`).join('\n')}

## Brand Colors
${pkg.preliminaryBrandAssetPack.curatedColorPalette.map(c => `- ${c.role}: ${c.hex}`).join('\n')}
`;
};

export const generateReportReadme = (report: StrategicAdvisoryReport, name: string): string => {
  return `# ${name} - Strategic Advisory Report

## Executive Summary
This report contains a comprehensive blueprint for launching your venture.

## Section Strategy
${report.sectionBySectionContentStrategy.map(s => `### ${s.sectionName}\nGoal: ${s.purposeAndGoalAnalysis}\n`).join('\n')}

## Tech Stack
${report.integrationAndTechStackBlueprint.essentialIntegrations.map(i => `- ${i.tool}: ${i.purpose}`).join('\n')}

## Pre-Launch Checklist
${report.seoAndPreLaunchChecklist.technicalGoLiveChecklist.map(i => `- [ ] ${i}`).join('\n')}
`;
};

export const generateHtmlSite = (pkg: AutomatedBuildPackage, name: string, embeddedCss?: string): string => {
  // Try to find the hero image, fallback if missing
  const heroImage = pkg.preliminaryBrandAssetPack.generatedImages?.find(
    img => img.section.toLowerCase().includes('hero')
  )?.imageUrl || 'https://placehold.co/1200x600/png?text=Hero+Background';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ${pkg.aiCraftedStrategicCopy.valueProposition.substring(0, 50)}...</title>
    <meta name="description" content="${pkg.aiCraftedStrategicCopy.missionStatement}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    ${embeddedCss ? `<style>${embeddedCss}</style>` : `<link rel="stylesheet" href="styles.css">`}
</head>
<body class="reveal-on-scroll">
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

        <section class="hero parallax-bg" style="background-image: url('${heroImage}'); position: relative;">
            <div class="hero-overlay" style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7)); z-index: 0;"></div>
            <div class="container hero-container" style="position: relative; z-index: 1;">
                <div class="hero-content animate-slide-up">
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
                    <span class="badge">Features</span>
                    <h2>Why Choose ${name}</h2>
                </div>
                <div class="grid">
                    ${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map((f, i) => `
                    <div class="card feature-card hover-lift" style="animation-delay: ${i * 100}ms">
                        <div class="card-icon"></div>
                        <h4>${f.featureName}</h4>
                        <p>${f.benefitCopy}</p>
                    </div>`).join('')}
                </div>
            </div>
        </section>

        <section id="pricing" class="section pricing">
            <div class="container">
                <div class="section-header reveal-on-scroll">
                    <span class="badge">Pricing</span>
                    <h2>Simple, Transparent Pricing</h2>
                </div>
                <div class="grid pricing-grid">
                    ${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map((t, i) => `
                    <div class="card pricing-card hover-lift ${i === 1 ? 'featured' : ''}" style="animation-delay: ${i * 150}ms">
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
                        <h3>${name}</h3>
                        <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
                    </div>
                    <div class="footer-links">
                         <a href="#">Privacy</a>
                         <a href="#">Terms</a>
                         <a href="#">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
      // Simple Intersection Observer for scroll animations
      document.addEventListener('DOMContentLoaded', () => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-on-scroll, .card, .hero-content').forEach((el) => {
          observer.observe(el);
          el.classList.add('animate-ready');
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
  const background = colors.find(c => c.role.toLowerCase().includes('background'))?.hex || '#f8fafc';
  const text = colors.find(c => c.role.toLowerCase().includes('text'))?.hex || '#1e293b';
  
  return `
:root {
    --primary: ${primary};
    --primary-light: ${primary}20;
    --secondary: ${secondary};
    --bg: ${background};
    --text: ${text};
    --text-light: ${text}99;
    --white: #ffffff;
    --border: rgba(0,0,0,0.08);
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    --radius: 16px;
}

* { box-sizing: border-box; }

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

/* --- SOPHISTICATED ANIMATIONS --- */

.reveal-on-scroll {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.parallax-bg {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transform: translateZ(0);
}

.hover-lift {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
}

.hover-lift:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover-scale {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.hover-scale:hover {
    transform: scale(1.05);
}

.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
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
}

.hover-underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: var(--primary);
    transition: width 0.3s ease;
}

.hover-underline:hover::after {
    width: 100%;
}

/* --- LAYOUT --- */

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
}

/* Header */
.header {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--border);
    padding: 16px 0;
    transition: all 0.3s ease;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--text);
    letter-spacing: -0.025em;
}

.nav-links {
    display: none;
}

@media (min-width: 768px) {
    .nav-links {
        display: flex;
        gap: 32px;
    }
}

.nav-links a {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s;
}

.nav-links a:hover {
    color: var(--primary);
}

/* Buttons */
.btn {
    padding: 12px 24px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
}

.btn-primary {
    background-color: var(--primary);
    color: var(--white);
    box-shadow: 0 4px 12px ${primary}40;
}

.btn-primary:hover {
    box-shadow: 0 8px 20px ${primary}60;
}

.btn-secondary {
    background-color: var(--white);
    color: var(--text);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
}

.btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
}

.btn-outline:hover {
    background: var(--primary-light);
}

.btn-lg {
    padding: 16px 32px;
    font-size: 1.1rem;
}

.full-width {
    width: 100%;
}

/* Hero */
.hero {
    padding: 160px 0 120px;
    text-align: center;
    overflow: hidden;
    position: relative;
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.03em;
}

@media (min-width: 768px) {
    .hero-title {
        font-size: 4.5rem;
    }
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-light);
    max-width: 650px;
    margin: 0 auto 40px;
    line-height: 1.6;
}

.cta-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
}

@media (min-width: 640px) {
    .cta-group {
        flex-direction: row;
        gap: 24px;
    }
}

/* Sections */
.section {
    padding: 120px 0;
}

.section-header {
    text-align: center;
    margin-bottom: 80px;
}

.badge {
    background: var(--primary-light);
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 8px 16px;
    border-radius: 30px;
    display: inline-block;
    margin-bottom: 16px;
    letter-spacing: 0.05em;
}

.section h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
}

/* Cards */
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .pricing-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.card {
    background: var(--white);
    padding: 40px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
}

.feature-card h4 {
    font-size: 1.5rem;
    margin: 0 0 16px;
    font-weight: 700;
}

.feature-card p {
    color: var(--text-light);
    margin: 0;
    line-height: 1.7;
}

.card-icon {
    width: 64px;
    height: 64px;
    background: var(--primary-light);
    border-radius: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
}

/* Pricing */
.pricing-card {
    display: flex;
    flex-direction: column;
}

.pricing-card.featured {
    border: 2px solid var(--primary);
    box-shadow: var(--shadow-lg);
    transform: scale(1.02);
    z-index: 10;
}

.popular-tag {
    position: absolute;
    top: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 20px;
    text-transform: uppercase;
    box-shadow: 0 4px 10px ${primary}40;
}

.price {
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--text);
    margin: 16px 0 32px;
    letter-spacing: -0.03em;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0 0 40px;
    flex-grow: 1;
}

.feature-list li {
    padding-left: 36px;
    position: relative;
    margin-bottom: 18px;
    color: var(--text-light);
    font-size: 1rem;
}

.feature-list li:before {
    content: "✓";
    position: absolute;
    left: 0;
    width: 24px;
    height: 24px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
}

/* Footer */
.footer {
    padding: 100px 0;
    border-top: 1px solid var(--border);
    margin-top: 100px;
    background: white;
}

.footer-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    text-align: center;
}

@media (min-width: 768px) {
    .footer-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;
    }
}

.footer h3 {
    margin: 0 0 8px;
    font-size: 1.5rem;
}

.footer p {
    color: var(--text-light);
    margin: 0;
    font-size: 0.95rem;
}

.footer-links {
    display: flex;
    gap: 32px;
    justify-content: center;
}

.footer-links a {
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
}

.footer-links a:hover {
    color: var(--primary);
}
`;
};

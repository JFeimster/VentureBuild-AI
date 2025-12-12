import JSZip from 'jszip';
import { ApiResponse, AutomatedBuildPackage, StrategicAdvisoryReport } from '../types';

export const downloadProjectZip = async (data: ApiResponse, projectName: string) => {
  const zip = new JSZip();
  const folderName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const root = zip.folder(folderName);

  if (!root) return;

  // Add Raw Data
  root.file('project_data.json', JSON.stringify(data, null, 2));

  const { assistantOutput } = data;

  if (assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE' && assistantOutput.package) {
    const pkg = assistantOutput.package;
    
    // Generate README
    const readmeContent = generatePackageReadme(pkg, projectName);
    root.file('README.md', readmeContent);

    // Generate HTML Site
    const htmlContent = generateHtmlSite(pkg, projectName);
    root.file('index.html', htmlContent);

    // Generate CSS
    const cssContent = generateCss(pkg);
    root.file('styles.css', cssContent);

    // Generate robots.txt
    root.file('robots.txt', 'User-agent: *\nAllow: /');

  } else if (assistantOutput.outputType === 'STRATEGIC_ADVISORY_REPORT' && assistantOutput.report) {
    const report = assistantOutput.report;
    
    // Generate README for Report
    const readmeContent = generateReportReadme(report, projectName);
    root.file('README.md', readmeContent);
  }

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

const generatePackageReadme = (pkg: AutomatedBuildPackage, name: string): string => {
  return `# ${name} - Venture Build Package

## Value Proposition
${pkg.aiCraftedStrategicCopy.valueProposition}

## Mission Statement
${pkg.aiCraftedStrategicCopy.missionStatement}

## Remix Link
${pkg.coreProjectFile.framerRemixLink}

## Key Features
${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map(f => `- **${f.featureName}**: ${f.benefitCopy}`).join('\n')}

## Pricing
${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map(t => `- **${t.tierName}** (${t.price}): ${t.features.join(', ')}`).join('\n')}

## Brand Colors
${pkg.preliminaryBrandAssetPack.curatedColorPalette.map(c => `- ${c.role}: ${c.hex}`).join('\n')}
`;
};

const generateReportReadme = (report: StrategicAdvisoryReport, name: string): string => {
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

const generateHtmlSite = (pkg: AutomatedBuildPackage, name: string): string => {
  const colors = pkg.preliminaryBrandAssetPack.curatedColorPalette;
  const primaryColor = colors.find(c => c.role.toLowerCase().includes('primary'))?.hex || '#4F46E5';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="logo">${name}</h1>
            <nav>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
            </nav>
            <a href="#" class="btn btn-primary">${pkg.aiCraftedStrategicCopy.callsToAction[0]?.text || 'Get Started'}</a>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>${pkg.aiCraftedStrategicCopy.valueProposition}</h2>
            <p class="subtitle">${pkg.aiCraftedStrategicCopy.missionStatement}</p>
            <div class="cta-group">
                <a href="#" class="btn btn-primary">${pkg.aiCraftedStrategicCopy.callsToAction[1]?.text || 'Start Now'}</a>
            </div>
        </div>
    </section>

    <section id="features" class="features">
        <div class="container">
            <h3>Key Features</h3>
            <div class="grid">
                ${pkg.aiCraftedStrategicCopy.featureBenefitDescriptions.map(f => `
                <div class="card">
                    <h4>${f.featureName}</h4>
                    <p>${f.benefitCopy}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section id="pricing" class="pricing">
        <div class="container">
            <h3>Pricing Plans</h3>
            <div class="grid">
                ${pkg.aiCraftedStrategicCopy.pricingTierBreakdown.map(t => `
                <div class="card pricing-card">
                    <h4>${t.tierName}</h4>
                    <div class="price">${t.price}</div>
                    <ul>
                        ${t.features.map(feat => `<li>${feat}</li>`).join('')}
                    </ul>
                    <a href="#" class="btn btn-outline">Choose ${t.tierName}</a>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
};

const generateCss = (pkg: AutomatedBuildPackage): string => {
  const colors = pkg.preliminaryBrandAssetPack.curatedColorPalette;
  const primary = colors.find(c => c.role.toLowerCase().includes('primary'))?.hex || '#4f46e5';
  const background = colors.find(c => c.role.toLowerCase().includes('background'))?.hex || '#ffffff';
  const text = colors.find(c => c.role.toLowerCase().includes('text'))?.hex || '#1e293b';

  return `
:root {
    --primary: ${primary};
    --bg: ${background};
    --text: ${text};
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    line-height: 1.6;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    padding: 20px 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 0;
}

nav a {
    margin: 0 15px;
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
}

.btn {
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
}

.btn-primary {
    background-color: var(--primary);
    color: white;
}

.btn-outline {
    border: 2px solid var(--primary);
    color: var(--primary);
}

.hero {
    padding: 80px 0;
    text-align: center;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.subtitle {
    font-size: 1.2rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 40px;
}

.features, .pricing {
    padding: 60px 0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.05);
}

.features h3, .pricing h3 {
    text-align: center;
    font-size: 2rem;
}

.pricing-card {
    text-align: center;
}

.price {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    margin: 20px 0;
}

.pricing-card ul {
    list-style: none;
    padding: 0;
    margin-bottom: 30px;
    text-align: left;
}

.pricing-card li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
}

.pricing-card li:before {
    content: "✓";
    color: var(--primary);
    position: absolute;
    left: 0;
}

.footer {
    padding: 40px 0;
    text-align: center;
    color: #64748b;
    border-top: 1px solid rgba(0,0,0,0.1);
}
`;
};
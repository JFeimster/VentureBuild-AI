
import { GoogleGenAI } from "@google/genai";
import { FormData, ApiResponse } from '../types';

const SYSTEM_INSTRUCTION = `You are a specialized B2B Venture Builder and Strategic Design Partner.
Your goal is to take a strategic business brief and turn it into a high-converting digital asset.

**THEME-SPECIFIC STRATEGY:**
- **SAAS_DASHBOARD**: Focus on data density, clean navigation, and "time-to-value".
- **AGENCY**: High-impact visuals, case study layouts, and trust signals.
- **MARKETPLACE**: Grid-heavy layouts, filtering logic, and vendor-buyer trust building.
- **AI_TOOL_CATALOG**: Skimmable cards, clear utility descriptions, and "try now" CTAs.
- **FUNNEL_LANDER**: Single-purpose, zero-distraction layout with high-contrast CTAs.
- **CONTENT_MEMBERSHIP**: Gated content teasers, tier comparisons, and community value.
- **LINK_IN_BIO**: Ultra-mobile-optimized, button-centric, minimalist design.
- **ECOMMERCE**: Product-first visual hierarchy, cart/checkout logic stubs.
- **PORTFOLIO**: Persona-driven, highlighting "The Work" and skills-to-results mapping.

**SIZZLING VENTURE STRATEGY:**
- **Problem Statement**: Deeply analyze the user's pain point. The resulting copy must be empathetic and focus on relief/solution.
- **Target Audience**: Customize the tone and visual recommendations for this specific persona.
- **Unfair Advantage (USP)**: This is the "Moat". It must be the hero of the value proposition.
- **Market Context**: Use 'Competitors' to define a "Blue Ocean" positioning.

**TONE & STYLE RULES:**
- B2B & Bold. ROI-focused. No generic fluff.
- Punchy, skimmable formatting.

**MONETIZATION & PRICING:**
- Incorporate the specific pricing model ($X/mo, etc.) and billing cycle into the generated pricing section.
- For "Tiered" models, clearly articulate the unique value of each tier (Starter, Pro, Expert).

**VISUAL ASSETS:**
- Include a 'generatedImages' array in 'preliminaryBrandAssetPack'.
- Provide 3-4 placeholder image objects with 'section' (Hero, Features, Pricing) and high-quality Unsplash URLs relevant to the project theme.

### Path 1: Generate Code (Goal: GENERATE_CODE)
Output a full React/Next.js or Static HTML codebase in the 'codebase' field.

### Path 2: Template Copywriting (Goal: GENERATE_COPY)
Output high-conversion copy and branding assets in the 'package' field.

### Path 3: Advisory Report (Goal: PROVIDE_ADVISORY)
Output a strategic advisory report in the 'report' field.
`;

export const generateVentureBuild = async (data: FormData): Promise<ApiResponse> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  let goalDescription = "Generate Code/Website";
  if (data.goal === 'PROVIDE_ADVISORY') {
    goalDescription = "Strategic Advisory Report";
  } else if (data.goal === 'GENERATE_COPY') {
    goalDescription = "High-Converting Strategic Copy Package";
  }

  const prompt = JSON.stringify({
    task: "Generate Venture Build Output",
    projectBrief: {
      productOrService: data.projectName,
      brandName: data.brandName,
      brandVoice: data.brandVoice,
      strategy: {
        problem: data.problemStatement,
        solution: data.coreConcept,
        audience: data.targetAudience,
        unfairAdvantage: data.unfairAdvantage,
        competitors: data.competitors
      },
      execution: {
        features: data.keyFeatures,
        cta: data.primaryCTA,
        techStack: data.techStack,
        theme: data.theme
      },
      monetization: {
        model: data.monetization,
        type: data.subscriptionType,
        pricing: data.subscriptionType === 'SINGLE' ? data.price : data.tierPrices,
        cycle: data.billingCycle
      },
      assistantsGoal: goalDescription
    }
  }, null, 2);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response received from AI.");
  return JSON.parse(text) as ApiResponse;
};

export const improveCoreConcept = async (content: string, projectName: string, fieldLabel: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an elite B2B Copywriter. 
  Product: ${projectName}.
  Field to improve: ${fieldLabel}.
  Current text: "${content}".
  
  Optimize this text to be more compelling, outcome-focused, and professional. 
  Return only the polished text, no conversational filler.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text?.trim() || content;
};

export const generateProjectBrief = async (seed?: string): Promise<Partial<FormData>> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a unique, high-potential tech startup concept.
  ${seed ? `Base it on: "${seed}"` : ``}

  Output JSON with:
  - projectName, brandName, brandVoice
  - problemStatement (the core pain)
  - coreConcept (the unique solution)
  - targetAudience (specific persona)
  - unfairAdvantage (moat)
  - competitors (2-3 real or generic examples)
  - keyFeatures (array of 3-4 features)
  - primaryCTA (strong command)`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text || "{}");
};

export const getChatSession = (context?: string) => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  let systemPrompt = `You are the Venture AI Partner. You help entrepreneurs refine business ideas, marketing strategies, and technical architectures. 

**YOUR OPERATING PRINCIPLES:**
1. **Be Strategic**: Don't just answer questions; suggest "Blue Ocean" opportunities.
2. **Be Actionable**: Provide specific technical steps or copywriting hooks.
3. **Be Concise**: Entrepreneurs are busy. Use bolding and bullets.
4. **Contextual Awareness**: If the user has a generated project, use its specific features and moat to give advice.

**GOAL**: Guide the user from an idea to a high-ROI market launch.`;
  
  if (context) {
    systemPrompt += `\n\nCURRENT PROJECT CONTEXT:\n${context}\n\nThis is the live venture data. Reference it to provide hyper-personalized advice.`;
  }

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemPrompt,
      thinkingConfig: { thinkingBudget: 12000 }
    },
  });
};

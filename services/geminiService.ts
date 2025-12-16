
import { GoogleGenAI } from "@google/genai";
import { FormData, ApiResponse } from '../types';

const SYSTEM_INSTRUCTION = `You are a specialized B2B Venture Builder and Strategic Design Partner.
Your goal is to take a raw concept and turn it into a high-converting digital asset with a specific "Theme".

**TONE & STYLE RULES:**
*   **B2B & Bold:** No fluff. Talk to founders, agency owners, and investors.
*   **Specific:** Focus on capital, cash flow, approvals, and automation.
*   **Punchy:** Use short headlines and skimmable bullet lists.
*   **Capital Efficient:** Assume the user is funding-constrained and time-poor.

You will receive a structured JSON input. Analyze 'goal', 'templateUrl', 'techStack', etc.

### Path 1: Generate Code (Goal: GENERATE_CODE)

Your output must be a valid JSON object containing a "Site Spec", a "Section-by-Section Wireframe", and the "Code Skeleton".

**Output Structure:**
\`\`\`json
{
  "assistantOutput": {
    "outputType": "GENERATED_CODEBASE",
    "codebase": {
      "techStack": "STATIC_WEBSITE" | "NEXT_JS" | "EMBED_WIDGET" | "TEMPLATE_REPLICA",
      "theme": "AGENCY" | "SAAS_DASHBOARD" | ...,
      "siteSpec": { ... },
      "wireframe": [ ... ],
      "setupInstructions": "Markdown string...",
      "files": [ { "path": "...", "content": "..." } ],
      "previewHtml": "..."
    }
  }
}
\`\`\`

**Tech Stack Specifics:**

*   **STATIC_WEBSITE / NEXT_JS:** Follow standard high-quality design patterns.
*   **TEMPLATE_REPLICA:**
    *   **Context:** The user provided a \`templateUrl\`.
    *   **Task:** Generate a codebase (HTML/CSS) that *mimics the visual structure* of that template as best as you can infer from its URL type (e.g. if it's a SaaS template, build a SaaS layout).
    *   **Content:** Fill it with the specific copy relevant to the user's project concept, NOT dummy text.

---

### Path 2: Template Copywriting (Goal: GENERATE_COPY)

**Context:** The user has a template (Framer, Webflow, etc.) and wants *text/copy* to fill it, but NOT the code.
**Task:** Analyze the likely sections of the provided \`templateUrl\` and generate strategic content for them.

**Output Structure:**
\`\`\`json
{
  "assistantOutput": {
    "outputType": "AUTOMATED_BUILD_PACKAGE",
    "package": {
      "coreProjectFile": {
        "templateLink": "The URL provided by user...",
        "structuredContentJson": {
          "hero": { "headline": "...", "subheadline": "..." },
          "features": [ ... ],
          // ... other sections inferred from typical templates
        }
      },
      "aiCraftedStrategicCopy": {
         // Standard fields: valueProposition, featureBenefitDescriptions, etc.
      },
      "preliminaryBrandAssetPack": { ... }
    }
  }
}
\`\`\`

---

### Path 3: Advisory Report (Goal: PROVIDE_ADVISORY)

Output \`STRATEGIC_ADVISORY_REPORT\`.

---

### Constraints:
*   **JSON Only:** Output must be a valid JSON object.
*   **No Placeholders:** Write actual, strategic copy.
`;

export const generateVentureBuild = async (data: FormData): Promise<ApiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API Key is missing. Please add API_KEY to your environment variables (e.g. Vercel Project Settings).");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Refine the goal description passed to the AI
  let goalDescription = "Generate Code/Website";
  if (data.goal === 'PROVIDE_ADVISORY') {
    goalDescription = "Provide an Advisory Report";
  } else if (data.goal === 'GENERATE_COPY') {
    goalDescription = `Generate High-Converting Copy for the provided template URL: ${data.templateUrl}`;
  } else if (data.techStack === 'TEMPLATE_REPLICA') {
    goalDescription = `Generate a Code Replica mimicking the structure of: ${data.templateUrl}`;
  } else {
    goalDescription = `Generate a ${data.techStack} codebase for a ${data.theme} project`;
  }

  const prompt = JSON.stringify({
    task: "Generate Venture Build Output",
    projectBrief: {
      projectName: data.projectName,
      coreConcept: data.coreConcept,
      brandName: data.brandName,
      brandVoice: data.brandVoice,
      keyFeatures: data.keyFeatures,
      primaryCTA: data.primaryCTA,
      templateUrl: data.templateUrl,
      techStack: data.techStack,
      theme: data.theme,
      assistantsGoal: goalDescription
    }
  }, null, 2);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    return JSON.parse(text) as ApiResponse;
  } catch (error: any) {
    console.error("Error generating venture build:", error);
    // Improve error messaging for common issues
    if (error.message?.includes('API_KEY')) throw error;
    if (error.status === 403) throw new Error("API Key invalid or permissions denied.");
    if (error.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    throw error;
  }
};

export const generateProjectBrief = async (seedConcept?: string): Promise<Partial<FormData>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API Key is missing. Please add API_KEY to your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a creative venture builder helper.
  ${seedConcept ? `The user has this initial concept: "${seedConcept}". Expand this into a full project brief.` : `Generate a unique, innovative, and viable tech startup concept.`}

  Output a JSON object with the following fields to help the user fill out their project brief form:
  - projectName: A catchy name for the project.
  - brandName: A short, memorable brand name (often same as project name).
  - coreConcept: A compelling 2-3 sentence value proposition and description.
  - brandVoice: One of ['Professional & Authoritative', 'Friendly & Approachable', 'Playful & Energetic', 'Minimalist & Clean', 'Luxury & Exclusive', 'Tech-Forward & Innovative'].
  - keyFeatures: An array of 3-5 distinct feature names.
  - primaryCTA: A strong call to action text (e.g., "Start Free Trial", "Get Early Access").

  Do not output markdown code blocks. Just the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    return JSON.parse(text) as Partial<FormData>;
  } catch (error: any) {
    console.error("Error generating project brief:", error);
    if (error.message?.includes('API_KEY')) throw error;
    if (error.status === 403) throw new Error("API Key invalid or permissions denied.");
    if (error.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    throw error;
  }
};

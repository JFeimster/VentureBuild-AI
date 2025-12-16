
export type OutputType = 'GENERATE_CODE' | 'PROVIDE_ADVISORY' | 'GENERATE_COPY' | 'GENERATE_REPLICA';
export type TechStack = 'STATIC_WEBSITE' | 'NEXT_JS' | 'EMBED_WIDGET' | 'TEMPLATE_REPLICA';
export type ProjectTheme = 
  | 'AGENCY' 
  | 'SAAS_DASHBOARD' 
  | 'MARKETPLACE' 
  | 'AI_TOOL_CATALOG' 
  | 'FUNNEL_LANDER' 
  | 'CONTENT_MEMBERSHIP' 
  | 'LINK_IN_BIO' 
  | 'ECOMMERCE'
  | 'PORTFOLIO';

export interface FormData {
  projectName: string;
  coreConcept: string;
  brandName: string;
  brandVoice: string;
  keyFeatures: string[];
  primaryCTA: string;
  templateUrl: string; // Generalized from framerTemplateUrl
  techStack: TechStack;
  theme: ProjectTheme;
  goal: OutputType;
}

// --- Automated Build Package Types (Template Content) ---

export interface ContentSection {
  headline?: string;
  subheadline?: string;
  name?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface FeatureDescription {
  featureName: string;
  benefitCopy: string;
}

export interface CallToAction {
  location: string;
  text: string;
}

export interface SocialProof {
  quote: string;
  authorName: string;
  authorRole: string;
}

export interface PricingTier {
  tierName: string;
  price: string;
  features: string[];
}

export interface ColorAsset {
  role: string; // e.g., "Primary", "Background", "Text"
  hex: string;
}

export interface FontPairing {
  heading: string;
  body: string;
  justification: string;
}

export interface ImageBrief {
  section: string;
  brief: string;
}

export interface AutomatedBuildPackage {
  coreProjectFile: {
    templateLink: string; // Generalized
    structuredContentJson: Record<string, ContentSection | ContentSection[]>;
  };
  aiCraftedStrategicCopy: {
    valueProposition: string;
    featureBenefitDescriptions: FeatureDescription[];
    callsToAction: CallToAction[];
    socialProofTemplates: SocialProof[];
    pricingTierBreakdown: PricingTier[];
    missionStatement: string;
  };
  preliminaryBrandAssetPack: {
    curatedColorPalette: ColorAsset[];
    fontRecommendations: FontPairing[];
    imageAndIconBriefs: ImageBrief[];
  };
}

// --- Generated Codebase Types (Static/Next/Widget) ---

export interface SiteSpec {
  positioning: string;
  targetAudience: string;
  mainPromise: string;
}

export interface WireframeSection {
  sectionName: string;
  purpose: string;
  headline: string;
  subheadOptions: string[];
  bulletPoints: string[];
  suggestedCTA: string;
}

export interface CodeFile {
  path: string; // e.g., "index.html", "styles/main.css"
  content: string;
}

export interface GeneratedCodebase {
  techStack: TechStack;
  theme: ProjectTheme;
  siteSpec?: SiteSpec;
  wireframe?: WireframeSection[];
  files: CodeFile[];
  setupInstructions: string;
  previewHtml?: string; // For immediate rendering if applicable (usually index.html content)
}

// --- Strategic Advisory Report Types ---

export interface SectionStrategy {
  sectionName: string;
  purposeAndGoalAnalysis: string;
  personalizedCopywritingPrompts: string[];
  abTestingSuggestions: string[];
}

export interface Integration {
  tool: string;
  purpose: string;
  implementationGuidance: string;
  codeSnippet?: string;
}

export interface BrandingGuide {
  visualEnhancementTips: string;
  sectionOptimization: string;
  cmsAdaptationPlan: string;
}

export interface SeoMetaTag {
  page: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ImageAltText {
  imageLocation: string;
  altText: string;
}

export interface StrategicAdvisoryReport {
  sectionBySectionContentStrategy: SectionStrategy[];
  integrationAndTechStackBlueprint: {
    essentialIntegrations: Integration[];
  };
  customizationAndBrandingGuide: BrandingGuide;
  seoAndPreLaunchChecklist: {
    generatedSeoMetatags: SeoMetaTag[];
    imageAltTextSuggestions: ImageAltText[];
    technicalGoLiveChecklist: string[];
  };
}

// --- Union Type for API Response ---

export interface AssistantOutput {
  outputType: 'AUTOMATED_BUILD_PACKAGE' | 'STRATEGIC_ADVISORY_REPORT' | 'GENERATED_CODEBASE';
  package?: AutomatedBuildPackage; // Template Content support
  codebase?: GeneratedCodebase;   // Code support
  report?: StrategicAdvisoryReport;
}

export interface ApiResponse {
  assistantOutput: AssistantOutput;
}

export interface SavedProject {
  id: string;
  name: string;
  date: string;
  data: ApiResponse;
  type: OutputType;
}

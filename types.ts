
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

export type MonetizationType = 'FREE' | 'FREEMIUM' | 'SUBSCRIPTION';
export type SubscriptionType = 'SINGLE' | 'TIERED';
export type BillingCycle = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ONE-TIME';

export interface FormData {
  projectName: string;
  brandName: string;
  brandVoice: string;
  // Strategic Venture Fields
  problemStatement: string;
  coreConcept: string;
  targetAudience: string;
  unfairAdvantage: string;
  competitors: string;
  // Features & Action
  keyFeatures: string[];
  primaryCTA: string;
  templateUrl: string;
  techStack: TechStack;
  theme: ProjectTheme;
  goal: OutputType;
  // Monetization
  monetization: MonetizationType;
  subscriptionType: SubscriptionType;
  price: string;
  tierPrices: {
    starter: string;
    pro: string;
    expert: string;
  };
  billingCycle: BillingCycle;
}

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
  role: string;
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

export interface GeneratedImage {
  section: string;
  imageUrl: string;
}

export interface LandingPageSection {
  sectionName: string;
  goal: string;
  headline: string;
  copy: string;
  visualSuggestion: string;
}

export interface AutomatedBuildPackage {
  coreProjectFile: {
    templateLink: string;
    structuredContentJson: Record<string, ContentSection | ContentSection[]>;
  };
  aiCraftedStrategicCopy: {
    valueProposition: string;
    featureBenefitDescriptions: FeatureDescription[];
    callsToAction: CallToAction[];
    socialProofTemplates: SocialProof[];
    pricingTierBreakdown: PricingTier[];
    missionStatement: string;
    // New fields for deep strategy
    strategicProblem?: string;
    targetPersona?: string;
    competitiveMoat?: string;
    landingPageWireframe: LandingPageSection[];
  };
  preliminaryBrandAssetPack: {
    curatedColorPalette: ColorAsset[];
    fontRecommendations: FontPairing[];
    imageAndIconBriefs: ImageBrief[];
    generatedImages: GeneratedImage[];
  };
}

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
  path: string;
  content: string;
}

export interface GeneratedCodebase {
  techStack: TechStack;
  theme: ProjectTheme;
  siteSpec?: SiteSpec;
  wireframe?: WireframeSection[];
  files: CodeFile[];
  setupInstructions: string;
  previewHtml?: string;
}

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

export interface AssistantOutput {
  outputType: 'AUTOMATED_BUILD_PACKAGE' | 'STRATEGIC_ADVISORY_REPORT' | 'GENERATED_CODEBASE';
  package?: AutomatedBuildPackage;
  codebase?: GeneratedCodebase;
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

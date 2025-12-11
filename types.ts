export type OutputType = 'GENERATE_REPLICA' | 'PROVIDE_ADVISORY';

export interface FormData {
  projectName: string;
  coreConcept: string;
  brandName: string;
  brandVoice: string;
  keyFeatures: string[];
  primaryCTA: string;
  framerTemplateUrl: string;
  goal: OutputType;
}

// --- Automated Build Package Types ---

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
    framerRemixLink: string;
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
  outputType: 'AUTOMATED_BUILD_PACKAGE' | 'STRATEGIC_ADVISORY_REPORT';
  package?: AutomatedBuildPackage;
  report?: StrategicAdvisoryReport;
}

export interface ApiResponse {
  assistantOutput: AssistantOutput;
}
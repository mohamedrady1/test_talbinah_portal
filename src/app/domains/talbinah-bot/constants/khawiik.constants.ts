import { InstructionCard } from "../models";

/**
 * Instruction cards data
 */
export const INSTRUCTION_CARDS: readonly InstructionCard[] = [
    {
        id: 'medical-disclaimer',
        titleKey: 'talbinah_bot_does_not_provide_direct_medical_treatment',
        subtitleKey: 'assistant_provides_support_but_not_replace_professional_care'
    },
    {
        id: 'emergency-disclaimer',
        titleKey: 'talbinah_bot_not_for_emergencies_or_critical_cases',
        subtitleKey: 'contact_emergency_if_experiencing_crisis_or_self_harm_thoughts'
    },
    {
        id: 'age-restriction',
        titleKey: 'user_ages',
        subtitleKey: 'service_for_18_and_above_with_respectful_communication'
    },
    {
        id: 'privacy-safety',
        titleKey: 'privacy_and_confidentiality',
        subtitleKey: 'conversations_private_and_secure_with_industry_encryption'
    },
    {
        id: 'professional-conduct',
        titleKey: 'service_limitations',
        subtitleKey: 'ai_support_has_limits_consult_qualified_professional_for_complex_issues'
    }
] as const;

/**
 * Translation keys for Khawiik components
 */
export const KHAWIIK_KEYS = {
    // Instructions component
    INSTRUCTIONS: {
        TITLE: 'before_you_start',
        SUBTITLE: 'read_guidelines_for_best_psychological_support_experience',
        CONTINUE: 'continue'
    },
    // Start session component
    START: {
        CARD_LINE_1: 'peace_of_mind_starts_here',
        CARD_LINE_2: 'your_private_space',
        CENTER_CARD: 'write_inside_step_by_step',
        PROMPT: {
            TITLE: 'whats_on_your_mind',
            SUBTITLE: 'write_anything_on_mind',
            PLACEHOLDER: 'thinking_lately_about'
        },
        CONTINUE: 'continue'
    }
} as const;

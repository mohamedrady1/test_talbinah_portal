import { InstructionCard } from "../models";

/**
 * Instruction cards data
 */
export const INSTRUCTION_CARDS: readonly InstructionCard[] = [
    {
        id: 'medical-disclaimer',
        titleKey: 'khawiik.instructions.card1.title',
        subtitleKey: 'khawiik.instructions.card1.subtitle'
    },
    {
        id: 'emergency-disclaimer',
        titleKey: 'khawiik.instructions.card2.title',
        subtitleKey: 'khawiik.instructions.card2.subtitle'
    },
    {
        id: 'age-restriction',
        titleKey: 'khawiik.instructions.card3.title',
        subtitleKey: 'khawiik.instructions.card3.subtitle'
    },
    {
        id: 'privacy-safety',
        titleKey: 'khawiik.instructions.card4.title',
        subtitleKey: 'khawiik.instructions.card4.subtitle'
    },
    {
        id: 'professional-conduct',
        titleKey: 'khawiik.instructions.card5.title',
        subtitleKey: 'khawiik.instructions.card5.subtitle'
    }
] as const;

/**
 * Translation keys for Khawiik components
 */
export const KHAWIIK_KEYS = {
    // Instructions component
    INSTRUCTIONS: {
        TITLE: 'khawiik.instructions.title',
        SUBTITLE: 'khawiik.instructions.subtitle',
        CONTINUE: 'khawiik.instructions.continue'
    },
    // Start session component
    START: {
        CARD_LINE_1: 'khawiik.start.cardLine1',
        CARD_LINE_2: 'khawiik.start.cardLine2',
        CENTER_CARD: 'khawiik.start.centerCard',
        PROMPT: {
            TITLE: 'khawiik.start.prompt.title',
            SUBTITLE: 'khawiik.start.prompt.subtitle',
            PLACEHOLDER: 'khawiik.start.prompt.placeholder'
        },
        CONTINUE: 'khawiik.start.continue'
    }
} as const;

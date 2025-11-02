export type Icon = string;

export interface KhawiikWelcomeItem {
  title: string;
  subtitle: string;
  icon: Icon;
}

export interface KhawiikWelcomePage {
  labelTitle: string;
  title: string;
  list: KhawiikWelcomeItem[];
}

export interface KhawiikHeader {
  title: string;
  subtitle: string;
}

export interface KhawiikContent {
  header: KhawiikHeader;
  welcomePage: KhawiikWelcomePage;
}

export const KHAWIIK_WELCOME_FEATURES: KhawiikContent = {
  header: {
    title: 'home_card_khawiik_title',
    subtitle: 'home_card_khawiik_description'
  },
  welcomePage: {
    labelTitle: 'welcome_to_talbinah2',
    title: 'start_journey_talbinah',
    list: [
      {
        title: 'built_on_science_designed_for_comfort',
        subtitle: 'simplified_psychological_experience_human_touch',
        icon: 'images/khawiik/book.png'
      },
      {
        title: 'express_without_judgments',
        subtitle: 'speak_freely_without_judgment',
        icon: 'images/khawiik/award.png'
      }
    ]
  }
};

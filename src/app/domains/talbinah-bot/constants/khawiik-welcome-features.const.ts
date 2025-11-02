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
    title: 'khawiik.header.title',
    subtitle: 'khawiik.header.subtitle'
  },
  welcomePage: {
    labelTitle: 'khawiik.welcomePage.labelTitle',
    title: 'khawiik.welcomePage.title',
    list: [
      {
        title: 'khawiik.welcomePage.list.item1Title',
        subtitle: 'khawiik.welcomePage.list.item1Subtitle',
        icon: 'images/khawiik/book.png'
      },
      {
        title: 'khawiik.welcomePage.list.item2Title',
        subtitle: 'khawiik.welcomePage.list.item2Subtitle',
        icon: 'images/khawiik/award.png'
      }
    ]
  }
};

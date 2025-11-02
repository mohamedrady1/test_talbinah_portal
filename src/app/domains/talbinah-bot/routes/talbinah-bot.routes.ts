import { KhawiikBotRouteData, KhawiikBotRoutesEnum } from '../constants';
import { Route } from '@angular/router';

export const TALBINAH_BOT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>

      import('./../containers/khawiik-bot-layout').then(
        m => m.KhawiikBotLayoutComponent
      ),

    // import('./../containers/talbinah-bot-layout').then(
    //   m => m.TalbinahBotLayoutComponent
    // ),

    data: KhawiikBotRouteData.KHAWIIK_MAIN_PAGE,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./../components/khawiik-welcome/khawiik-welcome.component').then(m => m.KhawiikWelcomeComponent),
        data: { page: KhawiikBotRouteData.KHAWIIK_MAIN_PAGE }
      },
      {
        path: KhawiikBotRoutesEnum.TEXT_CHAT,
        loadComponent: () =>
          import('./../components/khawiik-text-chat/khawiik-text-chat.component').then(m => m.KhawiikTextChatComponent),
        data: KhawiikBotRouteData.TextChat
      },
      {
        path: KhawiikBotRoutesEnum.VOICE_CHAT,
        loadComponent: () =>
          import('./../components/khawiik-voice-chat/khawiik-voice-chat.component').then(m => m.KhawiikVoiceChatComponent),
        data: KhawiikBotRouteData.VoiceChat
      },
      {
        path: '**',
        redirectTo: KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE,
      }
    ]
  }
];


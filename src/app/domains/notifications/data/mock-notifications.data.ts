import { INotificationsListingResponseDto, IPreferredMsgChannelResponseDto } from "../dtos";

export const mockNotificationsListing: INotificationsListingResponseDto = {
  status: true,
  message: "Mock notifications fetched successfully",
  data: {
    current_page: 1,
    data: [
      {
        id: 66742,
        title: "تم الإعجاب بمنشورك",
        body: "Eslam Afify قام بالإعجاب بمنشورك",
        action: null,
        page: "postDetails",
        pageID: "120",
        link: "/api/community/site/post/120",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:59:34.000000Z"
      },
      {
        id: 66739,
        title: "تم الإعجاب بمنشورك",
        body: "Eslam Afify قام بالإعجاب بمنشورك",
        action: null,
        page: "postDetails",
        pageID: "112",
        link: "/api/community/site/post/112",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:58:32.000000Z"
      },
      {
        id: 66738,
        title: "تم حفظ منشورك",
        body: "Eslam Afify قام بحفظ منشورك",
        action: null,
        page: "postDetails",
        pageID: "114",
        link: "/api/community/site/post/114",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:58:29.000000Z"
      },
      {
        id: 66737,
        title: "تعليق جديد على منشورك",
        body: "Eslam Afify قام بالتعليق على منشورك",
        action: null,
        page: "postDetails",
        pageID: "114",
        link: "/api/community/site/post/114",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:58:24.000000Z"
      },
      {
        id: 66734,
        title: "تعليق جديد على منشورك",
        body: "عمر 206 قام بالتعليق على منشورك",
        action: null,
        page: "postDetails",
        pageID: "118",
        link: "/api/community/site/post/118",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:43:11.000000Z"
      },
      {
        id: 66733,
        title: "تم متابعتك",
        body: "عمر 206 قام بمتابعتك",
        action: null,
        page: "user_followed",
        pageID: "2207",
        link: "/user/2207",
        received: 0,
        type: "user_followed",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T11:38:25.000000Z"
      },
      {
        id: 66729,
        title: "تم حفظ منشورك",
        body: "Eslam Afify قام بحفظ منشورك",
        action: null,
        page: "post",
        pageID: "118",
        link: "/api/community/site/post/118",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T08:23:30.000000Z"
      },
      {
        id: 66728,
        title: "تم الإعجاب بمنشورك",
        body: "Eslam Afify قام بالإعجاب بمنشورك",
        action: null,
        page: "post",
        pageID: "118",
        link: "/api/community/site/post/118",
        received: 0,
        type: "community",
        icon: "https://redesign.talbinah.net/notifications/general.png",
        is_read: 0,
        created_at: "2025-06-17T08:23:29.000000Z"
      }
    ],
    first_page_url: null,
    from: 1,
    last_page: 1,
    last_page_url: null,
    links: [],
    next_page_url: null,
    path: "/api/notifications",
    per_page: 10,
    prev_page_url: null,
    to: 8,
    total: 8
  }
};

export const mockPreferredMsgChannelResponse: IPreferredMsgChannelResponseDto = {
  status: true,
  message: null,
  data: {
    id: 12523,
    main_lang: 'ar',
    full_name: 'إسلام عفيفي بركات',
    nick_name: 'إسلام عفيفي بركات',
    phone_no: '1016221599',
    original_gender: 'ذكر',
    gender: 0,
    birth_date: '1996-10-10',
    country: {
      id: 63,
      main_lang: 'ar',
      name: 'مصر',
      flag: 'https://ipdata.co/flags/eg.png',
      code: 'EG',
      phone_code: '+20',
      active: 1,
      original_active: 'فعال'
    },
    email: 'eslamafifybarakat@gmail.com',
    active: 1,
    preferred_msg_channel: 'both',
    created_at: '2025-07-14T07:21:25.000000Z'
  }
};

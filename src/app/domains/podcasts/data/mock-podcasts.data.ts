import { IFavoritePodcastsListingResponseDto, IPodcastCategoriesListingResponseDto, IPodcastsListingResponseDto, IRandomPodcastsListingResponseDto, IRecommendedPodcastsListingResponseDto, ITogglePodcastFavoriteResponseDto } from "../dtos";

export const mockPodcastsListingResponse: IPodcastsListingResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "podcasts": [
      {
        "id": 3,
        "title": "لأجل نفسك لا لأجل غيرك 3",
        "description": "الوصف عبارة عما دل على الذات باعتبار معنى هو المقصود من جوهر حروفه، أي يدل على الذات بصفة، كأحمر فإنه بجوهر حروفه يدل على معنى مقصود",
        "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/9EHL1zX8DNUm6qoT438FrXHxn9NNARIBx8O8y5Zx.png",
        "background_color": "#ebf5fa",
        "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/uln0Y58vP4il02jHPOBbjgw0PSQ4H7x5GrPZZk5W.mp3",
        "file_type": "audio",
        "link_type": "file",
        "duration": "02:18",
        "type": "free",
        "visit_count": 92,
        "status": 1,
        "created_at": "2024-07-30T16:56:41.000000Z",
        "updated_at": "2025-05-05T12:23:17.000000Z",
        "podcast_category": null,
        "promo": null,
        "start_duration_from": null,
        "is_bookmarked": true,
        "doctor_name": "د.محمد الغصن"
      },
      {
        "id": 2,
        "title": "لأجل نفسك لا لأجل غيرك 2",
        "description": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
        "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/wfIKtuuqxIeD3F7oMRTvR6AsLudwWqlhv2toaZG2.png",
        "background_color": "#f5f9ec",
        "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/gjnG09o6l2tBv1XsXWBt6i7eR2f0h19vY0oVu2tQ.mp3",
        "file_type": "audio",
        "link_type": "file",
        "duration": "01:12",
        "type": "free",
        "visit_count": 53,
        "status": 1,
        "created_at": "2024-07-30T16:51:38.000000Z",
        "updated_at": "2025-05-06T08:47:57.000000Z",
        "podcast_category": null,
        "promo": null,
        "start_duration_from": null,
        "is_bookmarked": true,
        "doctor_name": "د.محمد الغصن"
      },
      {
        "id": 1,
        "title": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
        "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
        "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/cWIrPxX1k7evzhHXv87yCV34Aq4hUuZiLYZktFic.png",
        "background_color": "#fff1f7",
        "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
        "file_type": "audio",
        "link_type": "file",
        "duration": "01:27",
        "type": "free",
        "visit_count": 45,
        "status": 1,
        "created_at": "2024-07-30T16:48:55.000000Z",
        "updated_at": "2025-05-05T12:23:34.000000Z",
        "podcast_category": null,
        "promo": null,
        "start_duration_from": null,
        "is_bookmarked": true,
        "doctor_name": "د.محمد الغصن"
      }
    ],
    "most_visit": {
      "id": 3,
      "title": "لأجل نفسك لا لأجل غيرك 3",
      "description": "الوصف عبارة عما دل على الذات باعتبار معنى هو المقصود من جوهر حروفه، أي يدل على الذات بصفة، كأحمر فإنه بجوهر حروفه يدل على معنى مقصود",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/9EHL1zX8DNUm6qoT438FrXHxn9NNARIBx8O8y5Zx.png",
      "background_color": "#ebf5fa",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/uln0Y58vP4il02jHPOBbjgw0PSQ4H7x5GrPZZk5W.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "02:18",
      "type": "free",
      "visit_count": 92,
      "status": 1,
      "created_at": "2024-07-30T16:56:41.000000Z",
      "updated_at": "2025-05-05T12:23:17.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د.محمد الغصن"
    }
  }
};

export const mockFavoritePodcastsListingResponse: IFavoritePodcastsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "title": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
      "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/cWIrPxX1k7evzhHXv87yCV34Aq4hUuZiLYZktFic.png",
      "background_color": "#fff1f7",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "01:27",
      "type": "free",
      "visit_count": 100,
      "status": 1,
      "created_at": "2024-07-30T19:48:55.000000Z",
      "updated_at": "2024-12-05T17:12:39.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": true,
      "doctor_name": "د.محمد الغصن"
    }
  ]

};

export const mockRandomPodcastsListingResponse: IRandomPodcastsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 3,
      "title": "لأجل نفسك لا لأجل غيرك 3",
      "description": "الوصف عبارة عما دل على الذات باعتبار معنى هو المقصود من جوهر حروفه، أي يدل على الذات بصفة، كأحمر فإنه بجوهر حروفه يدل على معنى مقصود",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/9EHL1zX8DNUm6qoT438FrXHxn9NNARIBx8O8y5Zx.png",
      "background_color": "#ebf5fa",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/uln0Y58vP4il02jHPOBbjgw0PSQ4H7x5GrPZZk5W.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "02:18",
      "type": "free",
      "visit_count": 92,
      "status": 1,
      "created_at": "2024-07-30T16:56:41.000000Z",
      "updated_at": "2025-05-05T12:23:17.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د. إسلام عفيفي"
    },
    {
      "id": 1,
      "title": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
      "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/cWIrPxX1k7evzhHXv87yCV34Aq4hUuZiLYZktFic.png",
      "background_color": "#fff1f7",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "01:27",
      "type": "free",
      "visit_count": 46,
      "status": 1,
      "created_at": "2024-07-30T16:48:55.000000Z",
      "updated_at": "2025-05-29T10:45:26.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د. إسلام عفيفي"
    },
    {
      "id": 2,
      "title": "لأجل نفسك لا لأجل غيرك 2",
      "description": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/wfIKtuuqxIeD3F7oMRTvR6AsLudwWqlhv2toaZG2.png",
      "background_color": "#f5f9ec",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/gjnG09o6l2tBv1XsXWBt6i7eR2f0h19vY0oVu2tQ.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "01:12",
      "type": "free",
      "visit_count": 53,
      "status": 1,
      "created_at": "2024-07-30T16:51:38.000000Z",
      "updated_at": "2025-05-06T08:47:57.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د. إسلام عفيفي"
    }
  ]

};

export const mockRecommendedPodcastsListingResponse: IRecommendedPodcastsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "title": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
      "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/cWIrPxX1k7evzhHXv87yCV34Aq4hUuZiLYZktFic.png",
      "background_color": "#fff1f7",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "01:27",
      "type": "free",
      "visit_count": 46,
      "status": 1,
      "created_at": "2024-07-30T16:48:55.000000Z",
      "updated_at": "2025-05-29T10:45:26.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د. إسلام عفيفي"
    },
    {
      "id": 2,
      "title": "لأجل نفسك لا لأجل غيرك 2",
      "description": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
      "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/wfIKtuuqxIeD3F7oMRTvR6AsLudwWqlhv2toaZG2.png",
      "background_color": "#f5f9ec",
      "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/gjnG09o6l2tBv1XsXWBt6i7eR2f0h19vY0oVu2tQ.mp3",
      "file_type": "audio",
      "link_type": "file",
      "duration": "01:12",
      "type": "free",
      "visit_count": 53,
      "status": 1,
      "created_at": "2024-07-30T16:51:38.000000Z",
      "updated_at": "2025-05-06T08:47:57.000000Z",
      "podcast_category": null,
      "promo": null,
      "start_duration_from": null,
      "is_bookmarked": false,
      "doctor_name": "د. إسلام عفيفي"
    }
  ]

};

export const mockPodcastCategoriesResponse: IPodcastCategoriesListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "name": "العادات",
      "color": "#000000",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/nUq3DKDekYKIBR1g9NqFcVzSnthxfvpeW6Iryn3B.png",
      "created_at": "2024-07-30T15:49:47.000000Z",
      "updated_at": "2024-07-30T15:49:47.000000Z"
    },
    {
      "id": 2,
      "name": "الصحة",
      "color": "#000000",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/tVvevRbC8opd3OKoEH05PLeovQkBXw8YnsxNRTbW.png",
      "created_at": "2024-07-30T15:50:16.000000Z",
      "updated_at": "2024-07-30T15:50:16.000000Z"
    },
    {
      "id": 3,
      "name": "الذات",
      "color": "#000000",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/AkIdQ2iXVJN2bqUgP7uW01cvAiHhq7GOcuBYuQIi.png",
      "created_at": "2024-07-30T15:50:36.000000Z",
      "updated_at": "2024-07-30T15:50:36.000000Z"
    },
    {
      "id": 4,
      "name": "التعليم",
      "color": "#000000",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/DwEPcs0oqvIOTOuDzPyryDzdOzZkpJskEZ5x6rBH.png",
      "created_at": "2024-07-30T15:50:55.000000Z",
      "updated_at": "2024-07-30T15:50:55.000000Z"
    }
  ]
};


export const mockPodcastFavoriteToggleResponse: ITogglePodcastFavoriteResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 3,
    "title": "لأجل نفسك لا لأجل غيرك 3",
    "description": "الوصف عبارة عما دل على الذات باعتبار معنى هو المقصود من جوهر حروفه، أي يدل على الذات بصفة، كأحمر فإنه بجوهر حروفه يدل على معنى مقصود",
    "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/9EHL1zX8DNUm6qoT438FrXHxn9NNARIBx8O8y5Zx.png",
    "background_color": "#ebf5fa",
    "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/uln0Y58vP4il02jHPOBbjgw0PSQ4H7x5GrPZZk5W.mp3",
    "file_type": "audio",
    "link_type": "file",
    "duration": "02:18",
    "type": "free",
    "visit_count": 92,
    "status": 1,
    "created_at": "2024-07-30T16:56:41.000000Z",
    "updated_at": "2025-05-05T12:23:17.000000Z",
    "podcast_category": null,
    "promo": null,
    "start_duration_from": null,
    "is_bookmarked": true,
    "doctor_name": "د.محمد الغصن"
  }
}

import { IAllPostsResponseDto, ICommunityNotificationsResponseDto, ICreateCommentResponseDto, ICreatePostResponseDto, IPostsInterestsListingResponseDto, IReactCommentResponseDto, IUpdateFollowResponseDto, IUpdatePostBookmarkResponseDto, IUpdatePostReactionResponseDto, IUpdatePostResponseDto, IUserCommunity, IUserCommunityProfileResponseDto, IUserIdentifyProfileResponseDto, IUsersIFollowResponseDto } from "../dtos";
import { IEmoijsListingResponseDto } from "../dtos/responses/emoijs-interests-response.dto";

export const mockTalbinahCommunity: IAllPostsResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "data": [
      {
        "id": 61,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 61,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T12:22:05.000000Z",
            "updated_at": "2025-06-07T12:22:05.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-07T12:21:32.000000Z"
      },
      {
        "id": 59,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 59,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T11:42:09.000000Z",
            "updated_at": "2025-06-07T11:42:09.000000Z"
          }
        },
        "is_marked": true,
        "bookmarks_count": 1,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-07T11:36:38.000000Z"
      },
      {
        "id": 49,
        "user": {
          "id": 2191,
          "dummy_name": "عمر 201",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2024-12-31T09:48:03.000000Z"
        },
        "interest": null,
        "content": "صباح الفل",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 2,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 49,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-03T10:23:17.000000Z",
            "updated_at": "2025-06-03T10:23:17.000000Z"
          }
        },
        "is_marked": true,
        "bookmarks_count": 1,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-02T17:29:42.000000Z"
      },
      {
        "id": 48,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": null,
        "content": "🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-02T16:39:42.000000Z"
      },
      {
        "id": 42,
        "user": {
          "id": 949,
          "dummy_name": "test",
          "emoji": {
            "id": 1,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%281%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-08-19T16:27:06.000000Z"
        },
        "interest": {
          "id": 14,
          "name": "المدارس",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "نفسي ترجع ايام المدرسة",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-05-12T09:23:24.000000Z"
      },
      {
        "id": 41,
        "user": {
          "id": 862,
          "dummy_name": "عين ميم",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-16T09:04:28.000000Z"
        },
        "interest": null,
        "content": "عداد",
        "image": null,
        "url": null,
        "comments_count": 9,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 54,
            "post_id": 41,
            "user_id": 862,
            "content": "1",
            "created_at": "2025-04-28T12:54:47.000000Z",
            "updated_at": "2025-04-28T12:54:47.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 55,
            "post_id": 41,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-28T12:54:49.000000Z",
            "updated_at": "2025-04-28T12:54:49.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 56,
            "post_id": 41,
            "user_id": 862,
            "content": "3",
            "created_at": "2025-04-28T12:54:51.000000Z",
            "updated_at": "2025-04-28T12:54:51.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 57,
            "post_id": 41,
            "user_id": 862,
            "content": "4",
            "created_at": "2025-04-28T12:54:53.000000Z",
            "updated_at": "2025-04-28T12:54:53.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 58,
            "post_id": 41,
            "user_id": 862,
            "content": "5",
            "created_at": "2025-04-28T12:54:56.000000Z",
            "updated_at": "2025-04-28T12:54:56.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 60,
            "post_id": 41,
            "user_id": 862,
            "content": "1",
            "created_at": "2025-04-30T07:31:59.000000Z",
            "updated_at": "2025-04-30T07:31:59.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 61,
            "post_id": 41,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-30T07:33:16.000000Z",
            "updated_at": "2025-04-30T07:33:16.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 62,
            "post_id": 41,
            "user_id": 949,
            "content": "5",
            "created_at": "2025-05-06T10:16:22.000000Z",
            "updated_at": "2025-05-06T10:16:22.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 64,
            "post_id": 41,
            "user_id": 949,
            "content": "22",
            "created_at": "2025-05-12T09:22:41.000000Z",
            "updated_at": "2025-05-12T09:22:41.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-04-28T12:53:35.000000Z"
      },
      {
        "id": 40,
        "user": {
          "id": 2165,
          "dummy_name": "hihi",
          "emoji": {
            "id": 15,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2815%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 1,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:52:41.000000Z"
        },
        "interest": null,
        "content": "djdieie",
        "image": null,
        "url": null,
        "comments_count": 12,
        "reactions_count": 3,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 40,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-03T10:23:22.000000Z",
            "updated_at": "2025-06-03T10:23:22.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 35,
            "post_id": 40,
            "user_id": 862,
            "content": "uuyu",
            "created_at": "2025-04-27T07:18:03.000000Z",
            "updated_at": "2025-04-27T07:18:03.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 36,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman",
            "created_at": "2025-04-27T07:21:09.000000Z",
            "updated_at": "2025-04-27T07:21:09.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 42,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:48:01.000000Z",
            "updated_at": "2025-04-28T12:48:01.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 43,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:48:50.000000Z",
            "updated_at": "2025-04-28T12:48:50.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 44,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:50:21.000000Z",
            "updated_at": "2025-04-28T12:50:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 45,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:18.000000Z",
            "updated_at": "2025-04-28T12:51:18.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 46,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:20.000000Z",
            "updated_at": "2025-04-28T12:51:20.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 47,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:21.000000Z",
            "updated_at": "2025-04-28T12:51:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 48,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:23.000000Z",
            "updated_at": "2025-04-28T12:51:23.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 49,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:24.000000Z",
            "updated_at": "2025-04-28T12:51:24.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 59,
            "post_id": 40,
            "user_id": 862,
            "content": "gfgvhhjjjk",
            "created_at": "2025-04-28T12:57:24.000000Z",
            "updated_at": "2025-04-28T12:57:24.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 63,
            "post_id": 40,
            "user_id": 949,
            "content": "t2",
            "created_at": "2025-05-06T10:16:42.000000Z",
            "updated_at": "2025-05-06T10:16:42.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-02-08T18:34:25.000000Z"
      },
      {
        "id": 39,
        "user": {
          "id": 2166,
          "dummy_name": "تيست",
          "emoji": {
            "id": 9,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%289%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:53:12.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "هاب ململممل",
        "image": null,
        "url": null,
        "comments_count": 5,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 37,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman",
            "created_at": "2025-04-27T07:21:21.000000Z",
            "updated_at": "2025-04-27T07:21:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 38,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman test",
            "created_at": "2025-04-28T12:38:27.000000Z",
            "updated_at": "2025-04-28T12:38:27.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 39,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman test",
            "created_at": "2025-04-28T12:38:56.000000Z",
            "updated_at": "2025-04-28T12:38:56.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 40,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman testttt",
            "created_at": "2025-04-28T12:42:05.000000Z",
            "updated_at": "2025-04-28T12:42:05.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 41,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman testttt",
            "created_at": "2025-04-28T12:42:08.000000Z",
            "updated_at": "2025-04-28T12:42:08.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-02-06T14:49:59.000000Z"
      },
      {
        "id": 38,
        "user": {
          "id": 2166,
          "dummy_name": "تيست",
          "emoji": {
            "id": 9,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%289%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:53:12.000000Z"
        },
        "interest": null,
        "content": "hello",
        "image": null,
        "url": null,
        "comments_count": 4,
        "reactions_count": 4,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 1,
        "comments": [
          {
            "id": 50,
            "post_id": 38,
            "user_id": 862,
            "content": "عمر",
            "created_at": "2025-04-28T12:52:43.000000Z",
            "updated_at": "2025-04-28T12:52:43.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 51,
            "post_id": 38,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-28T12:52:53.000000Z",
            "updated_at": "2025-04-28T12:52:53.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 52,
            "post_id": 38,
            "user_id": 862,
            "content": "3",
            "created_at": "2025-04-28T12:52:55.000000Z",
            "updated_at": "2025-04-28T12:52:55.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 53,
            "post_id": 38,
            "user_id": 862,
            "content": "4",
            "created_at": "2025-04-28T12:52:58.000000Z",
            "updated_at": "2025-04-28T12:52:58.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-01-18T08:44:12.000000Z"
      },
      {
        "id": 35,
        "user": {
          "id": 2182,
          "dummy_name": "د عمر 400",
          "emoji": {
            "id": 16,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2816%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-10-02T11:49:04.000000Z"
        },
        "interest": null,
        "content": "ggdoc post 3",
        "image": null,
        "url": null,
        "comments_count": 6,
        "reactions_count": 6,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 3,
        "comments": [
          {
            "id": 26,
            "post_id": 35,
            "user_id": 2166,
            "content": "hd",
            "created_at": "2025-01-01T18:52:24.000000Z",
            "updated_at": "2025-01-01T18:52:24.000000Z",
            "reactions_count": 1,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 27,
            "post_id": 35,
            "user_id": 2166,
            "content": "d",
            "created_at": "2025-01-01T18:52:28.000000Z",
            "updated_at": "2025-01-01T18:52:28.000000Z",
            "reactions_count": 1,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 31,
            "post_id": 35,
            "user_id": 2166,
            "content": "هلا",
            "created_at": "2025-02-06T14:49:20.000000Z",
            "updated_at": "2025-02-06T14:49:20.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 32,
            "post_id": 35,
            "user_id": 2166,
            "content": "ودو",
            "created_at": "2025-02-06T14:49:21.000000Z",
            "updated_at": "2025-02-06T14:49:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 33,
            "post_id": 35,
            "user_id": 862,
            "content": "gbzbabb hab. hahbahsbsbbs  abbBab nnnababab.  ahhbababab. hahbahsbsbbs",
            "created_at": "2025-04-23T07:58:40.000000Z",
            "updated_at": "2025-04-23T07:58:40.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 34,
            "post_id": 35,
            "user_id": 862,
            "content": "ggg",
            "created_at": "2025-04-27T07:15:43.000000Z",
            "updated_at": "2025-04-27T07:15:43.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-31T14:14:36.000000Z"
      },
      {
        "id": 34,
        "user": {
          "id": 2191,
          "dummy_name": "عمر 201",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2024-12-31T09:48:03.000000Z"
        },
        "interest": null,
        "content": "new use",
        "image": null,
        "url": null,
        "comments_count": 2,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [
          {
            "id": 29,
            "post_id": 34,
            "user_id": 2166,
            "content": "hi",
            "created_at": "2025-01-24T13:35:01.000000Z",
            "updated_at": "2025-01-24T13:35:01.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 30,
            "post_id": 34,
            "user_id": 2166,
            "content": "bdj",
            "created_at": "2025-01-24T13:35:03.000000Z",
            "updated_at": "2025-01-24T13:35:03.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-31T09:51:35.000000Z"
      },
      {
        "id": 31,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "13",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:55:29.000000Z"
      },
      {
        "id": 30,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "12",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 2,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:24:23.000000Z"
      },
      {
        "id": 29,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "11",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:24:09.000000Z"
      },
      {
        "id": 25,
        "user": {
          "id": 862,
          "dummy_name": "عين ميم",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-16T09:04:28.000000Z"
        },
        "interest": null,
        "content": "ggggvcffc",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 4,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 25,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T12:08:52.000000Z",
            "updated_at": "2025-06-07T12:08:52.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 3,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-11-07T10:22:26.000000Z"
      }
    ],
    "links": {
      "first": "https://redesign.talbinah.net/api/community/site/post?page=1",
      "last": "https://redesign.talbinah.net/api/community/site/post?page=2",
      "prev": null,
      "next": "https://redesign.talbinah.net/api/community/site/post?page=2"
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 2,
      "links": [
        {
          "url": null,
          "label": "pagination.previous",
          "active": false
        },
        {
          "url": "https://redesign.talbinah.net/api/community/site/post?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": "https://redesign.talbinah.net/api/community/site/post?page=2",
          "label": "2",
          "active": false
        },
        {
          "url": "https://redesign.talbinah.net/api/community/site/post?page=2",
          "label": "pagination.next",
          "active": false
        }
      ],
      "path": "https://redesign.talbinah.net/api/community/site/post",
      "per_page": 15,
      "to": 15,
      "total": 23
    }
  }
};

export const mockTalbinahInterestsCommunity: IPostsInterestsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 8,
      "name": "العاادات",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 9,
      "name": "الصحة",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 10,
      "name": "الذات",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 11,
      "name": "العلاقات",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 12,
      "name": "العمل",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 13,
      "name": "الماضي",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    },
    {
      "id": 14,
      "name": "المدارس",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
      "description": null,
      "created_at": "2024-08-20T12:38:00.000000Z",
      "updated_at": "2024-08-20T12:38:00.000000Z"
    }
  ]
};

export const mockEmojis: IEmoijsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "image": "https://talbinahlocal.s3.eu-central-1.amazonaws.com/emojis/f8IIsFINcUAxrPYhDdQdMVTJSp99eEcBvF9B6nmc.jpg",
      "label": null,
      "created_at": "2024-07-04T12:38:03.000000Z",
      "updated_at": "2024-07-04T12:38:03.000000Z"
    },
    {
      "id": 2,
      "image": "https://talbinahlocal.s3.eu-central-1.amazonaws.com/emojis/Cd0bwgYpDJBeSOLWkPfqfAxRbsv7FCeF079Mcqti.jpg",
      "label": "test 1",
      "created_at": "2024-07-04T12:38:30.000000Z",
      "updated_at": "2024-07-04T12:38:30.000000Z"
    }
  ]
};

export const mockUserIdentifyProfile: IUserIdentifyProfileResponseDto = {
  "status": true,
  "message": null,
  "data": null,
  // "data": {
  //   "id": 2266,
  //   "dummy_name": "إسلام عفيفي",
  //   "emoji": {
  //     "id": 8,
  //     "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
  //     "label": null,
  //     "created_at": "2024-08-20T12:38:00.000000Z",
  //     "updated_at": "2024-08-20T12:38:00.000000Z"
  //   },
  //   "interests": [
  //     {
  //       "id": 8,
  //       "name": "العاادات",
  //       "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
  //       "created_at": "2024-08-20T12:38:00.000000Z"
  //     },
  //     {
  //       "id": 13,
  //       "name": "الماضي",
  //       "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
  //       "created_at": "2024-08-20T12:38:00.000000Z"
  //     },
  //     {
  //       "id": 9,
  //       "name": "الصحة",
  //       "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
  //       "created_at": "2024-08-20T12:38:00.000000Z"
  //     }
  //   ],
  //   "my_post_count": 1,
  //   "my_following_count": 4,
  //   "my_followers_count": 0,
  //   "created_at": "2025-06-01T12:29:38.000000Z"
  // }
};

export const mockUserCommunityProfile: IUserCommunityProfileResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "me": true,
    "is_followd": false,
    "profileData": {
      "id": 22,
      "dummy_name": "إسلام عفيفي",
      "emoji": {
        "id": 8,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
        "label": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "interests": [
        {
          "id": 8,
          "name": "العاادات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
          "created_at": "2024-08-20T12:38:00.000000Z"
        },
        {
          "id": 13,
          "name": "الماضي",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
          "created_at": "2024-08-20T12:38:00.000000Z"
        },
        {
          "id": 9,
          "name": "الصحة",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
          "created_at": "2024-08-20T12:38:00.000000Z"
        }
      ],
      "my_post_count": 1,
      "my_following_count": 0,
      "my_followers_count": 0,
      "created_at": "2025-06-01T12:29:38.000000Z"
    },
    "posts": [
      {
        "id": 61,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 61,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T12:22:05.000000Z",
            "updated_at": "2025-06-07T12:22:05.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-07T12:21:32.000000Z"
      },
      {
        "id": 59,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 59,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T11:42:09.000000Z",
            "updated_at": "2025-06-07T11:42:09.000000Z"
          }
        },
        "is_marked": true,
        "bookmarks_count": 1,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-07T11:36:38.000000Z"
      },
      {
        "id": 49,
        "user": {
          "id": 2191,
          "dummy_name": "عمر 201",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2024-12-31T09:48:03.000000Z"
        },
        "interest": null,
        "content": "صباح الفل",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 2,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 49,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-03T10:23:17.000000Z",
            "updated_at": "2025-06-03T10:23:17.000000Z"
          }
        },
        "is_marked": true,
        "bookmarks_count": 1,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-02T17:29:42.000000Z"
      },
      {
        "id": 48,
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2025-06-01T12:29:38.000000Z"
        },
        "interest": null,
        "content": "🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-06-02T16:39:42.000000Z"
      },
      {
        "id": 42,
        "user": {
          "id": 949,
          "dummy_name": "test",
          "emoji": {
            "id": 1,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%281%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-08-19T16:27:06.000000Z"
        },
        "interest": {
          "id": 14,
          "name": "المدارس",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "نفسي ترجع ايام المدرسة",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-05-12T09:23:24.000000Z"
      },
      {
        "id": 41,
        "user": {
          "id": 862,
          "dummy_name": "عين ميم",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-16T09:04:28.000000Z"
        },
        "interest": null,
        "content": "عداد",
        "image": null,
        "url": null,
        "comments_count": 9,
        "reactions_count": 0,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 54,
            "post_id": 41,
            "user_id": 862,
            "content": "1",
            "created_at": "2025-04-28T12:54:47.000000Z",
            "updated_at": "2025-04-28T12:54:47.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 55,
            "post_id": 41,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-28T12:54:49.000000Z",
            "updated_at": "2025-04-28T12:54:49.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 56,
            "post_id": 41,
            "user_id": 862,
            "content": "3",
            "created_at": "2025-04-28T12:54:51.000000Z",
            "updated_at": "2025-04-28T12:54:51.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 57,
            "post_id": 41,
            "user_id": 862,
            "content": "4",
            "created_at": "2025-04-28T12:54:53.000000Z",
            "updated_at": "2025-04-28T12:54:53.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 58,
            "post_id": 41,
            "user_id": 862,
            "content": "5",
            "created_at": "2025-04-28T12:54:56.000000Z",
            "updated_at": "2025-04-28T12:54:56.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 60,
            "post_id": 41,
            "user_id": 862,
            "content": "1",
            "created_at": "2025-04-30T07:31:59.000000Z",
            "updated_at": "2025-04-30T07:31:59.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 61,
            "post_id": 41,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-30T07:33:16.000000Z",
            "updated_at": "2025-04-30T07:33:16.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 62,
            "post_id": 41,
            "user_id": 949,
            "content": "5",
            "created_at": "2025-05-06T10:16:22.000000Z",
            "updated_at": "2025-05-06T10:16:22.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 64,
            "post_id": 41,
            "user_id": 949,
            "content": "22",
            "created_at": "2025-05-12T09:22:41.000000Z",
            "updated_at": "2025-05-12T09:22:41.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-04-28T12:53:35.000000Z"
      },
      {
        "id": 40,
        "user": {
          "id": 2165,
          "dummy_name": "hihi",
          "emoji": {
            "id": 15,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2815%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 1,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:52:41.000000Z"
        },
        "interest": null,
        "content": "djdieie",
        "image": null,
        "url": null,
        "comments_count": 12,
        "reactions_count": 3,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 40,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-03T10:23:22.000000Z",
            "updated_at": "2025-06-03T10:23:22.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 35,
            "post_id": 40,
            "user_id": 862,
            "content": "uuyu",
            "created_at": "2025-04-27T07:18:03.000000Z",
            "updated_at": "2025-04-27T07:18:03.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 36,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman",
            "created_at": "2025-04-27T07:21:09.000000Z",
            "updated_at": "2025-04-27T07:21:09.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 42,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:48:01.000000Z",
            "updated_at": "2025-04-28T12:48:01.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 43,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:48:50.000000Z",
            "updated_at": "2025-04-28T12:48:50.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 44,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:50:21.000000Z",
            "updated_at": "2025-04-28T12:50:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 45,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:18.000000Z",
            "updated_at": "2025-04-28T12:51:18.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 46,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:20.000000Z",
            "updated_at": "2025-04-28T12:51:20.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 47,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:21.000000Z",
            "updated_at": "2025-04-28T12:51:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 48,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:23.000000Z",
            "updated_at": "2025-04-28T12:51:23.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 49,
            "post_id": 40,
            "user_id": 862,
            "content": "hello from postman omar",
            "created_at": "2025-04-28T12:51:24.000000Z",
            "updated_at": "2025-04-28T12:51:24.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 59,
            "post_id": 40,
            "user_id": 862,
            "content": "gfgvhhjjjk",
            "created_at": "2025-04-28T12:57:24.000000Z",
            "updated_at": "2025-04-28T12:57:24.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 63,
            "post_id": 40,
            "user_id": 949,
            "content": "t2",
            "created_at": "2025-05-06T10:16:42.000000Z",
            "updated_at": "2025-05-06T10:16:42.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-02-08T18:34:25.000000Z"
      },
      {
        "id": 39,
        "user": {
          "id": 2166,
          "dummy_name": "تيست",
          "emoji": {
            "id": 9,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%289%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:53:12.000000Z"
        },
        "interest": {
          "id": 10,
          "name": "الذات",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
          "description": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "content": "هاب ململممل",
        "image": null,
        "url": null,
        "comments_count": 5,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 0,
        "comments": [
          {
            "id": 37,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman",
            "created_at": "2025-04-27T07:21:21.000000Z",
            "updated_at": "2025-04-27T07:21:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 38,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman test",
            "created_at": "2025-04-28T12:38:27.000000Z",
            "updated_at": "2025-04-28T12:38:27.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 39,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman test",
            "created_at": "2025-04-28T12:38:56.000000Z",
            "updated_at": "2025-04-28T12:38:56.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 40,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman testttt",
            "created_at": "2025-04-28T12:42:05.000000Z",
            "updated_at": "2025-04-28T12:42:05.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 41,
            "post_id": 39,
            "user_id": 862,
            "content": "hello from postman testttt",
            "created_at": "2025-04-28T12:42:08.000000Z",
            "updated_at": "2025-04-28T12:42:08.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-02-06T14:49:59.000000Z"
      },
      {
        "id": 38,
        "user": {
          "id": 2166,
          "dummy_name": "تيست",
          "emoji": {
            "id": 9,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%289%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-17T22:53:12.000000Z"
        },
        "interest": null,
        "content": "hello",
        "image": null,
        "url": null,
        "comments_count": 4,
        "reactions_count": 4,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 1,
        "comments": [
          {
            "id": 50,
            "post_id": 38,
            "user_id": 862,
            "content": "عمر",
            "created_at": "2025-04-28T12:52:43.000000Z",
            "updated_at": "2025-04-28T12:52:43.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 51,
            "post_id": 38,
            "user_id": 862,
            "content": "2",
            "created_at": "2025-04-28T12:52:53.000000Z",
            "updated_at": "2025-04-28T12:52:53.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 52,
            "post_id": 38,
            "user_id": 862,
            "content": "3",
            "created_at": "2025-04-28T12:52:55.000000Z",
            "updated_at": "2025-04-28T12:52:55.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 53,
            "post_id": 38,
            "user_id": 862,
            "content": "4",
            "created_at": "2025-04-28T12:52:58.000000Z",
            "updated_at": "2025-04-28T12:52:58.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2025-01-18T08:44:12.000000Z"
      },
      {
        "id": 35,
        "user": {
          "id": 2182,
          "dummy_name": "د عمر 400",
          "emoji": {
            "id": 16,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2816%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-10-02T11:49:04.000000Z"
        },
        "interest": null,
        "content": "ggdoc post 3",
        "image": null,
        "url": null,
        "comments_count": 6,
        "reactions_count": 6,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 3,
        "comments": [
          {
            "id": 26,
            "post_id": 35,
            "user_id": 2166,
            "content": "hd",
            "created_at": "2025-01-01T18:52:24.000000Z",
            "updated_at": "2025-01-01T18:52:24.000000Z",
            "reactions_count": 1,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 27,
            "post_id": 35,
            "user_id": 2166,
            "content": "d",
            "created_at": "2025-01-01T18:52:28.000000Z",
            "updated_at": "2025-01-01T18:52:28.000000Z",
            "reactions_count": 1,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 31,
            "post_id": 35,
            "user_id": 2166,
            "content": "هلا",
            "created_at": "2025-02-06T14:49:20.000000Z",
            "updated_at": "2025-02-06T14:49:20.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 32,
            "post_id": 35,
            "user_id": 2166,
            "content": "ودو",
            "created_at": "2025-02-06T14:49:21.000000Z",
            "updated_at": "2025-02-06T14:49:21.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 33,
            "post_id": 35,
            "user_id": 862,
            "content": "gbzbabb hab. hahbahsbsbbs  abbBab nnnababab.  ahhbababab. hahbahsbsbbs",
            "created_at": "2025-04-23T07:58:40.000000Z",
            "updated_at": "2025-04-23T07:58:40.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 34,
            "post_id": 35,
            "user_id": 862,
            "content": "ggg",
            "created_at": "2025-04-27T07:15:43.000000Z",
            "updated_at": "2025-04-27T07:15:43.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-31T14:14:36.000000Z"
      },
      {
        "id": 34,
        "user": {
          "id": 2191,
          "dummy_name": "عمر 201",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 2,
          "my_following_count": 1,
          "my_followers_count": 0,
          "created_at": "2024-12-31T09:48:03.000000Z"
        },
        "interest": null,
        "content": "new use",
        "image": null,
        "url": null,
        "comments_count": 2,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [
          {
            "id": 29,
            "post_id": 34,
            "user_id": 2166,
            "content": "hi",
            "created_at": "2025-01-24T13:35:01.000000Z",
            "updated_at": "2025-01-24T13:35:01.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          },
          {
            "id": 30,
            "post_id": 34,
            "user_id": 2166,
            "content": "bdj",
            "created_at": "2025-01-24T13:35:03.000000Z",
            "updated_at": "2025-01-24T13:35:03.000000Z",
            "reactions_count": 0,
            "is_liked": {
              "id": 1,
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
              "label": "care",
              "created_at": "2024-09-22T11:03:47.000000Z",
              "updated_at": "2024-09-22T11:17:37.000000Z",
              "pivot": {
                "post_id": 59,
                "react_id": 1,
                "user_id": 2266,
                "created_at": "2025-06-07T11:42:09.000000Z",
                "updated_at": "2025-06-07T11:42:09.000000Z"
              }
            },
            "user": {
              "id": 2266,
              "dummy_name": "إسلام عفيفي",
              "emoji": {
                "id": 8,
                "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
                "label": null,
                "created_at": "2024-08-20T12:38:00.000000Z",
                "updated_at": "2024-08-20T12:38:00.000000Z"
              },
              "interests": [
                {
                  "id": 8,
                  "name": "العاادات",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 13,
                  "name": "الماضي",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                },
                {
                  "id": 9,
                  "name": "الصحة",
                  "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
                  "created_at": "2024-08-20T12:38:00.000000Z"
                }
              ],
              "my_post_count": 3,
              "my_following_count": 1,
              "my_followers_count": 0,
              "created_at": "2025-06-01T12:29:38.000000Z"
            }
          }
        ],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-31T09:51:35.000000Z"
      },
      {
        "id": 31,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "13",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 3,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:55:29.000000Z"
      },
      {
        "id": 30,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "12",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 2,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:24:23.000000Z"
      },
      {
        "id": 29,
        "user": {
          "id": 2236,
          "dummy_name": "userdev",
          "emoji": {
            "id": 8,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-12-25T18:47:21.000000Z"
        },
        "interest": null,
        "content": "11",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 1,
        "is_liked": null,
        "is_marked": false,
        "bookmarks_count": 2,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-12-30T15:24:09.000000Z"
      },
      {
        "id": 25,
        "user": {
          "id": 862,
          "dummy_name": "عين ميم",
          "emoji": {
            "id": 20,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%2820%29.png",
            "label": null,
            "created_at": "2024-08-20T12:38:00.000000Z",
            "updated_at": "2024-08-20T12:38:00.000000Z"
          },
          "interests": [
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 3,
          "my_following_count": 0,
          "my_followers_count": 0,
          "created_at": "2024-09-16T09:04:28.000000Z"
        },
        "interest": null,
        "content": "ggggvcffc",
        "image": null,
        "url": null,
        "comments_count": 0,
        "reactions_count": 4,
        "is_liked": {
          "id": 1,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/reaction/0zgHU5N4xSS9hUeUANFMzgnAJd3LK3nrReNqqNd1.png",
          "label": "care",
          "created_at": "2024-09-22T11:03:47.000000Z",
          "updated_at": "2024-09-22T11:17:37.000000Z",
          "pivot": {
            "post_id": 25,
            "react_id": 1,
            "user_id": 2266,
            "created_at": "2025-06-07T12:08:52.000000Z",
            "updated_at": "2025-06-07T12:08:52.000000Z"
          }
        },
        "is_marked": false,
        "bookmarks_count": 3,
        "comments": [],
        "is_followed": false,
        "user_followed_count": 0,
        "created_at": "2024-11-07T10:22:26.000000Z"
      }
    ]
  }
};

export const mockCreatePostResponse: ICreatePostResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "user_id": 500,
    "content": "test 1",
    "image": [
      "https://talbinahlocal.s3.eu-central-1.amazonaws.com/community-images/noL01E1AmkYJK9eVt4LVY9qzGpsKvGLObjJmCGXh.jpg",
      "https://talbinahlocal.s3.eu-central-1.amazonaws.com/community-images/dDkTu9HF5SqMzphCtVbezTwnXAEtJzIvp2kcSojr.png"
    ],
    "url": "https://drawsql.app/teams/talbinah/diagrams/community-schema",
    "updated_at": "2024-07-04T13:33:24.000000Z",
    "created_at": "2024-07-04T13:33:24.000000Z",
    "id": 2
  }
};

export const mockUpdatePostResponse: IUpdatePostResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "user_id": 500,
    "content": "test 1",
    "image": [
      "https://talbinahlocal.s3.eu-central-1.amazonaws.com/community-images/noL01E1AmkYJK9eVt4LVY9qzGpsKvGLObjJmCGXh.jpg",
      "https://talbinahlocal.s3.eu-central-1.amazonaws.com/community-images/dDkTu9HF5SqMzphCtVbezTwnXAEtJzIvp2kcSojr.png"
    ],
    "url": "https://drawsql.app/teams/talbinah/diagrams/community-schema",
    "updated_at": "2024-07-04T13:33:24.000000Z",
    "created_at": "2024-07-04T13:33:24.000000Z",
    "id": 2
  }
};

export const mockUpdatePostReactionResponse: IUpdatePostReactionResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 1,
    "post_id": 1,
    "user_id": 500,
    "react": 1,
    "created_at": "2024-07-04T13:41:32.000000Z",
    "updated_at": "2024-07-04T13:42:30.000000Z",
    "post": {
      "id": 61,
      "user": {
        "id": 2266,
        "dummy_name": "إسلام عفيفي",
        "emoji": {
          "id": 8,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
          "label": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "interests": [
          {
            "id": 8,
            "name": "العاادات",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 13,
            "name": "الماضي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 9,
            "name": "الصحة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          }
        ],
        "my_post_count": 3,
        "my_following_count": 1,
        "my_followers_count": 0,
        "created_at": "2025-06-01T12:29:38.000000Z"
      },
      "interest": {
        "id": 10,
        "name": "الذات",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
        "description": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
      "image": null,
      "url": null,
      "comments_count": 5,
      "reactions_count": 1,
      "is_liked": null,
      "is_marked": true,
      "bookmarks_count": 50,
      "comments": [],
      "is_followed": false,
      "user_followed_count": 70,
      "created_at": "2025-06-07T12:21:32.000000Z"
    }
  }
};

export const mockUpdateFollowResponse: IUpdateFollowResponseDto = {
  "status": true,
  "message": "user_follow.toggle_user_follow_successfully",
  "data": {
    "user_id": 2191,
    "is_followed": true,
    "post": {
      "id": 61,
      "user": {
        "id": 2266,
        "dummy_name": "إسلام عفيفي",
        "emoji": {
          "id": 8,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
          "label": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "interests": [
          {
            "id": 8,
            "name": "العاادات",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 13,
            "name": "الماضي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 9,
            "name": "الصحة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          }
        ],
        "my_post_count": 3,
        "my_following_count": 1,
        "my_followers_count": 0,
        "created_at": "2025-06-01T12:29:38.000000Z"
      },
      "interest": {
        "id": 10,
        "name": "الذات",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
        "description": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
      "image": null,
      "url": null,
      "comments_count": 10,
      "reactions_count": 10,
      "is_liked": null,
      "is_marked": true,
      "bookmarks_count": 10,
      "comments": [],
      "is_followed": false,
      "user_followed_count": 10,
      "created_at": "2025-06-07T12:21:32.000000Z"
    }
  }
};

export const mockUpdatePostBookmarkResponse: IUpdatePostBookmarkResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 66,
    "user_id": 2266,
    "post_id": 52,
    "marked": 0,
    "created_at": "2025-06-03T09:54:35.000000Z",
    "updated_at": "2025-06-03T09:58:19.000000Z",
    "post": {
      "id": 61,
      "user": {
        "id": 2266,
        "dummy_name": "إسلام عفيفي",
        "emoji": {
          "id": 8,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
          "label": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "interests": [
          {
            "id": 8,
            "name": "العاادات",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 13,
            "name": "الماضي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 9,
            "name": "الصحة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          }
        ],
        "my_post_count": 3,
        "my_following_count": 1,
        "my_followers_count": 0,
        "created_at": "2025-06-01T12:29:38.000000Z"
      },
      "interest": {
        "id": 10,
        "name": "الذات",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
        "description": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
      "image": null,
      "url": null,
      "comments_count": 0,
      "reactions_count": 1,
      "is_liked": null,
      "is_marked": true,
      "bookmarks_count": 10,
      "comments": [],
      "is_followed": false,
      "user_followed_count": 7,
      "created_at": "2025-06-07T12:21:32.000000Z"
    }
  }
};

export const mockCreatePostCommentResponse: ICreateCommentResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "post": {
      "id": 61,
      "user": {
        "id": 2266,
        "dummy_name": "إسلام عفيفي",
        "emoji": {
          "id": 8,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
          "label": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "interests": [
          {
            "id": 8,
            "name": "العاادات",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 13,
            "name": "الماضي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 9,
            "name": "الصحة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          }
        ],
        "my_post_count": 3,
        "my_following_count": 1,
        "my_followers_count": 0,
        "created_at": "2025-06-01T12:29:38.000000Z"
      },
      "interest": {
        "id": 10,
        "name": "الذات",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
        "description": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
      "image": null,
      "url": null,
      "comments_count": 0,
      "reactions_count": 1,
      "is_liked": null,
      "is_marked": true,
      "bookmarks_count": 10,
      "comments": [],
      "is_followed": false,
      "user_followed_count": 7,
      "created_at": "2025-06-07T12:21:32.000000Z"
    }
  }
};

export const mockReactPostCommentResponse: IReactCommentResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "post": {
      "id": 61,
      "user": {
        "id": 2266,
        "dummy_name": "إسلام عفيفي",
        "emoji": {
          "id": 8,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/emojis/Rectangle%20%288%29.png",
          "label": null,
          "created_at": "2024-08-20T12:38:00.000000Z",
          "updated_at": "2024-08-20T12:38:00.000000Z"
        },
        "interests": [
          {
            "id": 8,
            "name": "العاادات",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 13,
            "name": "الماضي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          },
          {
            "id": 9,
            "name": "الصحة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
            "created_at": "2024-08-20T12:38:00.000000Z"
          }
        ],
        "my_post_count": 3,
        "my_following_count": 1,
        "my_followers_count": 0,
        "created_at": "2025-06-01T12:29:38.000000Z"
      },
      "interest": {
        "id": 10,
        "name": "الذات",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
        "description": null,
        "created_at": "2024-08-20T12:38:00.000000Z",
        "updated_at": "2024-08-20T12:38:00.000000Z"
      },
      "content": "مشاركة جديدة\n🌿 منشوراتك تساعد الآخرين على الشعور بأنهم ليسوا وحدهم",
      "image": null,
      "url": null,
      "comments_count": 0,
      "reactions_count": 1,
      "is_liked": null,
      "is_marked": true,
      "bookmarks_count": 10,
      "comments": [],
      "is_followed": false,
      "user_followed_count": 7,
      "created_at": "2025-06-07T12:21:32.000000Z"
    }
  }
};

export const mockTalbinahCommunityNotifications: ICommunityNotificationsResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "data": [
      {
        "id": 66729,
        "title": "تم حفظ منشورك",
        "body": "Eslam Afify قام بحفظ منشورك",
        "action": null,
        "page": "post",
        "pageID": "118",
        "link": "/api/community/site/post/118",
        "received": 0,
        "type": "community",
        "is_read": 0,
        "created_at": "2025-06-17T08:23:30.000000Z",
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي جابر بركات",
          "emoji": {
            "id": 3,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/NKUQfecnCgM9MSGfCn9jOyXDGeMV8rwBnBKSQv0p.png",
            "label": null,
            "created_at": "2025-06-11T09:02:22.000000Z",
            "updated_at": "2025-06-11T09:02:22.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 5,
          "my_following_count": 5,
          "my_followers_count": 2,
          "created_at": "2025-06-11T12:51:04.000000Z"
        }
      },
      {
        "id": 66728,
        "title": "تم الإعجاب بمنشورك",
        "body": "Eslam Afify قام بالإعجاب بمنشورك",
        "action": null,
        "page": "post",
        "pageID": "118",
        "link": "/api/community/site/post/118",
        "received": 0,
        "type": "community",
        "is_read": 0,
        "created_at": "2025-06-17T08:23:29.000000Z",
        "user": {
          "id": 2266,
          "dummy_name": "إسلام عفيفي جابر بركات",
          "emoji": {
            "id": 3,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/NKUQfecnCgM9MSGfCn9jOyXDGeMV8rwBnBKSQv0p.png",
            "label": null,
            "created_at": "2025-06-11T09:02:22.000000Z",
            "updated_at": "2025-06-11T09:02:22.000000Z"
          },
          "interests": [
            {
              "id": 8,
              "name": "العاادات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%201.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 13,
              "name": "الماضي",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%206.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 9,
              "name": "الصحة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%202.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 10,
              "name": "الذات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%203.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 11,
              "name": "العلاقات",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%204.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 12,
              "name": "العمل",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%205.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            },
            {
              "id": 14,
              "name": "المدارس",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/community/interests/interest%207.png",
              "created_at": "2024-08-20T12:38:00.000000Z"
            }
          ],
          "my_post_count": 5,
          "my_following_count": 5,
          "my_followers_count": 2,
          "created_at": "2025-06-11T12:51:04.000000Z"
        }
      }
    ]
  }
};

export const mockTalbinahCommunityProfileUsersIFollow: IUsersIFollowResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 2516,
      "name": "Ahmed Wagih",
      "image": {
        "id": 3,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/NKUQfecnCgM9MSGfCn9jOyXDGeMV8rwBnBKSQv0p.png",
        "label": null,
        "created_at": "2025-06-11T09:02:22.000000Z",
        "updated_at": "2025-06-11T09:02:22.000000Z"
      }
    },
    {
      "id": 2207,
      "name": "تيست",
      "image": {
        "id": 7,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/vC6eLL37CKOIIiLhh5HglfMQfwRviqIkuySQhlhR.png",
        "label": null,
        "created_at": "2025-06-11T09:02:59.000000Z",
        "updated_at": "2025-06-11T09:02:59.000000Z"
      }
    },
    {
      "id": 862,
      "name": "عمر م ع",
      "image": {
        "id": 11,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/aKARAcMgMH6XBfWy6p0xFdwSV7drBvh3R6isjQsL.png",
        "label": null,
        "created_at": "2025-06-11T09:03:30.000000Z",
        "updated_at": "2025-06-11T09:03:30.000000Z"
      }
    },
    {
      "id": 2206,
      "name": "عمر 205",
      "image": {
        "id": 2,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/emojis/v0UImuMXYpDS6dvlaX6eUsXr19QGHeNxfBb04LyX.png",
        "label": null,
        "created_at": "2025-06-11T09:02:09.000000Z",
        "updated_at": "2025-06-11T09:02:09.000000Z"
      }
    },
    {
      "id": 2236,
      "name": null,
      "image": null
    },
    {
      "id": 2166,
      "name": null,
      "image": null
    },
    {
      "id": 3,
      "name": null,
      "image": null
    }
  ]
};

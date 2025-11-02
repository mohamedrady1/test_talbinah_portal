import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { TalbinahCommunityHeaderConfig } from '../../constants';
import { ReelsFeedComponent } from '../reels-feed';
import { ITab, MediaType, UserReelsData } from '../../models';
import { IUserIdentifyProfileData } from '../../dtos';

@Component({
  selector: 'app-explore-reels-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './explore-reels-card.component.html',
  styleUrls: ['./explore-reels-card.component.scss']
})
export class ExploreReelsCardComponent {
  private modalService = inject(ModalService);
  @Input() data?: { interests?: ITab[], itemToEdit?: any, userIdentityProfileData?: IUserIdentifyProfileData | null };

  sampleFeedData: UserReelsData[] = [
    {
      userId: 'user1_id',
      userName: 'محمد علي',
      userAvatar: 'https://placehold.co/64x64/4CAF50/FFFFFF?text=MA',
      reels: [
        {
          id: 'reel1_user1',
          mediaType: MediaType.Video,
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'استكشاف الجمال الطبيعي للمناظر الجبلية الخضراء.',
          user: { name: 'محمد علي', avatar: 'https://placehold.co/64x64/4CAF50/FFFFFF?text=MA', isFollowing: false },
        },
        {
          id: 'reel2_user1',
          mediaType: MediaType.Image,
          url: 'https://placehold.co/1080x1920/FFC107/000000?text=صورة+محمد+1',
          duration: 5,
          description: 'لقطة رائعة لغروب الشمس فوق المدينة.',
          user: { name: 'محمد علي', avatar: 'https://placehold.co/64x64/4CAF50/FFFFFF?text=MA', isFollowing: false },
        },
      ],
    },
    {
      userId: 'user2_id',
      userName: 'فاطمة الزهراء',
      userAvatar: 'https://placehold.co/64x64/E91E63/FFFFFF?text=FZ',
      reels: [
        {
          id: 'reel3_user2',
          mediaType: MediaType.Video,
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'مغامرة رائعة في قلب الغابة المطيرة.',
          user: { name: 'فاطمة الزهراء', avatar: 'https://placehold.co/64x64/E91E63/FFFFFF?text=FZ', isFollowing: true },
        },
        {
          id: 'reel4_user2',
          mediaType: MediaType.Image,
          url: 'https://placehold.co/1080x1920/9C27B0/FFFFFF?text=صورة+فاطمة+1',
          duration: 7,
          description: 'فن الشارع في أبهى صوره.',
          user: { name: 'فاطمة الزهراء', avatar: 'https://placehold.co/64x64/E91E63/FFFFFF?text=FZ', isFollowing: true },
        },
        {
          id: 'reel5_user2',
          mediaType: MediaType.Image,
          url: 'https://placehold.co/1080x1920/00BCD4/FFFFFF?text=صورة+فاطمة+2',
          duration: 4,
          description: 'جمال العمارة الحديثة.',
          user: { name: 'فاطمة الزهراء', avatar: 'https://placehold.co/64x64/E91E63/FFFFFF?text=FZ', isFollowing: true },
        },
      ],
    },
    {
      userId: 'user3_id',
      userName: 'أحمد سعيد',
      userAvatar: 'https://placehold.co/64x64/2196F3/FFFFFF?text=AS',
      reels: [
        {
          id: 'reel6_user3',
          mediaType: MediaType.Video,
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'تجربة قيادة سيارة رياضية.',
          user: { name: 'أحمد سعيد', avatar: 'https://placehold.co/64x64/2196F3/FFFFFF?text=AS', isFollowing: false },
        },
      ],
    },
  ];
  protected openReels(): void {
    this.modalService.open(ReelsFeedComponent, { // Now opening ReelsFeedComponent
      inputs: {
        ...TalbinahCommunityHeaderConfig, // Spreading existing config
        feedData: this.sampleFeedData // Passing the new data structure
        ,
        data: {
          // Pass the signal's current value to the child component
          interests: this.data?.interests,
          userIdentityProfileData: this.data?.userIdentityProfileData
        }
      },
      width: '70%'
    });
  }
}

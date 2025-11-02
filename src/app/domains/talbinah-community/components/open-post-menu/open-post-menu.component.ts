import { CommonModule, isPlatformBrowser } from '@angular/common'
import { Component, ComponentRef, EventEmitter, inject, Input, Output, PLATFORM_ID, signal, ViewChild, ViewContainerRef } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ClickOutsideDirective } from '../../../../common/core/directives'
import { DeletePopupComponent, ModalService, PublicService } from '../../../../shared'
import { menuConfig } from '../../configs'
import { IPost, IUserIdentifyProfileData } from '../../dtos'
import { Logger } from '../../../../common'
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-open-post-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, TranslateModule, TranslateApiPipe],
  templateUrl: './open-post-menu.component.html',
  styleUrls: ['./open-post-menu.component.scss']
})
export class OpenPostMenuComponent {
  private modalService = inject(ModalService)
  @Output() action: EventEmitter<void> = new EventEmitter();
  @Output() viewPostAction: EventEmitter<void> = new EventEmitter();
  @Output() deletePostAction: EventEmitter<IPost> = new EventEmitter();
  @Output() editPostAction: EventEmitter<IPost> = new EventEmitter();
  @Input() isViewPostButton: boolean = true;

  @Input() userIdentityProfileData = signal<IUserIdentifyProfileData | null>(null);

  @Input() postItem!: IPost;

  currentLanguage!: string;
  openMenuInfo: boolean = false;
  menuConfig = menuConfig;

  private publicService = inject(PublicService)
  private platformId = inject(PLATFORM_ID)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.publicService.getCurrentLanguage();
    }
  }

  ngOnInit(): void {
    // Check if postItem exists and if the user IDs don't match
    console.log(this.postItem, this.postItem.user?.id, this.userIdentityProfileData()?.id)
    if (this.postItem && this.postItem.user?.id !== this.userIdentityProfileData()?.id) {
      // Filter out the item where action is 'edit'
      this.menuConfig = {
        ...this.menuConfig, // Keep other properties of menuConfig as they are
        list: this.menuConfig.list.filter(item =>
          item.action !== 'edit' && item.action !== 'delete' // Filter out both 'edit' and 'delete'
        )
      };
    }
  }

  triggerAction(action: string, item: any) {
    switch (action) {
      case 'view':
        this.viewPost();
        break
      case 'delete':
        this.deletePost();
        console.info("item action delete for:", item);
        break
      case 'edit':
        console.info("item action edit for:", item);
        this.editPost(item);
        break
      default:
        console.warn("No action defined for:", action);
    }
  }
  protected deletePost(): void {
    this.modalService.open(DeletePopupComponent, {
      outputs: {
        closed: (res: any) => {
          console.log('The model is closed');
          if (res?.status) {
            this.deletePostAction.emit(this.postItem);
          }
        }
      },
      minHeight: '10rem',
      maxHeight: '70rem',
      backgroundColor: 'white',
      isPhoneFromDown: true,
    })

  }

  protected viewPost(): void {
    this.viewPostAction.emit();
  }

  protected editPost(item?: any): void {
    this.editPostAction.emit(item);
  }

  @ViewChild('modalContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

}

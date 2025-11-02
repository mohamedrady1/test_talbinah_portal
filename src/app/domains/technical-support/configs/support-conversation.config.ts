import { IActionDropdownMenuItem } from "../../../shared";
import { EmptyStateConfig } from "../../settings";

export const ChatSupportActionsMenuItemsConfig: IActionDropdownMenuItem[] = [
  {
    action: 'assignTo',
    text: 'assign_to',
    icon: 'images/icons/profile.svg',
    isOpenModal: true
  },
  {
    action: 'transferTo',
    text: 'transfer_to',
    icon: 'images/icons/details.png',
    isOpenModal: true
  },
  {
    action: 'closeConversation',
    text: 'end_chat',
    icon: 'images/icons/close-square.png',
    isOpenModal: true,
    type: 'cancel'
  }
];

export const SupportChatMessagesEmptyState: EmptyStateConfig = {
  imageUrl: 'images/emptyStates/image-11.svg',
  title: 'start_conversation_now2',
  imgWidth: '38%'
};



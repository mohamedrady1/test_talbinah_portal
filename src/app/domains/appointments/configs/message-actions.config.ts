import { IActionDropdownMenuItem } from "../../../shared";

export const MessageActionsConfig: IActionDropdownMenuItem[] = [
  {
    action: 'replay-massege',
    text: 'replay',
    icon: 'images/icons/replay.png',
    isOpenModal: true
  },
  {
    action: 'copy-massege',
    text: 'copy',
    icon: 'images/icons/copy.png',
    isOpenModal: true
  },
  {
    action: 'delete-message',
    text: 'delete',
    icon: 'images/icons/trash.png',
    isOpenModal: true,
    type: 'cancel'
  }
];

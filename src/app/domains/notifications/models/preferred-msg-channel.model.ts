import { IPreferredMsgChannelResponseDto } from '../dtos';

export interface PreferredMsgChannelState {
  isLoading: boolean;
  state: boolean | null;
  errorMessage: string | null;
  response: IPreferredMsgChannelResponseDto | null;
}

export const initialPreferredMsgChannelState: PreferredMsgChannelState = {
  isLoading: false,
  state: null,
  errorMessage: null,
  response: null
};

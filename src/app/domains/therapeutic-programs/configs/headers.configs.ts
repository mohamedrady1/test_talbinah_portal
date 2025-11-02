import { ICardHeaderConfig } from "../../../shared";
import { IHeaderConfig } from "../models";

export const DetailsHeaderConfig: IHeaderConfig = {
  image: 'images/mentalHealthScale/icons/talbinah.png',
  title: 'confirm_subscription',
  // subtitle: 'talbinahCommunity.shareText'
}

export const exploreTherapyProgramsHeader: ICardHeaderConfig = {
  title: 'explore_treatment_programs',
  isButtonsVisible: false,
  isAllButtonVisible: false,
}
export const myTherapyProgramsHeader: ICardHeaderConfig = {
  title: 'your_treatment_programs',
  isButtonsVisible: false,
  isAllButtonVisible: true,
}

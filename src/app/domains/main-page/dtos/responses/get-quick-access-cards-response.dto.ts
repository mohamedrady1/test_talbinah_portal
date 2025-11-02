export interface IQuickAccessCard {
  id: string;
  title: string;
  iconUrl: string;
  route: string;
}

export interface IQuickAccessCardsResponseDto {
  cards: IQuickAccessCard[];
}

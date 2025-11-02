export interface ICardHeaderConfig {
    title: string;
    isButtonsVisible: boolean;
    isAllButtonVisible: boolean;

    isTabsEnabled?: boolean;
    tabs?: string[];
    selectedTab?: string;
}

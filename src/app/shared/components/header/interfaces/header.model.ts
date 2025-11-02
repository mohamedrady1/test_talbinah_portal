export interface IHeaderConfig {
    image?: string;
    title?: string;
    subtitle?: string;
    onCloseClick?: () => void; // Function to be called when X button is clicked
    showCloseButton?: boolean;
}

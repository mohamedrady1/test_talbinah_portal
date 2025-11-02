export interface IToast {
    id: number;
    severity: 'success' | 'info' | 'error' | 'warning';
    summary: string;
    detail: string;
    life?: number;
}
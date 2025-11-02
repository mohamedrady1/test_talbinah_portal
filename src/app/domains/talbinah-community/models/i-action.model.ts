export interface IAction {
    name: 'favourite' | 'comment' | 'add';
    count: number;
    active: boolean;
}

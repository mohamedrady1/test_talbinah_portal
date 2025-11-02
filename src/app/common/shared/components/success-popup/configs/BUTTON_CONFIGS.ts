import { EventEmitter } from "@angular/core";
import { ButtonConfig } from "../../../../../layouts/dashboatd/components/admin-header/sub-header/interface/sub-header-model";

export const BUTTON_CONFIGS = {
    cancelButton: {
        label: 'back',
        action: new EventEmitter<void>(),
    } as ButtonConfig,
};

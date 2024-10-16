import { ValueProvider } from "@angular/core";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from "@angular/material/snack-bar";

export const SNACK_BAR_CONFIG: ValueProvider = {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
    } as MatSnackBarConfig
}
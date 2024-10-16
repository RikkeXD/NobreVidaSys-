import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class ValidadorPassword {
    static ValidatePassword(control: AbstractControl) {
        const senha = control.get('senha')?.value
        const senhaConfirm = control.get('senhaConfirm')?.value

        if (senha !== senhaConfirm) {
            return { senhaInvalida: true }
        }
        return null
    }
}

export function ValidateUF(control: FormControl<string>): ValidationErrors | null{
    const UF_VALIDAS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 
    'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 
    'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
    return !control.value || !UF_VALIDAS.includes(control.value.toUpperCase()) ? {invalidUF: false} : null 
}

export function ValidateEmpty(control: FormControl): ValidationErrors | null{
    Object.keys(control)
    if( !control.value || (control.value && control.value == '')){
        control.markAsDirty()
        return{invalidInput: true}
    }
    return null
}
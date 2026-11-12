import { Component, inject, ɵinternalProvideZoneChangeDetection } from '@angular/core';
import { UserApiService } from '../../services/user-service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { ComunicationService } from '../../services/comunication-service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterDataRequest } from '../../models/register-data-request';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')
  const passwordConfirm = control.get('passwordConfirm')
  if(password && passwordConfirm && password.value !== passwordConfirm.value) {
    return { passwordMismatch: true }
  }
  return null
}

@Component({
  selector: 'app-register-data-form-dialog',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './register-data-form-dialog.html',
  styleUrl: './register-data-form-dialog.css'
})
export class RegisterDataFormDialog {
  private userService = inject(UserApiService)
  private dialogRef = inject(MatDialogRef<FormDialog>)
  comunication = inject(ComunicationService)

  form = new FormGroup({
    login: new FormControl('', Validators.required),
    estado: new FormControl(1),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required),
    codp: new FormControl(this.comunication.selectedUser()?.codp)
  },
  {validators: passwordMatchValidator})

  registerDataUser() {
    const register: RegisterDataRequest = {
      login: this.form.get('login')?.value ?? '',
      estado: this.form.get('estado')?.value ?? 1,
      password: this.form.get('password')?.value ?? '',
      codp: this.form.get('codp')?.value ?? Number(this.comunication.selectedUser()?.codp)
    }

    this.userService.registerAccessData(register).subscribe({
      next: () => {
        this.comunication.notifyUsersListRefresh()
        this.close()
      },
      error: () => {
        this.close()
      }
    })
  }

  submit() {
    if(!this.form.valid) return
    this.registerDataUser()
  }

  close() {
    this.dialogRef.close()
  }
}

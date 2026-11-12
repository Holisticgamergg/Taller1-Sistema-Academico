import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserApiService } from '../../services/user-service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { ComunicationService } from '../../services/comunication-service';
import { ChangePasswordRequest } from '../../models/change-password-request';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword')
  const passwordConfirm = control.get('newPasswordConfirm')
  if(password && passwordConfirm && password.value !== passwordConfirm.value) {
    return { passwordMismatch: true }
  }
  return null
}

@Component({
  selector: 'app-modif-data-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './modif-data-form-dialog.html',
  styleUrl: './modif-data-form-dialog.css'
})
export class ModifDataFormDialog implements OnInit {
  private userService = inject(UserApiService)
  private dialogRef = inject(MatDialogRef<FormDialog>)
  comunication = inject(ComunicationService)

  form =  new FormGroup({
    login: new FormControl(''),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    newPasswordConfirm: new FormControl('', Validators.required)
  },
  { validators: passwordMatchValidator })

  ngOnInit(): void {
   this.resetFormWithLogin();
  }

  resetFormWithLogin() {
    const user = this.comunication.selectedUser();
    const loginValue = user?.user?.login ?? ''; 
    this.form.patchValue({
        login: loginValue,
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });
  }

  modifData() {
    const request: ChangePasswordRequest = {
      login: String(this.comunication.selectedUser()?.user.login),
      oldPassword: this.form.get('oldPassword')?.value ?? '',
      newPassword: this.form.get('newPassword')?.value ?? '',
    }

    this.userService.modifPassAccessData(request).subscribe({
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
    this.modifData()
  }

  close() {
    this.dialogRef.close()
  }
}

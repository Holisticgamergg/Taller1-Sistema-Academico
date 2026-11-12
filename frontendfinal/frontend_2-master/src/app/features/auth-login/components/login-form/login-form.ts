import { Component, inject, signal } from '@angular/core';
import { LogInApiService } from '../../service/login-api-service';
import { UserDetails } from '../../../../core/services/user-details';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  private loginService = inject(LogInApiService)
  private user = inject(UserDetails)
  private dialogRef = inject(MatDialogRef<FormDialog>)

  form = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  submit() {
    if(!this.form.valid) return
    const login = this.form.get('login')?.value ?? ''
    const password = this.form.get('password')?.value ?? ''
    const loginData = { login, password }
    this.loginService.logIn(loginData).subscribe({
      next: (response) => {
        this.user.setCurrentSession(response)
        this.dialogRef.close()
      }
    })
  }
}

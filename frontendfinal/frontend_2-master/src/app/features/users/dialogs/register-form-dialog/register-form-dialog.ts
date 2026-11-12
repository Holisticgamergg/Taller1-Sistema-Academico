import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { UserApiService } from '../../services/user-service';
import { MediaService } from '../../services/media-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterPersonalRequest } from '../../models/register-request';
import { ComunicationService } from '../../services/comunication-service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-register-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form-dialog.html',
  styleUrl: './register-form-dialog.css'
})
export class RegisterFormDialog {
  private dialogRef = inject(MatDialogRef<FormDialog>)
  private userService = inject(UserApiService)
  private mediaService = inject(MediaService)
  private comunication = inject(ComunicationService)
  private alertService = inject(AlertService)
  private selectedFile: File | null = null
  
  isLoading = signal(false)

  form = new FormGroup({
    cedula: new FormControl('', Validators.required),
    persona: new FormGroup({
      nombre: new FormControl('', Validators.required),
      ap: new FormControl('', Validators.required),
      am: new FormControl('', Validators.required),
      estado: new FormControl(1),
      fnac: new FormControl('', Validators.required),
      ecivil: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      direc: new FormControl('', Validators.required),
      telf: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      foto: new FormControl('')
    })
  })

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if(input.files && input.files.length > 0) {
      const file = input.files[0]
      this.selectedFile = file
      const photo = this.form.get('persona.foto')
      if(photo) {
        photo.setValue(file.name)
        photo.markAsDirty()
        photo.updateValueAndValidity()
      }
    } else {
      this.selectedFile = null
      this.form.get('persona.foto')?.setValue('')
      this.form.get('persona.foto')?.markAsDirty()
      this.form.get('persona.foto')?.updateValueAndValidity()
    }
  }

  registerPerson() {
    const registerData = this.form.value as unknown as RegisterPersonalRequest
    this.isLoading.set(true)
    
    this.userService.registerUser(registerData).subscribe({
      next: () => {
        this.alertService.showSuccess('Usuario registrado correctamente')
        this.comunication.notifyUsersListRefresh()
        this.isLoading.set(false)
        this.close()
      },
      error: () => {
        // El interceptor muestra el error con SweetAlert2, NO cerrar el diálogo
        this.isLoading.set(false)
      }
    })
  }

  submit() {
    if(this.form.invalid) return
    
    const photoControl = this.form.get('persona.foto')
    if(this.selectedFile) {
      this.isLoading.set(true)
      this.mediaService.uploadPhoto(this.selectedFile).subscribe({
        next: (response) => {
          const photoUrl = response.url
          if(photoControl) photoControl.setValue(photoUrl)
          this.registerPerson()
        }, 
        error: () => {
          // El interceptor muestra el error
          this.isLoading.set(false)
        }
      })
    } else {
      this.registerPerson()
    }
  }

  close() {
    this.dialogRef.close()
    this.form.reset()
  }
}

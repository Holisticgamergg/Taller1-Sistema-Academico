import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { UserApiService } from '../../services/user-service';
import { MediaService } from '../../services/media-service';
import { ComunicationService } from '../../services/comunication-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonRequest } from '../../models/person-request';

@Component({
  selector: 'app-modif-user-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './modif-user-form-dialog.html',
  styleUrl: './modif-user-form-dialog.css'
})
export class ModifUserFormDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<FormDialog>)
  private userService = inject(UserApiService)
  private mediaService = inject(MediaService)
  private selectedFile: File | null = null
  comunication = inject(ComunicationService)

  form = new FormGroup({
    cedula: new FormControl(''),  // Opcional - puede no estar disponible
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

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const selectedUser = this.comunication.selectedUser();
    if (!selectedUser) {
      console.warn('No hay usuario seleccionado');
      return;
    }

    // Obtener datos completos del usuario desde el backend
    this.userService.getPersonalById(selectedUser.codp).subscribe({
      next: (response: any) => {
        // El backend devuelve { persona: {...}, cedula: ... }
        const persona = response.persona || response;
        const cedula = response.cedula || '';
        
        // Formatear fecha - puede venir como string o Date
        let fechaFormateada: string = '';
        if (persona.fnac) {
          if (persona.fnac instanceof Date) {
            fechaFormateada = persona.fnac.toISOString().split('T')[0];
          } else if (typeof persona.fnac === 'string') {
            // Si viene como string, extraer solo la parte de la fecha (YYYY-MM-DD)
            fechaFormateada = persona.fnac.split('T')[0];
          }
        }

        this.form.patchValue({
          cedula: cedula,
          persona: {
            nombre: persona.nombre || '',
            ap: persona.ap || '',
            am: persona.am || '',
            estado: persona.estado ?? 1,
            fnac: fechaFormateada,
            ecivil: persona.ecivil || '',
            genero: persona.genero || '',
            direc: persona.direc || '',
            telf: persona.telf || '',
            tipo: persona.tipo || '',
            foto: persona.foto || ''
          }
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
      }
    });
  }



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

  updatePerson() {
    const idUsuario=Number(this.comunication.selectedUser()?.codp);
      const requestData = {
        cedula: this.form.get('cedula')?.value ?? '',
        persona: {
        codp: this.comunication.selectedUser()?.codp ?? 0,
        nombre: this.form.get('persona.nombre')?.value ?? '',
        ap: this.form.get('persona.ap')?.value ?? '',
        am: this.form.get('persona.am')?.value ?? '',
        estado: Number(this.form.get('persona.estado')?.value ?? 1),
        fnac: new Date(this.form.get('persona.fnac')?.value ?? ''),
        ecivil: this.form.get('persona.ecivil')?.value ?? '',
        genero: this.form.get('persona.genero')?.value ?? '',
        direc: this.form.get('persona.direc')?.value ?? '',
        telf: this.form.get('persona.telf')?.value ?? '',
        tipo: this.form.get('persona.tipo')?.value ?? '',
        foto: this.form.get('persona.foto')?.value ?? '',
        }
      }

      this.userService.updatePersonal(requestData as any, idUsuario).subscribe({
        next: (data) => {
          this.comunication.notifyUsersListRefresh()
          this.close()
        },
        error: (err) => {
          this.close()
        }
      })
    }

    submit() {
      if(!this.form.valid) return
      const photoControl = this.form.get('persona.foto')
      if(this.selectedFile) {
        this.mediaService.uploadPhoto(this.selectedFile).subscribe({
          next: (response) => {
            const photoUrl = response.url
            if(photoControl) photoControl.setValue(photoUrl)
            this.updatePerson()
          }, 
          error: (err) => {
          }
        })
      } else {
        this.updatePerson()
      }
    }

    close() {
      this.dialogRef.close()
      this.form.reset()
    }
}

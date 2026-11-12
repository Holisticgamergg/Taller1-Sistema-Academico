import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgComponentOutlet } from "@angular/common";

@Component({
  selector: 'app-form-dialog',
  imports: [NgComponentOutlet],
  templateUrl: './form-dialog.html',
  styleUrl: './form-dialog.css'
})
export class FormDialog {
  dialogRef = inject(DialogRef)
  data = inject(MAT_DIALOG_DATA) as {
    content: any
  }
}

import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [NgComponentOutlet],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog {
  dialogRef = inject(DialogRef)
  data = inject(MAT_DIALOG_DATA) as {
    content: any
  }
}

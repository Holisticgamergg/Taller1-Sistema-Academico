import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Item, ItemDto } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

export interface ItemFormDialogData {
  item?: Item;
}

@Component({
  selector: 'app-item-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './item-form-dialog.html',
  styleUrls: ['./item-form-dialog.css'],
})
export class ItemFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ItemFormDialogComponent>);
  private itemService = inject(ItemService);
  public data: ItemFormDialogData = inject(MAT_DIALOG_DATA);

  itemForm!: FormGroup;
  isEditing = false;

  ngOnInit(): void {
    this.isEditing = !!this.data.item;
    
    this.itemForm = this.fb.group({
      nombre: [this.data.item?.nombre || '', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {


      const itemDto: ItemDto = {
        nombre: this.itemForm.get('nombre')?.value || this.itemForm.get('Name')?.value // Busca el valor
      };

      if (this.isEditing && this.data.item) {
        this.itemService.update(this.data.item.codi, itemDto).subscribe({
          next: (item) => {
            this.dialogRef.close(item);
          },
          error: (error) => {
            console.error('Error actualizando item:', error);
          },
        });
      } else {
        this.itemService.create(itemDto).subscribe({
          next: (item) => {
            this.dialogRef.close(item);
          },
          error: (error) => {
            console.error('Error creando item:', error);
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

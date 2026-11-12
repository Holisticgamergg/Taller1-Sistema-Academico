import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

export interface DisableItemDialogData {
  item: Item;
}

@Component({
  selector: 'app-disable-item-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './disable-item-dialog.html',
  styleUrls: ['./disable-item-dialog.css'],
})
export class DisableItemDialogComponent {
  private dialogRef = inject(MatDialogRef<DisableItemDialogComponent>);
  private itemService = inject(ItemService);
  public data: DisableItemDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.itemService.delete(this.data.item.codi).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error deshabilitando item:', error);
        this.dialogRef.close(false);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

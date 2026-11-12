import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

export interface EnableItemDialogData {
  item: Item;
}

@Component({
  selector: 'app-enable-item-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './enable-item-dialog.html',
  styleUrls: ['./enable-item-dialog.css'],
})
export class EnableItemDialogComponent {
  private dialogRef = inject(MatDialogRef<EnableItemDialogComponent>);
  private itemService = inject(ItemService);
  public data: EnableItemDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.itemService.enable(this.data.item.codi).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error habilitando item:', error);
        this.dialogRef.close(false);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

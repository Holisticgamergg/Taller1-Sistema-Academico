import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import { FormDialog } from '../dialogs/form-dialog/form-dialog';
import { LoginForm } from '../../../features/auth-login/components/login-form/login-form';
import { DateService } from './services/date-service';
import localEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { UserDetails } from '../../../core/services/user-details';
registerLocaleData(localEs)

@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class Footer implements OnInit {
  private dateService = inject(DateService)
  user = inject(UserDetails)
  dialog = inject(MatDialog)
  date = signal<Date | null>(null)

  ngOnInit(): void {
      this.dateService.fetchDate().subscribe({
        next: (response) => {
          this.date.set(response)
        }
      })
  }

  openDialog() {
    this.dialog.open(FormDialog, {data: { content: LoginForm }})
  }
}

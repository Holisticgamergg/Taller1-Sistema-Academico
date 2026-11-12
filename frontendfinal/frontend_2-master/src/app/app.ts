import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarPage } from './shared/components/toolbar/toolbar-page/toolbar-page';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, ToolbarPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend_2');
}

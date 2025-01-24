import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cms';
  selectedFeature: string = 'documents'

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }
}

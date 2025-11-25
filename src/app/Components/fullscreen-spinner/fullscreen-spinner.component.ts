import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fullscreen-spinner',
  templateUrl: './fullscreen-spinner.component.html',
  styleUrls: ['./fullscreen-spinner.component.scss'],
})
export class FullscreenSpinnerComponent {
  @Input() show = false;
}
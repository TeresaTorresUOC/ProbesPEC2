import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
})
export class InputPasswordComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

  hide = true;
}
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss'],
})
export class InputEmailComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;
}
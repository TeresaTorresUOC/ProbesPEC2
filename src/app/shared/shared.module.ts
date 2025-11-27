import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PostCardComponent } from './components/post-card/post-card.component';
import { InputTextComponent } from './components/form-controls/input-text/input-text.component';
import { InputEmailComponent } from './components/form-controls/input-email/input-email.component';
import { InputPasswordComponent } from './components/form-controls/input-password/input-password.component';
import { InputDateComponent } from './components/form-controls/input-date/input-date.component';


@NgModule({
    declarations: [
        PostCardComponent,
        InputTextComponent,
        InputEmailComponent,
        InputPasswordComponent,
        InputDateComponent,
      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      exports: [
        PostCardComponent,
        InputTextComponent,
        InputEmailComponent,
        InputPasswordComponent,
        InputDateComponent,
      ],
})
export class SharedModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostCardComponent } from './components/post-card/post-card.component';

@NgModule({
  declarations: [PostCardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  exports: [PostCardComponent],
})
export class SharedModule {}
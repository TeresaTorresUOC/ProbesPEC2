import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostDTO } from '../../../Models/post.dto';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent {
  @Input() item!: PostDTO;
  @Input() showButtons = true;

  @Output() like = new EventEmitter<string>();
  @Output() dislike = new EventEmitter<string>();

  onLike(): void {
    if (this.item?.id) {
      this.like.emit(this.item.id);
    }
  }

  onDislike(): void {
    if (this.item?.id) {
      this.dislike.emit(this.item.id);
    }
  }

  get postImageUrl(): string | null {
    const fallbackSeed = this.item?.id ?? 'placeholder';
    return this.item?.imageUrl ?? `https://picsum.photos/seed/${fallbackSeed}/600/350`;
  }
}
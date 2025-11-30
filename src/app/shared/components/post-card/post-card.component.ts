import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryDTO } from '../../../Models/category.dto';
import { PostDTO } from '../../../Models/post.dto';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
  })
export class PostCardComponent {
  @Input() item!: PostDTO;
  @Input() showButtons = true;

  @Output() like = new EventEmitter<string>();
  @Output() dislike = new EventEmitter<string>();

  get displayCategories(): CategoryDTO[] {
    return this.item?.categories ?? [];
  }


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
    const legacyImage = (this.item as any)?.image_url as string | undefined;
    return this.item?.imageUrl ?? legacyImage ?? `https://picsum.photos/seed/${fallbackSeed}/600/350`;
  }
}
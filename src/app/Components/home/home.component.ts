import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from '../../Models/post.dto';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { selectAuthState } from '../../auth/selectors/auth.selectors';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms {{delay}}ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ], { params: { delay: 0 } }),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[];
  showButtons: boolean = false;
  private userId: string | null = null;

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
      this.store.select(selectAuthState).subscribe((auth) => {
      this.showButtons = !!auth.credentials;
      this.userId = auth.credentials?.userId ?? null;
    });

    this.loadPosts();
  }
  private loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => (this.posts = posts),
      error: (error) => this.sharedService.errorLog(error),
    });
  }

  like(postId: string): void {
    if (!this.userId) return;

    this.postService.likePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => this.sharedService.errorLog(error),
    });
  }

  dislike(postId: string): void {
    if (!this.userId) return;

    this.postService.dislikePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => this.sharedService.errorLog(error),
    });
  }

  getPostImage(post: PostDTO, index: number): string {
    return `https://picsum.photos/seed/${post.id ?? index}/600/350`;
  }
}

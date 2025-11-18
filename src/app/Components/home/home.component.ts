import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from '../../Models/post.dto';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { selectAuthState } from '../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[];
  showButtons: boolean = false;
  private userId: number | null = null;

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
      error: (error) => this.sharedService.errorLog(error.error),
    });
  }

  like(postId: string): void {
    if (!this.userId) return; 

    this.postService.likePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => this.sharedService.errorLog(error.error),
    });
  }

  dislike(postId: string): void {
    if (!this.userId) return;

    this.postService.dislikePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => this.sharedService.errorLog(error.error),
    });
  }
}

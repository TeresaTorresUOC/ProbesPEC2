import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';
import { PostDTO } from '../../../Models/post.dto';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { selectUserId } from '../../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  posts!: PostDTO[];

  constructor(
    private postService: PostService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      if (userId) {
        this.postService.getPostsByUserId(userId.toString()).subscribe({
          next: (posts) => (this.posts = posts),
          error: (error) => this.sharedService.errorLog(error),
        });
      }
    });
  }
  
  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    const confirmDelete = confirm('¿Seguro que quieres eliminar el post con id ' + postId + '?');
    if (!confirmDelete) return;

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.sharedService.managementToast('postFeedback', true, undefined);
        this.loadPosts();
      },
      error: (error) => {
        this.sharedService.managementToast('postFeedback', false, error);
        this.sharedService.errorLog(error);
      },
    });
  }
}

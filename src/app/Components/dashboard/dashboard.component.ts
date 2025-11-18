import { Component, OnInit } from '@angular/core';
import { PostService } from '../../Services/post.service';
import { PostDTO } from '../../Models/post.dto';
import { SharedService } from '../../Services/shared.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts: PostDTO[] = [];
  totalLikes = 0;
  totalDislikes = 0;

  constructor(private postService: PostService, private sharedService: SharedService) {}
  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;

        this.totalLikes = this.posts.reduce(
          (sum, post) => sum + (post.num_likes || 0),
          0
        );
        this.totalDislikes = this.posts.reduce(
          (sum, post) => sum + (post.num_dislikes || 0),
          0
        );
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
}

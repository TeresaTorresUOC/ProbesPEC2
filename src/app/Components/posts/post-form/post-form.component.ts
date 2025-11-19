import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { CategoryDTO } from '../../../Models/category.dto';
import { PostDTO } from '../../../Models/post.dto';
import { CategoryService } from '../../../Services/category.service';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { selectUserId } from '../../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  post!: PostDTO;
  categories: CategoryDTO[] = [];
  isUpdateMode: boolean = false;
  postId!: string;
  validRequest: boolean = false;
  userId!: string;

  title: FormControl;
  description: FormControl;
  publication_date: FormControl;
  categoriesSelected: FormControl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.title = new FormControl('', [Validators.required, Validators.maxLength(55)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(255)]);
    this.publication_date = new FormControl('', [Validators.required]);
    this.categoriesSelected = new FormControl([], [Validators.required]);

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categoriesSelected: this.categoriesSelected,
    });

    // Ens subscrivim al userId del store
    this.store.select(selectUserId).subscribe((id) => {
      if (id) this.userId = id;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.publication_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.postId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';

    if (this.postId) {
      this.isUpdateMode = true;
      this.loadPost();
    }
  }

  private loadCategories(): void {
    if (this.userId) {
      this.categoryService.getCategoriesByUserId(this.userId).subscribe({
        next: (categories) => (this.categories = categories),
        error: (error) => this.sharedService.errorLog(error.error),
      });
    }
  }

  private loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (postData) => {
        this.title.setValue(postData.title);
        this.description.setValue(postData.description);
        this.publication_date.setValue(formatDate(postData.publication_date, 'yyyy-MM-dd', 'en'));
        this.categoriesSelected.setValue(postData.categories.map((c) => c.categoryId));
      },
      error: (error) => this.sharedService.errorLog(error.error),
    });
  }

  private editPost(): void {
    const postData = { id: this.postId, ...this.postForm.value, userId: this.userId };

    this.postService.updatePost(this.postId, postData).subscribe({
      next: () => {
        this.validRequest = true;
        this.sharedService.managementToast('postFeedback', true, undefined);
        this.router.navigateByUrl('/user/posts');
      },
      error: (error) => {
        this.validRequest = false;
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('postFeedback', false, error.error);
      },
    });
  }

  private createPost(): void {
    const postData = { ...this.postForm.value };
    postData.userId = this.userId;
    postData.num_likes = 0;
    postData.num_dislikes = 0;

    if (!postData.publication_date) {
      postData.publication_date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    }

    this.postService.createPost(postData).subscribe({
      next: () => {
        this.validRequest = true;
        this.sharedService.managementToast('postFeedback', true, undefined);
        this.router.navigateByUrl('/user/posts');
      },
      error: (error) => {
        this.validRequest = false;
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('postFeedback', false, error.error);
      },
    });
  }

  savePost(): void {
    if (this.postForm.invalid) return;
    if (this.isUpdateMode) this.editPost();
    else this.createPost();
  }
}

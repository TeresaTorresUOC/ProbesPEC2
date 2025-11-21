import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { SharedService } from '../../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { selectUserId } from '../../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;
  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;
  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;
  private userId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);
    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);
    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });

    
    this.store.select(selectUserId).subscribe((id) => (this.userId = id ?? null));
  }

  ngOnInit(): void {
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.category = category;
          this.title.setValue(this.category.title);
          this.description.setValue(this.category.description);
          this.css_color.setValue(this.category.css_color);
        },
        error: (error) => this.sharedService.errorLog(error),
      });
    }
  }

  private editCategory(): void {
    if (this.categoryId && this.userId) {
      const updatedCategory = { id: this.categoryId, ...this.categoryForm.value, userId: this.userId };
      this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('categoryFeedback', true, undefined);
          this.router.navigateByUrl('/user/categories');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error);
        },
      });
    }
  }

  private createCategory(): void {
    if (this.userId) {
      const newCategory = { ...this.categoryForm.value, userId: this.userId };
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('categoryFeedback', true, undefined);
          this.router.navigateByUrl('/user/categories');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error);
        },
      });
    }
  }

  async saveCategory() {
    this.isValidForm = this.categoryForm.valid;
    if (!this.isValidForm) return;
    if (this.isUpdateMode) this.editCategory();
    else this.createCategory();
  }
}

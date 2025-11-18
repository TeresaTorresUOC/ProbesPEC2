import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { SharedService } from '../../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { selectUserId } from '../../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      if (userId) {
        this.categoryService.getCategoriesByUserId(userId).subscribe({
          next: (categories) => (this.categories = categories),
          error: (error) => this.sharedService.errorLog(error.error),
        });
      }
    });
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    const confirmDelete = confirm(
      '¿Seguro que quieres eliminar la categoría con id: ' + categoryId + '?'
    );
    if (!confirmDelete) return;

    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.sharedService.managementToast('categoryFeedback', true, undefined);
        this.loadCategories();
      },
      error: (error) => {
        this.sharedService.managementToast('categoryFeedback', false, error.error);
        this.sharedService.errorLog(error.error);
      },
    });
  }
}

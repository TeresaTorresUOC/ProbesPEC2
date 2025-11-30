import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { SharedService } from '../../../Services/shared.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { selectUserId } from '../../../auth/selectors/auth.selectors';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  name: UntypedFormControl;
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
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.name = new UntypedFormControl(this.category.title, [
      Validators.required,
    ]);
    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.minLength(5),
    ]);
    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.pattern(/^#([A-Fa-f0-9]{6})$/),
    ]);

    this.categoryForm = this.formBuilder.group({
      name: this.name,
      description: this.description,
      css_color: this.css_color,
    });

    
    this.store.select(selectUserId).subscribe((id) => (this.userId = id ?? null));
  }
  get showErrors(): boolean { return this.isValidForm === false || this.categoryForm.touched;
  }


  ngOnInit(): void {
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.category = category;
          this.name.setValue(this.category.title);
          this.description.setValue(this.category.description);
          this.css_color.setValue(this.category.css_color);
        },
        error: (error) => this.sharedService.errorLog(error),
      });
    }
  }

  private editCategory(): void {
    if (this.categoryId && this.userId) {
      const { name, description, css_color } = this.categoryForm.value;
      const updatedCategory: CategoryDTO = {
        categoryId: this.categoryId,
        title: name,
        description,
        css_color,
        userId: this.userId,
      };

      this.notificationService.showInfo('Guardando cambios...');
      this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
        next: () => {
          this.validRequest = true;
          this.notificationService.showSuccess('Categoria actualitzada correctament');
          this.router.navigateByUrl('/user/categories');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error);
          this.notificationService.showError('Error al actualizar la categoría');
        },
      });
    }
  }

  private createCategory(): void {
    if (this.userId) {
      const { name, description, css_color } = this.categoryForm.value;
      const newCategory: CategoryDTO = {
        categoryId: '',
        title: name,
        description,
        css_color,
        userId: this.userId,
      };

      this.notificationService.showInfo('Guardando cambios...');
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.validRequest = true;
          this.notificationService.showSuccess('Categoría creada correctamente');
          this.router.navigateByUrl('/user/categories');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error);
          this.notificationService.showError('Error al crear la categoría');
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

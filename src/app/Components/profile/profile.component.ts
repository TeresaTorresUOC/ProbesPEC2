import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';
import { UserDTO } from '../../Models/user.dto';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { selectUserId } from '../../auth/selectors/auth.selectors';
import { optionalMinLengthValidator } from '../../Validators/optional-min-length.validator';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;
  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;
  profileForm: FormGroup;
  isValidForm: boolean | null;
  userId!: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {
    this.profileUser = {} as UserDTO;
    this.isValidForm = null;

    this.name = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_1 = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_2 = new FormControl('', [optionalMinLengthValidator(5), Validators.maxLength(25)]);
    this.alias = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.birth_date = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });

    this.store.select(selectUserId).subscribe((id) => {
      if (id) this.userId = id;
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUserById(String(this.userId)).subscribe({
        next: (userData) => {
          this.profileForm.patchValue({
            name: userData.name,
            surname_1: userData.surname_1,
            surname_2: userData.surname_2,
            alias: userData.alias,
            birth_date: formatDate(userData.birth_date, 'yyyy-MM-dd', 'en'),
            email: userData.email,
          });
        },
        error: (error) => this.sharedService.errorLog(error),
      });
    }
  }

  updateUser(): void {
    if (this.profileForm.invalid) return;

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    if (this.userId) {
      this.notificationService.showInfo('Actualitzant perfil...');
      this.userService.updateUser(String(this.userId), this.profileUser).subscribe({
        next: () => {
          this.notificationService.showSuccess('Perfil actualitzat correctament');
        },
        error: (error) => {
          this.sharedService.errorLog(error);
          this.notificationService.showError('Error en actualitzar el perfil');
        },
      });
    }
  }
}

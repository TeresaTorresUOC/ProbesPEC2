import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { optionalMinLengthValidator } from '../../Validators/optional-min-length.validator';
import { NotificationService } from '../../shared/services/notification.service';

import { forkJoin, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerUser: any;
  isValidForm = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      surname_1: ['', [Validators.required, Validators.minLength(3)]],
      surname_2: ['', [optionalMinLengthValidator(3)]],
      alias: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birth_date: [new Date()],
    });
  }
  getControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.isValidForm = false;
      this.registerForm.markAllAsTouched();
      this.notificationService.showError('Error al guardar los datos');
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;
    const { name, email } = this.registerForm.value;

    this.notificationService.showInfo('Guardando cambios...');

    forkJoin({
      emailUsers: this.userService.getUsersByEmail(email),
      nameUsers: this.userService.getUsersByName(name),
    })
      .pipe(
        switchMap(({ emailUsers, nameUsers }) => {
          if (emailUsers.length > 0) {
            this.isValidForm = false;
            this.notificationService.showError('Error al guardar los datos');

            return EMPTY;
          }

          if (nameUsers.length > 0) {
            this.isValidForm = false;
            this.notificationService.showError('Error al guardar los datos');
            return EMPTY;
          }

          return this.userService.register(this.registerUser);
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Registro completado');
          this.registerForm.reset({
            name: '',
            surname_1: '',
            surname_2: '',
            alias: '',
            email: '',
            password: '',
            birth_date: new Date(),
          });
          this.router.navigateByUrl('home');
        },
        error: (error) => {
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.headerMenusService.headerManagement.next(headerInfo);
          this.sharedService.errorLog(error);
          this.notificationService.showError('Error al guardar los datos');
        },
      });
  }
}

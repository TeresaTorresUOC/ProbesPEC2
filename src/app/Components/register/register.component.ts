import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup,Validators,ReactiveFormsModule,} from '@angular/forms';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';
import { HeaderMenus } from '../../Models/header-menus.dto';
import { optionalMinLengthValidator } from '../../Validators/optional-min-length.validator';


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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      surname_1: ['', [Validators.required, Validators.minLength(3)]],
      surname_2: ['', [optionalMinLengthValidator(3)]],
      alias: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birth_date: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.isValidForm = false;
      this.registerForm.markAllAsTouched();
      this.sharedService.managementToast(
        'registerFeedback',
        false,
        'Revisa los campos obligatorios e inténtalo de nuevo.'
      );
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;
    const { name, email } = this.registerForm.value;

    forkJoin({
      emailUsers: this.userService.getUsersByEmail(email),
      nameUsers: this.userService.getUsersByName(name),
    })
      .pipe(
        switchMap(({ emailUsers, nameUsers }) => {
    
          if (emailUsers.length > 0) {
            this.isValidForm = false;
            this.sharedService.managementToast(
              'registerFeedback',
              false,
              'El correo electrónico ya está registrado.'
            );

            return EMPTY;
          }

          if (nameUsers.length > 0) {
            this.isValidForm = false;
            this.sharedService.managementToast(
              'registerFeedback',
              false,
              'El nombre de usuario ya está en uso.'
            );
            return EMPTY;
          }

          return this.userService.register(this.registerUser);
        })
      )
      .subscribe({
        next: () => {
          this.sharedService.managementToast('registerFeedback', true, undefined);
          this.registerForm.reset({
            name: '',
            surname_1: '',
            surname_2: '',
            alias: '',
            email: '',
            password: '',
            birth_date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
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
          this.sharedService.managementToast('registerFeedback', false, error);
        },
      });
  }
}

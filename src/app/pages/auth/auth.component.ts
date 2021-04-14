import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { SignUpSuccessComponent } from 'src/app/components/dialogs/sign-up-success/sign-up-success.component';
import { LoginModel, SignUpModel } from 'src/app/core/models/auth';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  onDestroy = new Subject()
  login = true;
  loginForm: FormGroup = new FormGroup({});
  signUpForm: FormGroup = new FormGroup({});
  errors: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForms();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  createForms(): void {
    if (this.login) {
      this.loginForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
    } else {
      this.signUpForm = new FormGroup({
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      });
    }
  }

  loginAction(): void {
    this.resetErrors();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const login: LoginModel = this.loginForm.value;
    this.authService.login(login.email, login.password)
      .then(res => {
        if (!res.user) {
          this.errors.push('Error: Login failed, try again...');
          return;
        }
        this.userService.getUser(res.user?.uid)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            if (res.exists) {
              const user = res.data() as User;
              this.authService.saveLoginData(user);
              this.router.navigate(['']);
            }
          }, err => {
            this.errors.push(err);
          });
      }).catch(err => {
        this.resetErrors();
        this.errors.push(err?.message);
      });
  }

  signUpAction(): void {
    this.resetErrors();
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.errors.push('Error: Fill all the required fields')
      return;
    }
    const signUp: SignUpModel = this.signUpForm.value;
    if (signUp.password !== signUp.confirmPassword) {
      this.errors.push('Password and Confirm password not match');
      return;
    }
    this.authService.register(signUp.email, signUp.password)
      .then(async res => {
        const successDialog = this.dialog.open(SignUpSuccessComponent, {
          closeOnNavigation: true,
          data: {
            message: 'Sign up success!!!'
          }
        });
        await this.createNewUser(res.user?.uid, signUp);
        this.login = true;
        this.createForms();
        setTimeout(() => {
          successDialog.close();
        }, 2000);
      }).catch(err => {
        this.errors.push(err?.message);
      })
  }

  toggleForm(): void {
    this.resetErrors();
    this.login = !this.login;
    this.createForms();
  }

  resetErrors(): void {
    this.errors = [];
  }

  createNewUser(uid: string | undefined, signUp: SignUpModel) {
    const date = new Date();
    const user: User = {
      uid: uid || '',
      email: signUp.email,
      username: signUp.username,
      created: date.getTime(),
      updated: date.getTime()
    }
    return this.userService.createUpdateUser(user);
  }
}

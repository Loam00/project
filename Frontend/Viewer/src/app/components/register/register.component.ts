import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {};

  ngOnInit(): void {
    this.registerForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)])
    });
  }

  register(): void {
    this.authService
    .register(this.registerForm.value)
    .subscribe((msg) => console.log(msg));
    /* this.router.navigate(["login"]); */
  }

}

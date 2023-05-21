import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmpassword: ['', Validators.required],
  }, { validator: this.checkPasswords })

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private messageService: MessageService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  handleSubmit(form: FormGroup) {
    form.markAllAsTouched()

    if(!form.valid) return 

    const { confirmpassword, ...data } = form.value
    this.authService.signUp(data).subscribe({
      next: () => {
        this.router.navigate(['/', 'login'])
      },
      error: ({ error }) => {
        this.messageService.add({severity:'error', summary:'Failed', detail: error.message });
      },
    })
  }

  checkPasswords(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmpassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
}

}

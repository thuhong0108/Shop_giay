import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { USER_KEY } from 'src/app/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private messageService: MessageService,
    private router: Router
    ) {}

  ngOnInit(): void {
  }

  handleSubmit(form: FormGroup) {
    form.markAllAsTouched()

    if (!form.valid) return

    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {
        const user = res.data as User
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        this.authService.loggedInUser.next(user)

        if (user.isAdmin) {
          this.router.navigate(['/admin'])
        } else {
          this.router.navigate(['/'])
        }
      },
      error: ({ error }) => {
        this.messageService.add({severity:'error', summary:'Failed', detail: error.message });
      }
    })
  }

}

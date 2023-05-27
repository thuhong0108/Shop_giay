import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { USER_KEY } from 'src/app/constants';
import { User } from 'src/app/models/user';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup
  user!: User

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private productService: ProductService
    ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      phone: ['', ],
      address: ['', ],
    })
  }

  ngOnInit(): void {
    this.user = this.userService.getUserStorage()
    this.form.patchValue(this.user)
  }

  handleSubmit(form: FormGroup) {
    const newUser = { ...this.user, ...form.value }
    this.userService.editUser(newUser).subscribe((res: any) => {
      const user = res.data
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      this.userService.loggedInUser$.next(user)

      this.productService.displayMessage('Successfully', 'User edited')
    })
  }

}

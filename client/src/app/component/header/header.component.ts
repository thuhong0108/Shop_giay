import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { USER_KEY } from '../../constants/index';
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartQuantity!: number
  user!: User | null

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userService.loggedInUser$.subscribe(user => {
      this.user = user as User
    })
  }

  ngOnInit(): void {
    this.user = this.userService.getUserStorage()

    this.cartQuantity = this.cartService.getCartQuantity()
    this.cartService.cartQuantity$.subscribe(value => {
      this.cartQuantity = value
    })
  }

  handleLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        localStorage.removeItem(USER_KEY)
        this.userService.loggedInUser$.next(null)
        
        this.router.navigateByUrl('/')
        this.messageService.add({severity:'success', summary:'Confirmed', detail:'Log out successfully'})
      },
      reject: () => {
        this.confirmationService.close()
      }
    })
  }

  handleNavigateProfile() {
    this.router.navigateByUrl(`/profile/${this.user?._id}`)
  }
}

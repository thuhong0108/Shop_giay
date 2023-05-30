import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CART_KEY } from 'src/app/constants';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartList: any[] = []
  cartListTemp: any[] = []
  columns: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'price', header: 'Price' },
    { field: 'quantity', header: 'quantity' },
    { field: 'size', header: 'Size' },
    { field: 'total', header: 'Total' }
  ]
  searchValue = ''

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService, 
    public confirmationService: ConfirmationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.cartList = this.cartService.getCartListStorage()
    this.cartListTemp = this.cartList
  }

  formatPrice(price: number): string {
    return this.productService.formatVND(price)
  }

  handleTotalPrice(): string {
    return this.formatPrice(this.cartList?.reduce((total, cur) => total += cur.price * cur.quantity , 0))
  }

  handleChangequantity(product: any, newquantity: number): void {
    if (newquantity < 1) {
      return
    }
  
    this.cartList = this.cartList.map(item => {
      if (item._id === product._id && item.size === product.size) {
        item.quantity = newquantity
      }
      return item
    })

    localStorage.setItem(CART_KEY, JSON.stringify(this.cartList))
    this.cartService.handleChangeCartQuantity()
  }
  
  handleDelete(id: string, size: number): void { 
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete product?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {   
        this.cartList = this.cartList.filter(item => (item._id === id && item.size !== size) || item._id !== id)
        this.cartListTemp = this.cartList

        localStorage.setItem(CART_KEY, JSON.stringify(this.cartList))
        this.cartService.handleChangeCartQuantity()

        this.productService.displayMessage('Deleted product', 'Successfully')     
      }
    })
  }

  handlePayment(): void {
    const user = this.userService.getUserStorage()
    if (!user) {
      this.router.navigateByUrl('/login')
    } else if(!user.phone || !user.address){
      this.router.navigateByUrl(`/profile/${user._id}`)
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure you want to pay for all products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {   
          this.cartList = []
          this.cartListTemp = []
  
          this.cartService.cartQuantity$.next(0)
          localStorage.removeItem(CART_KEY)  
  
          this.productService.displayMessage('Successful payment', 'Successfully')
        }
      })
    }

  }

  handleSearchChange(e: any): void {
    const searchValue = e.target.value
    this.cartList = this.cartListTemp.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
  }
}

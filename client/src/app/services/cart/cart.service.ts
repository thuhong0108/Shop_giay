import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CART_KEY } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    cartQuantity$ = new Subject<number>()

    getCartQuantity(): number {
      const cartList = this.getCartListStorage()
      const quantity = cartList?.reduce((total, item) => total += item.quantity, 0)
      return quantity
    }

    handleChangeCartQuantity(): void {
      const quantity = this.getCartQuantity()
      this.cartQuantity$.next(quantity)
    }

    getCartListStorage(): any[] {
      const cartsJSON: any = localStorage.getItem(CART_KEY)
      return cartsJSON !== null ? JSON.parse(cartsJSON) : []
    }
}

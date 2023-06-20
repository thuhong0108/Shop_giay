import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CART_KEY } from 'src/app/constants';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product!: Product
  sizeList = [36, 37, 38, 39, 40, 41, 42]
  cartList: any[] = []
  sizeSelected = this.sizeList[0]
  quantity: number = 1


  constructor(
    public productService: ProductService, 
    private cartService: CartService, 
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getProduct()
  }

  getProduct() {
    let id = this.route.snapshot.paramMap.get('id')
    this.productService.getProduct(id).subscribe(res => {
      this.product = res.data
    })
  }

  handleChooseSize(size: number) {
    this.sizeSelected = size
  }

  hanldeAddToCart() {
    if (this.quantity < 1 || this.quantity > 10) {
      this.productService.displayMessage('Quantity must be from 1 to 10', 'Error', 'error')
      return
    }

    this.cartList = this.cartService.getCartListStorage()
    const product = this.cartList.find(item => item._id === this.product._id && item.size === this.sizeSelected)
    
    let newCarts
    if (product) {
      newCarts = this.cartList.map(item => {
        if(item._id === product._id && item.size === this.sizeSelected) {
          item.quantity += this.quantity
        }
        return item
      })
    } else {
      let newProduct = {
        ...this.product, 
        size: this.sizeSelected,
        quantity: this.quantity
      }
      newCarts = [ ...this.cartList, newProduct ]
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(newCarts))
    this.cartService.handleChangeCartQuantity()

    this.sizeSelected = this.sizeList[0]
    this.quantity = 1

    this.productService.displayMessage('Added to cart', 'Successfully')
  }
}
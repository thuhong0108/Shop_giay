import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = []
  productsTemp: Product[] = []

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts() 
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(res => {
      this.products = res.data as Product[]
      this.productsTemp = this.products
    })
  }

  handleSearchChange(e: any) {
    const searchValue = e.target.value
    this.products = this.productsTemp.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

}

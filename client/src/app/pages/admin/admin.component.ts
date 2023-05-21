import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/api';
import { concatMap } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = []
  productsTemp: Product[] = []
  image: string = ''
  file!: File;
  isVisible: boolean = false

  form: FormGroup = this.fb.group({
    _id: [''],
    name: ['', Validators.required], 
    description: ['', Validators.required],
    price: ['', Validators.required]
  })

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
    )
     { }

  ngOnInit(): void {
    this.getProducts()
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl)
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res.data as Product[]
      this.productsTemp = this.products
    })
  }

  openNew() {
    this.isVisible = true
    this.form.reset()
    this.image = ''
  }
 
  editProduct(product: Product) {
    this.isVisible = true
    this.form.patchValue(product)
    this.image = product.image
  }

  hideDialog() {
    this.isVisible = false
  }

  // CHOOSE FILE IMAGE
  handleSelectImage(event: any) {
    const files = event.files
    this.file = files[0]
    this.image = URL.createObjectURL(files[0])
  }

  saveProduct(form: FormGroup) {
    form.markAllAsTouched()
    
    if (!form.valid) return

    if (form.value._id) {  // EDIT PRODUCT
      const product = form.value
      this.productService.editProduct(product).subscribe({
        next: (() => {
          this.isVisible = false
          this.productService.displayMessage('Successfully', 'Product edited')
          this.getProducts()
        }),
        error: (error => {
          this.productService.displayMessage('Error', error.message, 'error')
        })
      })
    } else {  // CREATE PRODUCT
      if (this.image) {
        this.productService.uploadImage(this.file)
          .pipe(concatMap(file => this.productService.addProduct({ ...form.value, image: file.secure_url }) ))
          .subscribe({
            next: (() => {
              this.isVisible = false
              this.getProducts()
              this.productService.displayMessage('Successfully', 'Product created')
            }),
            error: (error => {
              this.productService.displayMessage('Error', error.message, 'error')
          })
        })
      } else {
        this.productService.displayMessage('Please choose image', 'Error', 'error')
      }
    }
  }

  handleDeleteProduct(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: (() => {
            this.isVisible = false
            this.productService.displayMessage('Successfully', 'Product deleted')
            this.getProducts()
          }),
          error: (error => {
            this.productService.displayMessage('Error', error.message, 'error')
          })
        })
        this.confirmationService.close()
      },
      reject: () => {
        this.confirmationService.close()
      }
    })
  }

  handleSearchChange(e: any) {
    const searchValue = e.target.value
    this.products = this.productsTemp.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
  }
}

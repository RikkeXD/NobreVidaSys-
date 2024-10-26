import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect'
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/ProductModel';
import { EmpresasLista, UsuarioEmpresas } from '../../../core/models/EnterpriseModel';
import { ProductService } from '../../../core/services/product.service';
import { DropdownModule } from 'primeng/dropdown';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-lista-produto',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    DialogModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    MultiSelectModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-produto.component.html',
  styleUrl: './lista-produto.component.scss'
})
export class ListaProdutoComponent {
  empresas!: EmpresasLista[]
  selectedEmpresa!: EmpresasLista
  empresaIdSelected!: number

  productDialog: boolean = false;
  products!: Product[];
  selectedProduct!: Product;

  private formBuilderService = inject(NonNullableFormBuilder)
  private productService = inject(ProductService)
  private usuarioService = inject(UsuarioService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)


  ngOnInit() {
    this.usuarioService.listarEmpresa().subscribe((empresas) => {
      this.empresas = empresas.empresas.map(empresa => ({
          name: empresa.razao_social,
          code: empresa.id
      }))

      if (empresas.empresaPrincipalId) {
          this.selectedEmpresa = this.empresas.find(
            (empresa) => empresa.code === empresas.empresaPrincipalId
          )!;
          this.empresaIdSelected = this.selectedEmpresa.code
        } else {
          this.selectedEmpresa = this.empresas[0];
        }
        this.searchProduct()
  })
  }

  empresaSelected(event: any) {
    this.empresaIdSelected = event.value.code
    this.searchProduct()
  }

  searchProduct() {
    this.productService.listar(this.empresaIdSelected).subscribe({
      next: (res) => {
        this.products = res
        console.log(res)
      },

      error: (error) => {
        this.products = []
      }
    })
  }

  protected form = this.formBuilderService.group({
    id: [0],
    nome: ['', Validators.required],
    cod_barras: ['', Validators.required],
    fornecedor: ['', Validators.required],
    peso: ['', Validators.required],
    empresas: [<EmpresasLista[]>[], Validators.required]
  })

  hideDialog() {
    this.productDialog = false
  }

  editProduct(product: Product) {
    this.form.patchValue({
      id: product.id,
      nome: product.nome,
      cod_barras: product.cod_barras,
      fornecedor: product.fornecedor,
      peso: product.peso,
      empresas: product.empresas.map((empresa) => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
    this.productDialog = true
  }
  deleteProduct(event: Event, product: Product) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir este produto?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.productService.delete(product).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto deletado com sucesso!' })
            this.productService.listar(this.empresaIdSelected).subscribe((data) => {
              this.products = data;
            });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
          }
        })
      }
    })
  }
  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!" })
      return;
    }
    this.productService.edit({
      id: this.form.value.id!,
      nome: this.form.value.nome!,
      cod_barras: this.form.value.cod_barras!,
      fornecedor: this.form.value.fornecedor!,
      peso: this.form.value.peso!,
      empresas: this.form.value.empresas!.map((empresa) => ({
        id: empresa.code,
        razao_social: empresa.name,
      }))
    }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto editado com sucesso!' })
        this.hideDialog()
        this.searchProduct()
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
      }
    })
  }

}

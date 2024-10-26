import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProductService } from '../../../core/services/product.service';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cad-produto',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    KeyFilterModule,
    InputTextModule,
    InputMaskModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './cad-produto.component.html',
  styleUrl: './cad-produto.component.scss'
})
export class CadProdutoComponent {

  empresas!: EmpresasLista[]
  selectedEmpresas!: EmpresasLista[]

  private productService = inject(ProductService)
  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private usuarioService = inject(UsuarioService)
  
  protected form = this.formBuilderService.group({
    nome: ['', Validators.required],
    cod_barras: ['', Validators.required],
    peso: ['', Validators.required],
    fornecedor: ['', Validators.required],
    empresas: [<EmpresasLista[]>[], Validators.required]
  })

  ngOnInit(){
    this.usuarioService.listarEmpresa().subscribe((empresas) => {
      this.empresas = empresas.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id
      }))
    })
  }

  onSubmit(){
      if(this.form.invalid){
        this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
        return;
      }
      this.productService.create({
        nome: this.form.controls.nome.value,
        cod_barras: this.form.controls.cod_barras.value,
        peso: this.form.controls.peso.value,
        fornecedor: this.form.controls.fornecedor.value,
        empresas: this.form.value.empresas!.map((empresas: EmpresasLista) => ({
          id: empresas.code,
          razao_social: empresas.name,
        }))
      }).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Produto cadastrado com sucesso!'})
          this.form.reset()
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setErrors(null)
          })
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message});
        }
      })
    
  }

}

import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidadorPassword } from '../../../utils/validatorsCustom';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { Address } from '../../../core/models/AddressModel';
import { ApiEnderecoService } from '../../../core/services/api-endereco.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Enterprise } from '../../../core/models/EnterpriseModel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { convertEmpresa } from '../../../utils/convertEmpresaModel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cad-empresa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    InputNumberModule,
    KeyFilterModule
  ],
  templateUrl: './cad-empresa.component.html',
  styleUrl: './cad-empresa.component.scss'
})
export class CadEmpresaComponent {

  typeTel: boolean = false
  image!: string | null

  @ViewChild('fileUpload') fileUpload: any;

  style: { [klass: string]: any } = { 'width': '355%' };
  styleEmail: { [klass: string]: any } = { 'width': '180%' };
  styleTel: { [klass: string]: any } = { 'width': '139%' };
  styleCep: { [klass: string]: any } = { "width": "101%" };

  private apiEndereco = inject(ApiEnderecoService)
  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private empresaService = inject(EmpresaService)

  protected form = this.formBuilderService.group({
    razao_social: ['', Validators.required],
    cnpj: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.minLength(5)]],
    endereco: ['', Validators.required],
    numero: ["", Validators.required],
    cep: ["", Validators.required],
    bairro: ["", Validators.required],
    uf: ["", Validators.required],
    cidade: ["", Validators.required],
    complemento: [""]
  }, {
    validators: [ValidadorPassword.ValidatePassword]
  })

  verificarTecla(event: KeyboardEvent): void {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }

  searchAddress() {
    if (this.form.controls.cep.value) {
      this.apiEndereco.searchAddress(this.form.controls.cep.value.replace(/^-/g, '')).subscribe({
        next: (response: Address) => {
          this.form.patchValue({
            endereco: response.endereco,
            numero: response.numero,
            bairro: response.bairro,
            uf: response.uf,
            cidade: response.cidade,
          })
        },
        error: (error) => {
          this.form.controls.cep.reset()
          this.form.controls.bairro.reset()
          this.form.controls.endereco.reset()
          this.form.controls.cidade.reset()
          this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "CEP invalído"})
        }
      })
    }
    return
  }

  loadImage(event: any) {
    let file = event.currentFiles[0]
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string
    }
    reader.readAsDataURL(file)
  }
  removeImage() {
    this.image = null
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
      return;
    }
    this.empresaService.create(convertEmpresa(this.form.value, this.image)).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Empresa cadastrada com sucesso!'})
        this.removeImage()
        this.form.reset()
        this.fileUpload.clear();
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message});
      }
    })

  }

}

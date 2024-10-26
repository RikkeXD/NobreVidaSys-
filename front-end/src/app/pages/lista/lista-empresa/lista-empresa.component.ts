import { Component, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enterprise } from '../../../core/models/EnterpriseModel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { EmpresaService } from '../../../core/services/empresa.service';
import { ValidateUF } from '../../../utils/validatorsCustom';
import { Address } from '../../../core/models/AddressModel';
import { ImageModule } from 'primeng/image';
import { ApiEnderecoService } from '../../../core/services/api-endereco.service';
import { FileUploadModule } from 'primeng/fileupload';
import { convertEmpresa } from '../../../utils/convertEmpresaModel';

@Component({
  selector: 'app-lista-empresa',
  standalone: true,
  imports: [
    TableModule,
    HttpClientModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ToggleButtonModule,
    InputMaskModule,
    ImageModule,
    FileUploadModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-empresa.component.html',
  styleUrl: './lista-empresa.component.scss'
})
export class ListaEmpresaComponent {

  @ViewChild('fileUpload') fileUpload: any

  userDialog: boolean = false;
  empresas!: Enterprise[];
  selectedEmpresa!: Enterprise;
  typeTel: boolean = false;
  imageUpload: boolean = false
  image!: string | null

  private formBuilderService = inject(NonNullableFormBuilder)
  private empresaService = inject(EmpresaService)
  private apiEndereco = inject(ApiEnderecoService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)

  protected form = this.formBuilderService.group({
    id: [0],
    razao_social: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    cnpj: ["", Validators.required],
    image: [''],
    endereco: ['', Validators.required],
    cep: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    uf: ['', [Validators.required, ValidateUF]],
    cidade: ['', Validators.required],
    complemento: [''],
  })

  ngOnInit() {
    this.empresaService.list().subscribe((empresa) => {
      this.empresas = empresa
    })
  }

  searchAddress() {
    if (this.form.controls.cep.value) {
      this.apiEndereco.searchAddress(this.form.controls.cep.value.replace(/^-/g, '')).subscribe({
        next: (response: Address) => {
          this.form.patchValue({
            endereco: response.endereco,
            bairro: response.bairro,
            cep: response.cep,
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

  modifyInputTel(): void {
    this.typeTel = !this.typeTel
  }

  verifyTel(tel: string) {
    if (tel.length == 14) {
      this.typeTel = true
    } else {
      this.typeTel = false
    }
    return
  }

  modifyImg() {
    if (this.image) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Primeiro remova a imagem carregada!"})
      return;
    }
    this.imageUpload = !this.imageUpload
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

  hideDialog() {
    this.userDialog = false;
  }

  deleteEmpresa(event: Event, empresa: Enterprise) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir esta empresa?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptLabel:'Sim',
      rejectLabel:'Não',
      accept: () => {
          this.empresaService.delete(empresa).subscribe({
              next: (response) => {
                this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente deletado com sucesso!'})
                      this.empresaService.list().subscribe((empresa) => {
                          this.empresas = empresa;
                      });
              },
              error: (error) => {
                  console.log("Ocorreu um erro: ", error)
                  this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
              }
          })
      }
  })
  }


  editEmpresa(empresa: Enterprise) {
    this.userDialog = true;
    this.verifyTel(empresa.telefone)
    this.form.patchValue({
      id: empresa.id,
      razao_social: empresa.razao_social,
      telefone: empresa.telefone,
      email: empresa.email,
      cnpj: empresa.cnpj,
      image: empresa.image!,
      endereco: empresa.endereco.endereco,
      cep: empresa.endereco.cep,
      numero: empresa.endereco.numero,
      bairro: empresa.endereco.bairro,
      uf: empresa.endereco.uf,
      cidade: empresa.endereco.cidade,
      complemento: empresa.endereco.complemento!,
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
      return;
    }
    this.empresaService.edit(convertEmpresa(this.form.value, this.image)).subscribe({
      next: () => {
        this.empresaService.list().subscribe((data) => {
          this.empresas = data
        })
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Empresa alterada com sucesso!'})
        this.imageUpload = false
        this.hideDialog()
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
      }
    })

  }

}

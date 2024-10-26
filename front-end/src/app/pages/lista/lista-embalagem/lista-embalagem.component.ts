import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputMaskModule } from 'primeng/inputmask';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Packing } from '../../../core/models/PackingModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { PackingService } from '../../../core/services/packing.service';
import { TreeSelectModule } from 'primeng/treeselect';
import { KeyFilterModule } from 'primeng/keyfilter';


@Component({
  selector: 'app-lista-embalagem',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    ButtonModule,
    InputMaskModule,
    ToggleButtonModule,
    CommonModule,
    MultiSelectModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RippleModule,
    TreeSelectModule,
    InputTextModule,
    KeyFilterModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-embalagem.component.html',
  styleUrl: './lista-embalagem.component.scss'
})
export class ListaEmbalagemComponent implements OnInit {

  empresas!: EmpresasLista[]
  selectedEmpresa!: EmpresasLista
  empresaIdSelected!: number
  editSelectEmpresa!: EmpresasLista[]

  embalagens!: Packing[];
  selectedEmbalagem!: Packing;
  embalagemDialog: boolean = false;
  submitted: boolean = false;

  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)
  private usuarioService = inject(UsuarioService)
  private embalagemService = inject(PackingService)

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
          this.empresaIdSelected = this.selectedEmpresa.code
        }
        this.searchEmbalagem()
  })
  }

  protected form = this.formBuilderService.group({
    id: [0],
    nome: ['', Validators.required],
    altura: [0, Validators.required],
    comprimento: [0, Validators.required],
    largura: [0, Validators.required],
    peso: [0, Validators.required],
    empresas: [<EmpresasLista[]>[], Validators.required],
  })

  empresaSelected(event: any) {
    this.empresaIdSelected = event.value.code
    this.searchEmbalagem()
  }

  searchEmbalagem() {
    this.embalagemService.listar(this.empresaIdSelected).subscribe({
      next: (res) => {
        this.embalagens = res
      },
      error: (error) => {
        this.embalagens = []
      }
    })
  }

  editProduct(embalagem: Packing) {
    this.form.patchValue({
      id: embalagem.id,
      nome: embalagem.nome,
      altura: Number(embalagem.altura),
      largura: Number(embalagem.largura),
      comprimento: embalagem.comprimento,
      peso: embalagem.peso,
      empresas: embalagem.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      })),
    });
    this.embalagemDialog = true;
  }

  deleteClient(event: Event, embalagem: Packing) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir este embalagem?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.embalagemService.delete(embalagem).subscribe({
          next: (response) => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Embalagem deletado com sucesso!'})
            this.embalagemService.listar(this.empresaIdSelected).subscribe((data) => {
              this.embalagens = data;
            });
          },
          error: (error) => {
            console.error("Ocorreu um erro: ", error)
            this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
          }
        })
      }
    })
  }

  hideDialog() {
    this.embalagemDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
  }

  onSubmit() {
    if (!this.form.invalid) {
      this.embalagemService.edit({
        id: this.form.value.id!,
        nome: this.form.value.nome!,
        altura: this.form.value.altura!,
        comprimento: this.form.value.comprimento!,
        largura: this.form.value.largura!,
        peso: this.form.value.peso!,
        empresas: this.form.value.empresas!.map((empresa) => ({
          id: empresa.code,
          razao_social: empresa.name,
        }))
      }).subscribe({
        next: (response) => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Embalagem editada com sucesso!'})
          this.embalagemService.listar(this.empresaIdSelected).subscribe((data) => {
            this.embalagens = data;
          });
          this.hideDialog()
        },
        error: (error) => {
          if (error.status === 400) {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
            return
          }
          this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
        }
      })
      return
    }
    this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
    return
  }


}

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/ClientModel';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ApiEnderecoService } from '../../../core/services/api-endereco.service';
import { Address } from '../../../core/models/AddressModel';
import { ValidateUF } from '../../../utils/validatorsCustom';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConvertEditClient } from '../../../utils/convertClientModel';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { EmpresaService } from '../../../core/services/empresa.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { TreeSelectModule } from 'primeng/treeselect';


@Component({
    selector: 'app-lista-cliente',
    standalone: true,
    imports: [
        TableModule,
        HttpClientModule,
        InputTextModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        RippleModule,
        RadioButtonModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        ConfirmDialogModule,
        CommonModule,
        FormsModule,
        InputMaskModule,
        KeyFilterModule,
        ReactiveFormsModule,
        ToggleButtonModule,
        MultiSelectModule,
        TreeSelectModule
    ],
    providers: [ConfirmationService],
    templateUrl: './lista-cliente.component.html',
    styleUrl: './lista-cliente.component.scss'
})
export class ListaClienteComponent implements OnInit {
    empresas!: EmpresasLista[]
    selectedEmpresa!: EmpresasLista
    empresaIdSelected!: number
    editSelectEmpresa!: EmpresasLista[]

    typeTel: boolean = false;
    productDialog: boolean = false;
    clientes!: Client[];
    selectedCliente!: Client;
    statuses!: any[];
    client!: Client
    submitted: boolean = false;

    private formBuilderService = inject(NonNullableFormBuilder)
    private clientService = inject(ClientService)
    private apiEndereco = inject(ApiEnderecoService)
    private messageService = inject(MessageService)
    private confirmationService = inject(ConfirmationService)
    private usuarioService = inject(UsuarioService)

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
              this.searchClient()
        })
    }

    protected form = this.formBuilderService.group({
        id: [0],
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        telefone: ['', Validators.required],
        cpf: [''],
        email: ['',Validators.email],
        endereco: ['', Validators.required],
        cep: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        uf: ['', [Validators.required, ValidateUF]],
        cidade: ['', Validators.required],
        empresas: [<EmpresasLista[]>[], Validators.required],
        complemento: [''],
    })

    empresaSelected(event: any) {
        this.empresaIdSelected = event.value.code
        this.searchClient()
    }

    searchClient() {
        this.clientService.listar(this.empresaIdSelected).subscribe({
            next: (res) => {
                this.clientes = res
            },
            error: (error) => {
                this.clientes = []
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
            }
        })
    }

    editProduct(client: Client) {
        this.verifyTel(client.telefone)
        this.form.patchValue({
            id: client.id,
            nome: client.nome,
            sobrenome: client.sobrenome,
            telefone: client.telefone,
            cpf: client.cpf!,
            email: client.email!,
            endereco: client.endereco.endereco,
            cep: client.endereco.cep,
            numero: client.endereco.numero,
            bairro: client.endereco.bairro,
            uf: client.endereco.uf,
            cidade: client.endereco.cidade,
            empresas: client.empresas.map(empresa => ({
                name: empresa.razao_social,
                code: empresa.id,
            })),
            complemento: client.endereco.complemento!
        });
        this.productDialog = true;
    }

    deleteClient(event: Event, client: Client) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Deseja excluir este cliente?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: "p-button-danger p-button-text",
            rejectButtonStyleClass: "p-button-text p-button-text",
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.clientService.delete(client).subscribe({
                    next: (response) => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluido com sucesso!' })
                        this.clientService.listar(this.empresaIdSelected).subscribe((data) => {
                            this.clientes = data;
                        });
                    },
                    error: (error) => {
                        console.log("Ocorreu um erro: ", error)
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
                    }
                })
            }
        })
    }


    searchAddress() {
        if (this.form.controls.cep.value) {
            this.apiEndereco.searchAddress(this.form.controls.cep.value.replace(/^-/g, '')).subscribe({
                next: (response: Address) => {
                    this.form.patchValue({
                        endereco: response.endereco,
                        numero: "",
                        bairro: response.bairro,
                        cep: response.cep,
                        uf: response.uf,
                        cidade: response.cidade,
                    })
                },
                error: (error) => {
                    this.form.controls.cep.reset()
                    this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "CEP invalído" })
                }
            })
        }
        return
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
    }

    verifyTel(tel: string) {
        if (tel.length == 14) {
            this.typeTel = true
        } else {
            this.typeTel = false
        }
        return
    }

    modifyInputTel(): void {
        this.typeTel = !this.typeTel
    }
    onSubmit() {
        if (!this.form.invalid) {
            this.clientService.putEditClient(ConvertEditClient(this.form.value)).subscribe({
                next: (response) => {
                    this.clientService.listar(this.empresaIdSelected).subscribe((data) => {
                        this.clientes = data;
                    });
                    this.hideDialog()
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente editado com sucesso!' })
                },
                error: (error) => {
                    if (error.status === 400) {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
                        return
                    }
                    this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!" })
                }
            })
            return
        }
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!" })
        return
    }

}


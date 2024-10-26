import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import {  ValidateUF } from '../../../utils/validatorsCustom';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ApiEnderecoService } from '../../../core/services/api-endereco.service';
import { Address } from '../../../core/models/AddressModel';
import { ClientService } from '../../../core/services/client.service';
import { convertCreateClient } from '../../../utils/convertClientModel';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { MultiSelectModule } from 'primeng/multiselect';
import { UsuarioService } from '../../../core/services/usuario.service';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { PanelModule } from 'primeng/panel';


@Component({
  selector: 'app-cad-cliente',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputMaskModule,
    KeyFilterModule,
    ButtonModule,
    MultiSelectModule,
    FieldsetModule,
    AvatarModule,
    PanelModule
  ],
  providers: [],
  templateUrl: './cad-cliente.component.html',
  styleUrl: './cad-cliente.component.scss'
})
export class CadClienteComponent {

  empresas!: EmpresasLista[]
  selectedEmpresas!: EmpresasLista[]
  tableDadosPessoal: boolean = false
  tableEndereco: boolean = true
  typeTel: boolean = false
  value: string | undefined;

  private clientService = inject(ClientService)
  private apiEndereco = inject(ApiEnderecoService)
  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private usuarioService = inject(UsuarioService)

  ngOnInit(){
    this.usuarioService.listarEmpresa().subscribe(empresas => {
      this.empresas = empresas.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
  }

  protected form = this.formBuilderService.group({
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    telefone: ['', Validators.required],
    cpf: [''],
    email: ['', Validators.email],
    endereco: ['', Validators.required],
    cep:['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    uf: ['', [Validators.required,ValidateUF]],
    cidade: ['', Validators.required],
    empresa: [<EmpresasLista[]>[], Validators.required],
    complemento: [''],
  })

  step = 0;

  modifyTipeTel(): void{
    this.typeTel = !this.typeTel
  }

  actionTable(){
    this.tableDadosPessoal =!this.tableDadosPessoal
    this.tableEndereco =!this.tableEndereco
  }

  searchAddress(){
    if(this.form.controls.cep.value){
      this.apiEndereco.searchAddress(this.form.controls.cep.value.replace(/^-/g,'')).subscribe({
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
          this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "CEP invalído"})
        }
      })
    }
    return 
  }

  validationForm():boolean {
    const allFieldsFilled = Object.keys(this.form.controls).filter(field => field !== 'complemento' && field !== 'cpf' && field !=='email').every(field => {
      const control = this.form.get(field);
      return control && control.value !== '';
    });
    if (!allFieldsFilled) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty()
      })
      return false;
    }
    if(this.form.controls.email.errors){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Email inválido"})
      return false;
    }
    if(this.form.invalid){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Dados Incorretos. Revise e tente novamente!"})
      return false;
    }
    return true
  }

  onSubmit(){
    if(this.validationForm()){
      this.clientService.post(convertCreateClient(this.form.value)).subscribe({
        next: (response) => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente cadastrado com sucesso!'})
          this.form.reset()
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        }
      })
    }
    return
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}


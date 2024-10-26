import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PackingService } from '../../../core/services/packing.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { MessageService } from 'primeng/api';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-cad-embalagem',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    FloatLabelModule,
    KeyFilterModule,
    ButtonModule
  ],
  templateUrl: './cad-embalagem.component.html',
  styleUrl: './cad-embalagem.component.scss'
})
export class CadEmbalagemComponent {

  empresas!: EmpresasLista[]
  selectedEmpresas!: EmpresasLista[]

  private embalagemService = inject(PackingService)
  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private usuarioService = inject(UsuarioService)

  protected form = this.formBuilderService.group({
    nome: ['', Validators.required],
    altura: ['', Validators.required],
    comprimento: ['', Validators.required],
    peso: ['', Validators.required],
    largura: ['', Validators.required],
    empresas: [<EmpresasLista[]>[], Validators.required]
  })

  ngOnInit(){
    this.usuarioService.listarEmpresa().subscribe(empresas => {
      this.empresas = empresas.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
  }

  validationForm():boolean {
    const allFieldsFilled = Object.keys(this.form.controls).every(field => {
      const control = this.form.get(field);
      return control && control.value !== '';
    });
    if (!allFieldsFilled || this.form.invalid) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
      return false;
    }
    return true;
  }

  onSubmit(){
    if(this.validationForm() && this.form.valid){
      this.embalagemService.postCreatePacking({
        nome: this.form.controls.nome.value,
        altura: Number(this.form.controls.altura.value),
        comprimento: Number(this.form.controls.comprimento.value),
        peso: Number(this.form.controls.peso.value),
        largura: Number(this.form.controls.largura.value),
        empresas: this.form.value.empresas!.map((empresa: EmpresasLista) => ({
          id: empresa.code,
          razao_social: empresa.name,
        }))
      }).subscribe({
        next:() => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Embalagem cadastrada com sucesso!'})
          this.form.reset()
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setErrors(null)
          })
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        }
      })
    }
    return
  }

}

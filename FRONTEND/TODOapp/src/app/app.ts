import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TODOapp');

  arrayDeTarefas = signal<Tarefa[]>([]);
  apiURL: string;
  constructor(private http: HttpClient) {
    this.apiURL = 'https://apitarefasguilherme-254121-matheus-257537.onrender.com';
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe({
      next: resultado => { console.log('Tarefa criada:', resultado); this.READ_tarefas(); },
      error: erro => console.error('Erro ao criar tarefa:', erro)
    });
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
      next: resultado => this.arrayDeTarefas.set(resultado),
      error: erro => console.error('Erro ao ler tarefas:', erro)
    });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    const id = tarefaAserRemovida._id;
    if (!id) return console.error('ID da tarefa não encontrado');
    
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe({
      next: resultado => { console.log('Tarefa removida:', resultado); this.READ_tarefas(); },
      error: erro => console.error('Erro ao remover tarefa:', erro)
    });
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const id = tarefaAserModificada._id;
    if (!id) return console.error('ID da tarefa não encontrado');

    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada).subscribe({
      next: resultado => { console.log('Tarefa atualizada:', resultado); this.READ_tarefas(); },
      error: erro => console.error('Erro ao atualizar tarefa:', erro)
    });
  }

}

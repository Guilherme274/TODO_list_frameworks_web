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
    this.apiURL = 'https://apitarefas-guilherme254121-matheus257537.up.railway.app';
    // Carrega a lista inicial do banco ao abrir o app
    this.READ_tarefas();
  }

  // 1. BUSCA INICIAL (Obrigatório para o app não iniciar vazio)
  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
      next: resultado => this.arrayDeTarefas.set(resultado),
      error: erro => console.error('Erro ao ler tarefas:', erro)
    });
  }

  // 2. CRIAÇÃO (Otimizado: adiciona o retorno no Signal sem novo GET)
  CREATE_tarefa(descricaoNovaTarefa: string) {
    const novaTarefa = new Tarefa(descricaoNovaTarefa, false);

    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe({
      next: (tarefaSalva) => {
        this.arrayDeTarefas.update(tarefas => [...tarefas, tarefaSalva]);
      },
      error: erro => console.error('Erro ao criar:', erro)
    });
  }

  // 3. EXCLUSÃO (Otimizado: remove do Signal sem novo GET)
  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    const id = tarefaAserRemovida._id;
    if (!id) return;

    this.http.delete(`${this.apiURL}/api/delete/${id}`).subscribe({
      next: () => {
        this.arrayDeTarefas.update(tarefas => tarefas.filter(t => t._id !== id));
      },
      error: erro => console.error('Erro ao remover:', erro)
    });
  }

  // 4. ATUALIZAÇÃO (Otimizado: altera apenas o item no Signal)
  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const id = tarefaAserModificada._id;
    if (!id) return;

    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada).subscribe({
      next: (resultado) => {
        this.arrayDeTarefas.update(tarefas =>
          tarefas.map(t => t._id === id ? resultado : t)
        );
      },
      error: erro => console.error('Erro ao atualizar:', erro)
    });
  }
}
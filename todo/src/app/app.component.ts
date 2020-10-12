import {Component, Input} from '@angular/core';

import { TodoStore } from './todo.store';

import { EmitterService } from './emitter.service';
import { Todo } from './todo.model';
import { of } from 'rxjs/observable/of';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoStore]
})
export class AppComponent {

  title = 'todos';
  todos: Array<Todo>;
    watchTest;

  todoStore: TodoStore;
  id = 'FooterComponent';
  currentFilter = 'all';  
  removeCompleted() {
    this.todoStore.removeCompleted();
    switch (this.currentFilter) {
        case 'completed':
            EmitterService.get(this.id).emit('displayCompleted');
            break;
        case 'remaining':
            EmitterService.get(this.id).emit('displayRemaining');
            break;
        case 'all':
            EmitterService.get(this.id).emit('displayAll');
            break;
    }
}
displayCompleted() {
  this.currentFilter = 'completed';
  EmitterService.get(this.id).emit('displayCompleted');
}

/**
* Display only remaining todos
*/
displayRemaining() {
  this.currentFilter = 'remaining';
  EmitterService.get(this.id).emit('displayRemaining');
}

/**
* Display all todos
*/
displayAll() {
  this.currentFilter = 'all';
  EmitterService.get(this.id).emit('displayAll');
}
    /**
     * The data-binding value of the input tag, added on enter to the todo store
     */
    @Input()
    newTodoText = '';

    constructor(todoStore: TodoStore) {
      const that = this;
      this.todoStore = todoStore;
      this.todos = todoStore.getAll();
      this.watchTest = of(todoStore.todos);
      EmitterService.get('FooterComponent').subscribe(value => {
          console.log(value);
          switch (value) {
              case 'displayCompleted':
                  that.todos = todoStore.getCompleted();
                  break;
              case 'displayAll':
                  that.todos = todoStore.getAll();
                  break;
              case 'displayRemaining':
                  that.todos = todoStore.getRemaining();
                  break;
          }
      });
      this.watchTest.subscribe(data => {
          console.log(data);
      });
    }

    /**
     * Ad a todo to the list
     */
    addTodo() {
        if (this.newTodoText.trim().length) {
            this.todoStore.add(this.newTodoText);
            this.newTodoText = '';
        }
    }

}
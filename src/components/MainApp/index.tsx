import React from "react";
import { Form } from "react-bootstrap";
import { InputNewTodo } from "../InputNewTodo";
import UserSelect from "../UserSelect";
import { connect } from "react-redux";
import styles from "./MainApp.module.css";

// тип Todo применяется во всем приложении, можно его вынести в отдельный файл - например types/todo.interface.ts
type Todo = {
  title: string;
  user?: number;
  isDone: boolean;
  //id: number
};

type MainAppProps = {
  todos: Todo[]; // как уже указано в index.tsx, лучше получать список todos непосредственно в данном компоненте, чем передавать пропсами
  addTodo: (t: Todo) => void; // переделать на функционльный компонент, тогда пропсы addTodo и changeTodo будут не нужны
  changeTodo: (todos: Todo[]) => void;
};
type MainAppState = {
  todoTitle: string;
};

// лучше переделать классовые компоненты в функциональные и использовать хуки, в том числе кастомные
// чтобы вынести часть логики из компонента и увеличить переиспользуемость кода
// можно использовать модульную архитектуру приложения

// MainApp
//    index.ts - импорты только из index.ts, изолируем остальные файлы, импортируем только то, что нужно
//               и будет использоваться вне данного модуля
//    styles - стили в отдельной папке
//      MainApp.module.css
//    hooks - кастомные хуки для работы с логикой
//      useMainApp.ts - вынести получение списка todos из стора
//    ui -
//      index.tsx - основной файл с ui

class Index extends React.Component<MainAppProps, MainAppState> {
  constructor(props: MainAppProps) {
    super(props);
    this.state = { todoTitle: "" }; //вынести в комонент InputNewTodo
  }

  // список todos получим таким образом
  // const todos = useSelector(
  //   (state: { list: { todos: any[] } }) => state.list.todos
  // );

  //вынести в компонент InputNewTodo
  handleTodoTitle = (todoTitle: string) => {
    this.setState({ todoTitle }); // переделать на функциональные компоненты
  };

  //вынести в компонент InputNewTodo
  handleSubmitTodo = (todo: any) => {
    this.props.addTodo(todo);
    // исопльзовать useDispatch
  };

  // логика удаления записи
  // const handleDelete = (id: number) => {
  //   dispatch({
  //     type: "REMOVE_TODO",
  //     payload: id
  //   })
  // }

  render() {
    const { todoTitle } = this.state; // вынести в комонент InputNewTodo
    window.allTodosIsDone = true; // не нужно

    // поменять на const allTodosIsDone = todos.every(i => i.done)
    // кроме того логика проверки неправильная - если последний элемент в массиве t.isDone будет true
    // то allTodosIsDone будет true, даже если предыдущие t.isDone = false
    // нужно прерывать цикл если t.isDone = false с помощью break или использовать методы массивов, например  every
    this.props.todos.map((t) => {
      if (!t.isDone) {
        window.allTodosIsDone = false;
      } else {
        window.allTodosIsDone = true;
      }
    });

    return (
      <div>
        <Form.Check
          type="checkbox"
          label="all todos is done!"
          checked={window.allTodosIsDone} // нет смысла хранить allTodosIsDone в объекте window
          //логичнее вычислять его на основе списка todos из стора const allTodosIsDone = todos.every(i => i.done)
        />
        <hr />
        <InputNewTodo
          todoTitle={todoTitle}
          onChange={this.handleTodoTitle} // так как используется state manager, то логику ввода и сохранения новой записи
          //можно полностью вынести в InputNewTodo, не передавая никаких пропсов
          onSubmit={this.handleSubmitTodo}
        />
        {this.props.todos.map((t, idx) => (
          // Карточки todo лучше вынести в отдельный компонент - увеличит читаемость, переиспользуемость и универсальность кода
          // при отрисовке списка в Реакт у каждого элемента должен быть key,
          // иначе можно получить баги, особенно при динамичных списках как в todo app
          // а также меньшую производительность

          // Кроме того, так как в данном случае список является динамичным - в него добавляются,
          // удаляются и изменяются новые записи в качестве key необходимо использовать уникальный
          // идентификатор, а не, например, индекс в массиве

          // Кроме того всю логику работы со стором можно вынести в компонент карточки todo
          // компонент, например TodoItem будет принимать пропс todo с типом Todo,
          // а вся логика работы со стором (удаление, выполнение и т.д.) будет внутри этого компонента
          // Это сделает компоненты более независимыми, позволит избежать многоуровневой передачи пропсов -
          // props drilling - как раз для этого и нужен редакс
          <div className={styles.todo}>
            {t.title}
            <UserSelect user={t.user} idx={idx} />
            <Form.Check
              style={{ marginTop: -8, marginLeft: 5 }} // инлайн стили нежелательны
              type="checkbox"
              checked={t.isDone}
              onChange={(e) => {
                // функцию onChange лучше вынести в отдельную функцию и передавать в нее id записи todo
                // можно поменять логику работы редюсера CHANGE_TODOS, чтобы логика поиска записи и ее изменения происходила в нем
                const changedTodos = this.props.todos.map((t, index) => {
                  // лучше переимовать t внутри вложенного цикла, так как t объявлен и во внешнем цикле, чтобы избежать путаницы
                  const res = { ...t };
                  // нужно использовать уникальный идентификатор, а не индекс в массиве
                  // при работе с динамичными списками это позволитизбежать багов,
                  // так как, например, при удалении элемента из списка изменятся индексы других элементов
                  // и нарушится логика работы приложения - index == idx будет находить не тот элемент
                  if (index == idx) {
                    res.isDone = !t.isDone;
                  }
                  return res;
                });
                this.props.changeTodo(changedTodos);
              }}
            />
            {/* пропущена логика удаления записи */}
            {/* <button onClick={() => handleDelete(t?.id)}>X</button> */}
          </div>
          // TodoItem
          //    index.ts - импорты только из index.ts, изолируем остальные файлы, импортируем только то, что нужно
          //               и будет использоваться вне данного модуля
          //    styles - стили в отдельной папке
          //      TodoItem.module.css
          //    hooks - кастомные хуки для работы с логикой
          //      useTodoItem.ts - вынести логику изменения записи - вынести работу со стор
          //    ui -
          //      index.tsx - основной файл с ui
        ))}
      </div>
    );
  }
}

// лучше использовать функциональные компоненты и заменить connect на хук dispatch = useDispatch()
// и мутировать стор с его помощью - dispatch({ type: "ADD_TODO", payload: todo })
export default connect(
  (state) => ({}),
  (dispatch) => ({
    addTodo: (todo: any) => {
      dispatch({ type: "ADD_TODO", payload: todo });
    },
    changeTodo: (todos: any) =>
      dispatch({ type: "CHANGE_TODOS", payload: todos }),
    removeTodo: (index: number) =>
      dispatch({ type: "REMOVE_TODOS", payload: index }),
  })
)(Index);

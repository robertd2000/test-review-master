import React from "react";
import styles from "./InputNewTodo.module.css";

type InputNewTodoProps = {
  todoTitle: string;
  onChange: (todoTitle: string) => void;
  onSubmit: (todo: any) => void;
};
type InputNewTodoState = {
  value: string;
};

// можно использовать модульную архитектуру приложения

// InputNewTodo
//    index.ts - импорты только из index.ts, изолируем остальные файлы, импортируем только то, что нужно
//               и будет использоваться вне данного модуля
//    styles - стили в отдельной папке
//      InputNewTodo.module.css
//    hooks - кастомные хуки для работы с логикой
//      useNewTodo.ts - вынести логику создания новой записи - работу с состоянием, со стором
//    ui -
//      index.tsx - основной файл с ui

// лучше передаелать классовые компоненты в функциональные и использовать хуки, в том числе кастомные
// чтобы вынести часть логики из компонента и увеличить пееиспользуемость кода
// также можно переименовать компонент, дав более семантичное название - CreateTodo, NewTodo
export class InputNewTodo extends React.Component<
  InputNewTodoProps,
  InputNewTodoState
> {
  componentDidUpdate(
    prevProps: Readonly<InputNewTodoProps>,
    prevState: Readonly<InputNewTodoState>,
    snapshot?: any
  ) {
    if (this.props.todoTitle !== prevProps.todoTitle) {
      this.setState({ value: this.props.todoTitle });
    }
  }

  // вынести из MainApp состояние инпута сюда и использвовать  хук useState (переделать компонент в функциональный)
  // const [text, setText] = useState("")
  // перенести в хук useNewTodo
  // const {text, handleChange, handleKeyDown} = useNewTodo()
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value); // setText(e.target.value)
  };

  // вынести сюда логику работы со стором - использвоать dispatch = useDispatch
  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== 13) {
      //event.key === 'Enter', так как event.keyCode устарел
      return;
    }

    event.preventDefault();

    var val = this.state.value.trim(); // text.trim()

    if (val) {
      this.props.onSubmit({
        // лучше создать уникальный идентификатор хотя бы с помощью random, чтобы удалять и изменять записи
        // по уникальному id. Также уникальный id нужно использоваь в качестве ключа (key) при отрисовке массивов в Реакт
        // id: Math.random() * 10000,
        title: this.state.value, // уже есть переменная val, которая хранит обработанную строку, использвоать ее
        isDone: false,
        // предполагается использование поля user в сторе, поэтому его лучше инициализировать по умолчанию
        // user: null
      });
      this.props.onChange(""); //setText("") - очитстить инпут после сохранения записи
    }
  };

  render() {
    return (
      // в проекте уже есть библиотека Bootstrap, можно использвоать input из нее
      <input
        className={styles["new-todo"]} // в модульном CSS по соглашению стили должны быть в camelCase - newTodo
        type="text"
        value={this.props.todoTitle} // value={text}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        placeholder="What needs to be done?"
      />
    );
  }
}

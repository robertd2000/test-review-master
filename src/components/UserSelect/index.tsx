import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./UserSelect.module.css";

type UserSelectProps = {
  user?: number;
  idx: number;
};
// UserSelect
//    index.ts - импорты только из index.ts, изолируем остальные файлы, импортируем только то, что нужно
//               и будет использоваться вне данного модуля
//    styles - стили в отдельной папке
//      UserSelect.module.css
//    hooks - кастомные хуки для работы с логикой
//      useUserSelect.ts - вынести логику изменения записи - вынести работу со стор и состоянием
//    ui -
//      index.tsx - основной файл с ui
// в данном компоненте можно вынести логику в кастомный хук
function UserSelect(props: UserSelectProps) {
  // можно сразу произвести деструктуризацию {idx, user} из props
  const dispatch = useDispatch();
  const todos = useSelector(
    (state: { list: { todos: any[] } }) => state.list.todos
  );
  React.useEffect(() => {
    console.log("userSelect");
    // функцию-запрос на АПИ можно выделить в отдельный слой - api/users.api.ts
    // можно переделать .then на async/await lля лучшей читаемости
    fetch("https://jsonplaceholder.typicode.com/users/")
      .then((users) => users.json())
      .then((users) => setOptions(users));
  }, []);

  const [options, setOptions] = React.useState([]);

  const { idx } = props; // можно также получить и user при деструктуризации props

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // логику изменения записи в сторе можно поменять - в данном варианте редюсер принимает список всех записей todos
    // что может быть неочевидным, учитывая в том числе и название action - CHANGE_TODO
    // то есть подразумевается что меняется ОДНА запись
    // кроме того логику изменения записи приходится дублировать в нескольких компонентах
    // поэтому лучше изменить CHANGE_TODO, чтобы он принимал измененное значение одного TODO (записи)
    // находил в массиве todos и менял
    const changedTodos = todos.map((t, index) => {
      const res = { ...t };
      // лучше не исользовать индекс массива в качестве идентификатора, так как это приводит к багам и неожиданному поведению
      // лучше создать уникальный идентификатор хотя бы с помощью random
      if (index == idx) {
        console.log("props.user", props.user);
        res.user = e.target.value; // user будет сохраняться как строка, а UserSelectProps предполагает число
      }
      return res;
    });

    dispatch({ type: "CHANGE_TODO", payload: changedTodos }); // неправильный action - CHANGE_TODO не объявлен
    // в редюсере, заменить на CHANGE_TODOS (если не переделывать логику редюсера)
  };

  return (
    // в проекте уже есть библиотека Bootstrap, можно использвоать select из нее
    <select name="user" className={styles.user} onChange={handleChange}>
      {options.map((user: any) => (
        <option value={user.id}>{user.name}</option> //нужно добавить key для правильной работы массива
      ))}
    </select>
  );
}

export default UserSelect;

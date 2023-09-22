import { configureStore } from "@reduxjs/toolkit";
// можно отделить инициализацию стора от reducer'ов (reducer'ов в будущем может быть несколько)
export default configureStore({
  reducer: {
    // нужно типизировать state, использовать тип Todo
    list: (state = { todos: [] }, action) => {
      switch (action.type) {
        case "ADD_TODO": {
          const newState = state; // по правилам redux нельзя менять состояние стора напрямую - здесь создается ссылка на state
          newState.todos.push(action.payload); // тут стейт мутируется на месте напрямую
          return newState;
          //  можно сделать так:
          // return {
          //   ...state,
          //   todos: [...state.todos, action.payload],
          // };
          //для правильной работы с состоянием в redux нужно из reducer возвращать новый объект, созданный на основе предыдущего состояния
          // в редакс стор является немутабельным (immutable)
          // можно "мутировать" стор если использвоать redux toolkit или другие библиотеки (внутренне они все равно не будут мутировать стор напрямую)
        }
        case "REMOVE_TODO": {
          return {
            ...state,
            todos: state.todos.filter(
              //вместо индекса использовать id
              (t: any, index: number) => index !== action.payload // t не используется, можно заменить на _
            ),
          };
        }
        // Можно переделать логику работы CHANGE_TODOS, так как в текущей реализации он принимает
        // уже модифицированный массив записей TODO. Но в логике приложения он модифицирует всегда одну запись, а не несколько, поэтому нет смысла передавать массив.
        // В таком случае можно переименовать на CHANGE_TODO
        // Можно вынести логику измения записи в редюсер:
        // Принимать объект записи искать ее в массиве todos по id и менять там.
        // Возвращать получившийся объект
        // return {
        //   todos: [
        //     ...state.todos.map((i) => {
        //       if (i.id === action.payload.id) return action.payload;
        //       return i;
        //     }),
        //   ],
        // };
        case "CHANGE_TODOS": {
          return {
            todos: action.payload,
          };
        }
        default:
          return state;
      }
    },
  },
});

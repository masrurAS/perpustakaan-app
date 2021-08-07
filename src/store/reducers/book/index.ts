import { ReducerAction } from '@store/reducers/type';
import { Book } from '@store/_entity';
import * as MUTATIONS from './mutations';
import * as ACTIONS from './actions';

export { MUTATIONS, ACTIONS }
export type BookState = {
  loaded: boolean,
  datas: Book[]
}
const initial: BookState = {
  loaded: false,
  datas: []
}

export default function bookReducer(state = initial, action: ReducerAction) {
  switch (action.type) {
    case MUTATIONS.TYPES.set:
      state.datas = action.payload
      state = { ...state }
      break;

    case MUTATIONS.TYPES.set_loaded:
      state.loaded = action.payload
      state = { ...state }
      break;

    case MUTATIONS.TYPES.append:
      state.datas = [...state.datas, ...action.payload]
      state = { ...state }
      break;

    case MUTATIONS.TYPES.setbook:
      var { id, data } = action.payload;
      for (const index in state.datas) {
        const book = state.datas[index];
        if (book.id == id) {
          state.datas[index] = data;
          break;
        }
      }
      state = { ...state }
      break;
  
    default:
      break;
  }

  return state;
}
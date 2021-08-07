import { ReducerAction } from '@store/reducers/type';
import { Category } from '@store/_entity';
import * as MUTATIONS from './mutations';
import * as ACTIONS from './actions';

export { MUTATIONS, ACTIONS }
export type CategoryState = {
  loaded: boolean,
  datas: Category[]
}
const initial: CategoryState = {
  loaded: false,
  datas: []
}

export default function categoryReducer(state = initial, action: ReducerAction) {
  switch (action.type) {
    case MUTATIONS.TYPES.set:
      state.datas = action.payload
      state = { ...state }
      break;

    case MUTATIONS.TYPES.set_loaded:
      state.loaded = action.payload
      state = { ...state }
      break;
  
    default:
      break;
  }

  return state;
}
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import reducers from './reducers';
import { ReducerAction } from './reducers/type';

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducers, middleware)

export type State = ReturnType<typeof store.getState>
export type Dispatch = ThunkDispatch<State, unknown|undefined, ReducerAction>
export default store;
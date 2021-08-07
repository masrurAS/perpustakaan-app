import { combineReducers } from 'redux';
import categoryReducer from './category';
import bookReducer from './book';

const reducers = combineReducers({
  category: categoryReducer,
  book: bookReducer,
});

export default reducers;
import { getBooks } from "@actions/book";
import axios, { CancelTokenSource } from "axios";
import { ReducerActionFunction, ReducerActionFunctionType } from "../type";
import * as MUTATIONS from './mutations';

let cancel_token_search: CancelTokenSource|undefined = undefined;

export const GET_FROM_SERVER: ReducerActionFunctionType = () => {
  return (async (dispatch, getState) => {
    if (getState().book.datas.length > 0) return;
    dispatch(MUTATIONS.SETLOADED(false));
    await getBooks({}, 1).then(res => {
      if (res?.data?.data) {
        dispatch(MUTATIONS.SET(res.data.data))
      } else {
        dispatch(MUTATIONS.SET([]))
      }
    })
    .finally(() => {
      dispatch(MUTATIONS.SETLOADED(true));
    })
  }) as ReducerActionFunction;
}

export type filterBook = {
  category?: string,
  keyword: string
}
export const SEARCH: ReducerActionFunctionType = (filter: filterBook, onFinnaly?: () => void) => {
  return (async (dispatch, getState) => {
    if (cancel_token_search) {
      cancel_token_search.cancel();
    }
    cancel_token_search = axios.CancelToken.source();
    dispatch(MUTATIONS.SETLOADED(false));
    await getBooks(filter, 1, 20, cancel_token_search.token).then(res => {
      if (res?.data?.data) {
        dispatch(MUTATIONS.SET(res.data.data))
      } else {
        dispatch(MUTATIONS.SET([]))
      }
    })
    .finally(() => {
      dispatch(MUTATIONS.SETLOADED(true));
      if (onFinnaly) onFinnaly();
    })
  }) as ReducerActionFunction;
}

export const LOAD_MORE: ReducerActionFunctionType = (filter: filterBook, page: number, onFinnaly?: (datas: any[]) => void) => {
  return (async (dispatch, getState) => {
    if (cancel_token_search) {
      cancel_token_search.cancel();
    }
    cancel_token_search = axios.CancelToken.source();
    await getBooks(filter, page, 20, cancel_token_search.token).then(res => {
      if (res?.data?.data && res.data.data.length > 0) {
        dispatch(MUTATIONS.APPEND(res.data.data))
        if (onFinnaly) onFinnaly(res.data.data);
      } else {
        if (onFinnaly) onFinnaly([]);
      }
    })
    .catch(() => {
      if (onFinnaly) onFinnaly([]);
    })
  }) as ReducerActionFunction;
}
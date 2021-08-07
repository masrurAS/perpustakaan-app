import { Book } from "@store/_entity"
import { ReducerActionType } from "../type"

export const TYPES = {
  set_loaded: 'book/setloaded',
  set: 'book/set',
  setbook: 'book/setbook',
  append: 'book/append',
}

export const SET: ReducerActionType = (data: Book[]) => ({
  type: TYPES.set,
  payload: data
});
export const SET_BOOK: ReducerActionType = (id: number, data: Book) => ({
  type: TYPES.setbook,
  payload: { id, data }
})
export const APPEND: ReducerActionType = (data: Book[]) => ({
  type: TYPES.append,
  payload: data
})
export const SETLOADED: ReducerActionType = (data: boolean) => ({
  type: TYPES.set_loaded,
  payload: data
})
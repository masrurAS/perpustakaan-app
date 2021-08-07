import { Category } from "@store/_entity"
import { ReducerActionType } from "../type"

export const TYPES = {
  set_loaded: 'category/setloaded',
  set: 'category/set',
}

export const SET: ReducerActionType = (data: Category[]) => ({
  type: TYPES.set,
  payload: data
})
export const SETLOADED: ReducerActionType = (data: boolean) => ({
  type: TYPES.set_loaded,
  payload: data
})
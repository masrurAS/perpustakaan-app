import { getAllCategory } from "@actions/category";
import { ReducerActionFunction, ReducerActionFunctionType } from "../type";
import * as MUTATIONS from './mutations';

export const GET_FROM_SERVER: ReducerActionFunctionType = () => {
  return ((dispatch, getState) => {
    dispatch(MUTATIONS.SETLOADED(false));
    getAllCategory().then(res => {
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
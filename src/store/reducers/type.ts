import { ThunkDispatch } from "redux-thunk";
import { State } from "@store";
import { AnyAction } from "redux";

export type ReducerActionFunction<R = any> = (dispatch: ThunkDispatch<State, unknown, ReducerAction>, getState: () => State, extraArgument?: unknown) => R;
export type ReducerActionFunctionType<R = any> = (...args: any[]) => ReducerActionFunction<R>;
export interface ReducerAction extends AnyAction {
  type: string;
  payload?: any;
  extra?: any;
}
export type ReducerActionType = (...args: any[]) => ReducerAction;
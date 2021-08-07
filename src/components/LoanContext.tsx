import { abort_loan, create_loan, get_loans_from_server, get_loan_from_server } from '@actions/loan';
import ErrorException from '@http/exception/ErrorException';
import { LoanResponse, LoansResponse } from '@http/Response';
import { MUTATIONS } from '@store/reducers/book';
import { Loan } from '@store/_entity';
import React, { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

interface LoanContextInterface {
  datas: Loan[]
  get_from_server: () => Promise<LoansResponse|ErrorException|undefined>
  create: (book_id: number) => Promise<LoanResponse|ErrorException|undefined>
  abort: (id: number) => Promise<LoanResponse|ErrorException|undefined>
  refreshSingle: (id: number) => Promise<LoanResponse|ErrorException|undefined>
}

const LoanContext = React.createContext<LoanContextInterface>({
  datas: [],
  get_from_server: async () => undefined,
  create: async (book_id: number) => undefined,
  abort: async (id: number) => undefined,
  refreshSingle: async (id: number) => undefined,
})

export const LoanProvider: FC<PropsWithChildren<{}>> = (props) => {
  const dispatch = useDispatch();
  const [contextData, setContextData] = useState<{
    datas: Loan[]
  }>({
    datas: []
  });

  const updateData = (id: number, loan: Loan) => {
    let newcontextData = {...contextData};
    for (const index in newcontextData.datas) {
      const data = newcontextData.datas[index];
      if (data.id == id) {
        newcontextData.datas[index] = loan;
        break;
      }
    }
    setContextData(newcontextData);
  }

  const _get_from_server = async () => {
    return await get_loans_from_server().then(res => {
      if (res instanceof LoansResponse && res.data) {
        setContextData({
          ...contextData,
          datas: res.data
        });
      }
      return res;
    });
  }

  const _create = async (book_id: number) => {
    return await create_loan(book_id).then(res => {
      if (res instanceof LoanResponse && res.data) {
        const book = res.data.books.length > 0 ? res.data.books[0] : undefined;
        if (book) dispatch(MUTATIONS.SET_BOOK(book_id, book))
        setContextData({
          ...contextData,
          datas: [res.data, ...contextData.datas]
        });
      }
      return res;
    });
  }

  const _abort = async (id: number) => {
    return await abort_loan(id).then(res => {
      if (res instanceof LoanResponse && res.data) {
        const book = res.data.books.length > 0 ? res.data.books[0] : undefined;
        if (book) dispatch(MUTATIONS.SET_BOOK(book.id, book))
        updateData(id, res.data);
      }
      return res;
    });
  }

  const _refreshSingle = async (id: number) => {
    return await get_loan_from_server(id).then(res => {
      if (res instanceof LoanResponse && res.data) {
        const book = res.data.books.length > 0 ? res.data.books[0] : undefined;
        if (book) dispatch(MUTATIONS.SET_BOOK(book.id, book))
        updateData(id, res.data);
      }
      return res;
    });
  }

  const context = useMemo<LoanContextInterface>(() => ({
    datas: contextData.datas,
    get_from_server: _get_from_server,
    create: _create,
    abort: _abort,
    refreshSingle: _refreshSingle
  }), [contextData]);

  useEffect(() => {
    context.get_from_server();
  }, [])

  return (
    <LoanContext.Provider value={context}>
      {props.children}
    </LoanContext.Provider>
  )
};
export type LoanContextValue = LoanContextInterface;
export default LoanContext;
import http from "@http";
import ErrorException from "@http/exception/ErrorException";
import { BaseRequest, Method } from "@http/Request";
import { LoanResponse, LoansResponse } from "@http/Response";

export function getStatusColor(status: number) {
  switch (status) {
    case 0:
      return 'gray.300';

    case 1:
      return 'green.500';

    case 2:
      return 'orange.500';

    case -1:
      return 'red.500';
        
    default:
      return 'gray.300'
  }
}

export function getLoanStatusLabel(status: number) {
  switch (status) {
    case 0:
      return 'Dikembalikan';

    case 1:
      return 'Dipinjam saat ini';

    case 2:
      return 'Belum Diambil';

    case -1:
      return 'Dibatalkan';
        
    default:
      return status
  }
}

export async function get_loans_from_server() {
  const req = new BaseRequest(LoansResponse, Method.GET, '/loan');
  return await http.execute(req)
  .then(res => {
    if (res instanceof LoansResponse && res.status) {
      return res;
    }

    return undefined;
  })
  .catch((e) => {
    if (e instanceof ErrorException) {
      return e;
    }
    return undefined;
  });
}

export async function get_loan_from_server(id: number) {
  const req = new BaseRequest(LoanResponse, Method.GET, `/loan/${id}`);
  return await http.execute(req)
  .then(res => {
    if (res instanceof LoanResponse && res.status) {
      return res;
    }

    return undefined;
  })
  .catch((e) => {
    if (e instanceof ErrorException) {
      return e;
    }
    return undefined;
  });
}

export async function create_loan(book_id: number) {
  const errors = ['Tidak bisa melakukan Pinjaman', 'Stok Habis.', 'Error.', 'Maks pinjam 3 buku sekaligus.', 'Tidak bisa pinjam buku yang sama sekaligus.']
  const req = new BaseRequest(LoanResponse, Method.POST, '/loan/store', { book_id });
  return await http.execute(req)
  .then(res => {
    if (res instanceof LoanResponse && res.status) {
      return res;
    }

    return undefined;
  })
  .catch((e) => {
    if (e instanceof ErrorException && errors.includes(e.message)) {
      return e;
    }
    return undefined;
  });
}

export async function abort_loan(id: number) {
  const errors = ['Status pinjaman invalid.']
  const req = new BaseRequest(LoanResponse, Method.POST, `/loan/abort/${id}`);
  return await http.execute(req)
  .then(res => {
    if (res instanceof LoanResponse && res.status) {
      return res;
    }

    return undefined;
  })
  .catch((e) => {
    if (e instanceof ErrorException && errors.includes(e.message)) {
      return e;
    }
    return undefined;
  });
}
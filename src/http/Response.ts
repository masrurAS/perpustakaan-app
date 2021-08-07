import { Book, Loan, Me } from "@store/_entity"

export interface Response {
  status: boolean
  message: string
}

export class BaseResponse implements Response {
  status = false
  message = ''
  data?: string|Record<string, any>|any[]
}

export class PaginationResponse implements Response {
  status = false
  message = ''
  data?: {
    current_page: number,
    data: any[],
    first_page_url: string,
    from: number,
    next_page_url: string|null,
    path: string,
    per_page: number,
    prev_page_url: string|null,
    to: number
  }
}

export class AuthResponse implements Response {
  status = false
  message = ''
  data?: {
    token: string,
    expires_in: number
  }
}

export class MeResponse implements Response {
  status = false
  message = ''
  data?: Me
}

export class BookResponse implements Response {
  status = false
  message = ''
  data?: Book
}

export class LoanResponse implements Response {
  status = false
  message = ''
  data?: Loan
}

export class LoansResponse implements Response {
  status = false
  message = ''
  data: Loan[] = []
}
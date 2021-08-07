export interface Category {
  id: number,
  name: string
}

export interface Book {
  id: number
  code: string
  name: string
  writer: string
  year: string
  thumbnail: string
  description: string
  stock: number
  created_at: string
  updated_at: string
  category_id: number,
  category: Category
}

export interface Me {
  id: number
  email: string
  password: string
  name: string
  phone: string
  gender: string
  birthday: string
  address: string
  photo: string
  created_at: string
  updated_at: string
}

interface BookLoan extends Book {
  pivot: {
    loan_id: number
    book_id: number
    qty: number
  }
}

export interface Loan {
  member_id: number,
  status: number,
  return: string,
  updated_at: string,
  created_at: string,
  id: number,
  books: BookLoan[],
  member: Me
}
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number; // Prisma Decimal is usually handled as number or string in TS
  stock: number;
  sale: number;
  image: string | null; // Nullable because of String?
  isActive: boolean;
}

export interface NewProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
}

export interface UpdateProduct {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  image?: string;
}

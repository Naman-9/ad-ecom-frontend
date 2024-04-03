import { Bar, CartItem, Line, Order, Pie, Product, ShippingInfo, Stats, User } from "./types"

export type CustomError = {
    status: number;
    data: {
        message: string;
        success: boolean;
    };
}

export type MessageResponse = {
    success: boolean;
    message: string;
}

export type AllUsersResponse = {
    success: boolean;
    users: User[];
}

export type UserResponse = {
    success: boolean;
    user: User;
}

export type AllProductsResponse = {
    success: boolean;
    products: Product[];
}

export type categoriesResponse = {
    success: boolean;
    categories: string[];
}

export type searchProductsResponse = AllProductsResponse & {
    totalPage: number;
}

export interface SearchQueryRequest {
    search?: string;
    price?: number;
    category?: string;
    sort?: string;
    page?: number;
  }

export type ProductResponse = {
    id: string;
    product: Product;
    
}

export type NewProductResponse = {
    id: string;
    formData: FormData;
    
}

export type UpdateProductResponse = {
    userId: string;
    productId: string;
    formData: FormData;
}

export type DeleteProductResponse = {
    userId: string;
    productId: string;
}

export type AllOrdersResponse = {
    success: boolean;
    orders: Order[];
}

export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
}

export type StatsResponse = {
    success: boolean;
    stats: Stats;
}
export type PieResponse = {
    success: boolean;
    charts: Pie;
}
export type BarResponse = {
    success: boolean;
    charts: Bar;
}
export type LineResponse = {
    success: boolean;
    charts: Line;
}



export type NewOrderRequest = {
    orderItems: CartItem[];  // not sended OrderItem bcoz mongo will add id as well
    shippingInfo: ShippingInfo; 
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    userId: string;

}
export type UpdateOrderRequest = {
    userId: string,
    orderId: string,
}

export type DeleteUserRequest = {
    userId: string;
    adminUserId: string;
}



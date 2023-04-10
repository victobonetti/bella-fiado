export interface Iproducts {
    _id:string,
    name: string,
    price: number
}

export interface IAccounts{
    _id:string,

}

export interface Iuser {
    _id:string,
    username: string,
    password:string,
}

export interface IAccount{
    user_id: Iuser['_id'];
    items?: IItem[];
    payments?: IPayment[];
    total?(): number;
}

export interface IItem {
    product_id: Iproducts;
    amount: number;
    date?: Date
}

export interface IPayment{
    value: number;
    date: Date;
}
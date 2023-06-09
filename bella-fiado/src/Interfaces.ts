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
    _id?:string,
    user_id: Iuser['_id'];
    items?: IItem[];
    payments?: IPayment[];
}

export interface IItem {
    _id: string;
    product_id: Iproducts;
    amount: number;
    note?: string;
    date: Date;
}

export interface postItem {
    product_id:Iproducts;
    amount:number;
}

export interface IPayment{
    _id:string;
    value: number;
    date: Date;
}

/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum StatusOrder {
    OPEN = "OPEN",
    ACTIVE = "ACTIVE",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    PENDING = "PENDING",
    PAYED = "PAYED"
}

export enum TypePayment {
    CARD = "CARD",
    ONLINE = "ONLINE"
}

export enum StatusTransaction {
    DONE = "DONE",
    FAILED = "FAILED",
    WAITING = "WAITING",
    ERROR = "ERROR",
    CANCELED_BY_SENDER = "CANCELED_BY_SENDER",
    CANCELED_BY_PROVIDER = "CANCELED_BY_PROVIDER",
    PROCESSING = "PROCESSING"
}

export enum MarketType {
    OZON = "OZON",
    WB = "WB"
}

export enum StatusProduct {
    VALIDATION = "VALIDATION",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED"
}

export enum Access {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export class InputLogIn {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class InputSignUp {
    name?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class InputRefresh {
    refreshToken?: Nullable<string>;
}

export class CreateOrderInput {
    name: string;
    senderId?: Nullable<string>;
    description?: Nullable<string>;
    productIds?: Nullable<Nullable<string>[]>;
}

export class UpdateInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    productIds?: Nullable<Nullable<string>[]>;
}

export class PayInput {
    orderId?: Nullable<string>;
    typePayment?: Nullable<TypePayment>;
}

export class InputAddProductToList {
    idWishList?: Nullable<string>;
    name?: Nullable<string>;
    link?: Nullable<string>;
    description?: Nullable<string>;
    marketPlace?: Nullable<MarketType>;
    labels?: Nullable<Nullable<string>[]>;
}

export class InputUpdateEditorProduct {
    name?: Nullable<string>;
    description?: Nullable<string>;
    id?: Nullable<string>;
    idWishList?: Nullable<string>;
    labels?: Nullable<Nullable<string>[]>;
}

export class UpdateUserInput {
    name?: Nullable<string>;
    email?: Nullable<string>;
}

export class FindUserInput {
    id?: Nullable<string>;
}

export class GetUser {
    id?: Nullable<string>;
}

export class InputCreateList {
    name?: Nullable<string>;
    description?: Nullable<string>;
    idUser?: Nullable<string>;
}

export class InputRemoveList {
    id?: Nullable<string>;
    idUser?: Nullable<string>;
}

export class InputUpdateList {
    id: string;
    idUser?: Nullable<string>;
    name?: Nullable<string>;
    access?: Nullable<Access>;
    description?: Nullable<string>;
}

export interface IData {
    data?: Nullable<Object>;
}

export class CheckAuthData {
    isAuth?: Nullable<boolean>;
}

export class Tokens {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export abstract class IQuery {
    abstract checkAuth(): Nullable<CheckAuthData> | Promise<Nullable<CheckAuthData>>;

    abstract getOrder(id: string): Nullable<Order> | Promise<Nullable<Order>>;

    abstract paymentTypes(): Nullable<Nullable<TypePayment>[]> | Promise<Nullable<Nullable<TypePayment>[]>>;

    abstract productsWishList(idWishList: string): Nullable<Nullable<Product>[]> | Promise<Nullable<Nullable<Product>[]>>;

    abstract getOrCreateSender(): Nullable<Sender> | Promise<Nullable<Sender>>;

    abstract getSenderById(id: string): Nullable<Sender> | Promise<Nullable<Sender>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract currentUser(): Nullable<User> | Promise<Nullable<User>>;

    abstract wishListsCurrentUser(): Nullable<Nullable<WishList>[]> | Promise<Nullable<Nullable<WishList>[]>>;

    abstract wishLisByIdForUser(idUser?: Nullable<string>, idList?: Nullable<string>): Nullable<WishList> | Promise<Nullable<WishList>>;
}

export abstract class IMutation {
    abstract logIn(data?: Nullable<InputLogIn>): Tokens | Promise<Tokens>;

    abstract signUp(data?: Nullable<InputSignUp>): Tokens | Promise<Tokens>;

    abstract refresh(): Tokens | Promise<Tokens>;

    abstract twitch(code: string): Tokens | Promise<Tokens>;

    abstract createOrder(data: CreateOrderInput): Nullable<Order> | Promise<Nullable<Order>>;

    abstract confirmOrder(id: string): Nullable<Order> | Promise<Nullable<Order>>;

    abstract pathOrder(data: UpdateInput): Nullable<Order> | Promise<Nullable<Order>>;

    abstract payOrder(data?: Nullable<PayInput>): Nullable<Order> | Promise<Nullable<Order>>;

    abstract addToList(data?: Nullable<InputAddProductToList>): Nullable<Product> | Promise<Nullable<Product>>;

    abstract updateProduct(data?: Nullable<InputUpdateEditorProduct>): Nullable<Product> | Promise<Nullable<Product>>;

    abstract removeProducts(products: Nullable<string>[]): Nullable<Nullable<Product>[]> | Promise<Nullable<Nullable<Product>[]>>;

    abstract updateUser(id: string, params: UpdateUserInput): User | Promise<User>;

    abstract findUser(findUserInput: FindUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract createList(data?: Nullable<InputCreateList>): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract updateList(data?: Nullable<InputUpdateList>): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract removeList(id?: Nullable<string>): Nullable<WishList> | Promise<Nullable<WishList>>;
}

export class Transaction {
    id?: Nullable<string>;
    createAt?: Nullable<DateTime>;
    updateAt?: Nullable<DateTime>;
    senderId?: Nullable<string>;
    sender?: Nullable<Sender>;
    amount?: Nullable<number>;
    typePayment?: Nullable<TypePayment>;
    status?: Nullable<StatusTransaction>;
}

export class Order {
    id?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<number>;
    status?: Nullable<StatusOrder>;
    transaction?: Nullable<Transaction>;
    products?: Nullable<Nullable<Product>[]>;
}

export class Product {
    name?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<number>;
    royalties?: Nullable<number>;
    delivery?: Nullable<number>;
    marketPlace?: Nullable<string>;
    link?: Nullable<string>;
    img?: Nullable<string>;
    status?: Nullable<StatusProduct>;
    idWishList?: Nullable<string>;
    id?: Nullable<string>;
    labels?: Nullable<Nullable<string>[]>;
    idSender?: Nullable<string>;
    descriptionReceiver?: Nullable<string>;
    wishList?: Nullable<WishList>;
    likes?: Nullable<number>;
    disLikes?: Nullable<number>;
}

export class Sender {
    id?: Nullable<string>;
    email?: Nullable<string>;
    nickname?: Nullable<string>;
}

export class User {
    id: string;
    name?: Nullable<string>;
    email?: Nullable<string>;
    role?: Nullable<Role>;
    createAt?: Nullable<DateTime>;
    updateAt?: Nullable<DateTime>;
    wishLists?: Nullable<Nullable<WishList>[]>;
}

export class WishList {
    id?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    idUser: string;
    access?: Nullable<Access>;
    user: User;
    products?: Nullable<Nullable<Product>[]>;
}

export abstract class ISubscription {
    abstract listCreated(idUser: string): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract listRemoved(idUser: string): Nullable<WishList> | Promise<Nullable<WishList>>;
}

export type Object = any;
export type DateTime = any;
export type Role = any;
type Nullable<T> = T | null;


/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum MarketType {
    OZON = "OZON",
    WB = "WB"
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

export class InputAddProductToList {
    uidWishList?: Nullable<string>;
    name?: Nullable<string>;
    link?: Nullable<string>;
    description?: Nullable<string>;
    marketPlace?: Nullable<MarketType>;
    labels?: Nullable<Nullable<string>[]>;
}

export class InputUpdateEditorProduct {
    name?: Nullable<string>;
    description?: Nullable<string>;
    uid?: Nullable<string>;
    uidWishList?: Nullable<string>;
    labels?: Nullable<Nullable<string>[]>;
}

export class UpdateUserInput {
    name?: Nullable<string>;
    email?: Nullable<string>;
}

export class FindUserInput {
    uid?: Nullable<string>;
}

export class GetUser {
    uid?: Nullable<string>;
}

export class InputCreateList {
    name?: Nullable<string>;
    description?: Nullable<string>;
    uidUser?: Nullable<string>;
}

export class InputRemoveList {
    uid?: Nullable<string>;
    uidUser?: Nullable<string>;
}

export class InputUpdateList {
    uid: string;
    uidUser?: Nullable<string>;
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

    abstract productsWishList(uidWishList: string): Nullable<Nullable<Product>[]> | Promise<Nullable<Nullable<Product>[]>>;

    abstract user(uid: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract currentUser(): Nullable<User> | Promise<Nullable<User>>;

    abstract wishListsCurrentUser(): Nullable<Nullable<WishList>[]> | Promise<Nullable<Nullable<WishList>[]>>;

    abstract wishLisByIdForUser(uidUser?: Nullable<string>, uidList?: Nullable<string>): Nullable<WishList> | Promise<Nullable<WishList>>;
}

export abstract class IMutation {
    abstract logIn(data?: Nullable<InputLogIn>): Tokens | Promise<Tokens>;

    abstract signUp(data?: Nullable<InputSignUp>): Tokens | Promise<Tokens>;

    abstract refresh(): Tokens | Promise<Tokens>;

    abstract addToList(data?: Nullable<InputAddProductToList>): Nullable<Product> | Promise<Nullable<Product>>;

    abstract updateProduct(data?: Nullable<InputUpdateEditorProduct>): Nullable<Product> | Promise<Nullable<Product>>;

    abstract removeProducts(products: Nullable<string>[]): Nullable<Nullable<Product>[]> | Promise<Nullable<Nullable<Product>[]>>;

    abstract updateUser(uid: string, params: UpdateUserInput): User | Promise<User>;

    abstract findUser(findUserInput: FindUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract createList(data?: Nullable<InputCreateList>): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract updateList(data?: Nullable<InputUpdateList>): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract removeList(uid?: Nullable<string>): Nullable<WishList> | Promise<Nullable<WishList>>;
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
    status?: Nullable<string>;
    uidWishList?: Nullable<string>;
    uid?: Nullable<string>;
    labels?: Nullable<Nullable<string>[]>;
    uidReceiver?: Nullable<string>;
    descriptionReceiver?: Nullable<string>;
    wishList?: Nullable<WishList>;
    likes?: Nullable<number>;
    disLikes?: Nullable<number>;
}

export class User {
    uid: string;
    name?: Nullable<string>;
    email?: Nullable<string>;
    role?: Nullable<Role>;
    createAt?: Nullable<DateTime>;
    updateAt?: Nullable<DateTime>;
    wishLists?: Nullable<Nullable<WishList>[]>;
}

export class WishList {
    uid?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    uidUser: string;
    access?: Nullable<Access>;
    user: User;
    products?: Nullable<Nullable<Product>[]>;
}

export abstract class ISubscription {
    abstract listCreated(uidUser: string): Nullable<WishList> | Promise<Nullable<WishList>>;

    abstract list(uidUser: string): Nullable<WishList> | Promise<Nullable<WishList>>;
}

export type Object = any;
export type DateTime = any;
export type Role = any;
type Nullable<T> = T | null;

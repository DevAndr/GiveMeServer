
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    uid?: Nullable<string>;
}

export class FindUserInput {
    uid?: Nullable<string>;
}

export class GetUser {
    uid?: Nullable<string>;
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
    wishList?: Nullable<WishList>;
}

export class User {
    uid: string;
    name?: Nullable<string>;
    email?: Nullable<string>;
    role?: Nullable<Role>;
    createAt?: Nullable<DateTime>;
    updateAt?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract user(uid: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract wishListForUser(uidUser?: Nullable<string>): Nullable<Nullable<WishList>[]> | Promise<Nullable<Nullable<WishList>[]>>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract findUser(findUserInput: FindUserInput): Nullable<User> | Promise<Nullable<User>>;
}

export class WishList {
    uid?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    uidUser: string;
    user: User;
    products?: Nullable<Nullable<Product>[]>;
}

export type DateTime = any;
export type Role = any;
type Nullable<T> = T | null;

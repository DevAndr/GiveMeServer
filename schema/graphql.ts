
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export class User {
    id: string;
    name?: Nullable<string>;
    email?: Nullable<string>;
    role?: Nullable<Role>;
    createAt?: Nullable<DateTime>;
    updateAt?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract currentUser(): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract updateUser(id: string, params: UpdateUserInput): User | Promise<User>;

    abstract findUser(findUserInput: FindUserInput): Nullable<User> | Promise<Nullable<User>>;
}

export type DateTime = any;
export type Role = any;
type Nullable<T> = T | null;

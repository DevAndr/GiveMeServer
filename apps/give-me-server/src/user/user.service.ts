import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma, User} from '@prisma/client';
import {RemoveListDto} from './dto/remove-list.dto';
import {UpdateDataUserDto} from './dto/update-data-user.dto';
import {PublicDataUserDto} from './dto/public-data-user.dto'; 
import { UpdateUserInput } from 'schema/graphql';


@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
    }

    async getUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return await this.prismaService.user.findUnique({
            where,
        });
    }

    async findUser(where: Prisma.UserWhereUniqueInput): Promise<PublicDataUserDto | null> {
        const user = await this.prismaService.user.findUnique({
            where,
            select: {
                id: true, name: true, email: true, createAt: true, updateAt: true
            }
        });

        return user
    }

    async getUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prismaService.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput,
        data: UpdateUserInput
    }): Promise<PublicDataUserDto> {
        const {where, data} = params;
        const user = await this.prismaService.user.update({
            data,
            where,
            select: {
                id: true, name: true, email: true, createAt: true, updateAt: true
            }
        });

        return user
    }

    async removeListById(removeListDto: RemoveListDto): Promise<User> {
        const {idList, id} = removeListDto;
        return await this.prismaService.user.update({
            where: {
                id,
            },
            data: {
                wishLists: {
                    deleteMany: [{id: idList}],
                },
            },
            include: {

                wishLists: {include: {products: true}},
            },
        });
    }
}

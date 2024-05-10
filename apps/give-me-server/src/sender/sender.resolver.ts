import { Args, Query, Resolver } from "@nestjs/graphql";
import { PrismaService } from "../prisma/prisma.service";
import { GetCurrentUserId, Public } from "../common/decorators";

@Resolver("Sender")
export class SenderResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query("getSenderById")
  async getSenderById(@Args("id") id: string) {
    return this.prisma.sender.findUnique({ where: { id } });
  }

  @Public()
  @Query("getOrCreateSender")
  async getOrCreateSender(@GetCurrentUserId() id: string) {
    if (id) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      const sender = await this.prisma.sender.findUnique({ where: { id } });

      if (!sender)
        return this.prisma.sender.create({
          data: { nickname: user.name, email: user.email, id },
        });

      return sender;
    } else {
      const timestamp = Date.now();
      return this.prisma.sender.create({ data: { nickname: `${timestamp}` } });
    }
  }
}

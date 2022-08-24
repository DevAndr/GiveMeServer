import { Test, TestingModule } from '@nestjs/testing';
import { WishListResolver } from './wish-list.resolver';

describe('WishListResolver', () => {
  let resolver: WishListResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishListResolver],
    }).compile();

    resolver = module.get<WishListResolver>(WishListResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

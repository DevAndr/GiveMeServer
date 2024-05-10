import { Test, TestingModule } from '@nestjs/testing';
import { SenderResolver } from './sender.resolver';

describe('SenderResolver', () => {
  let resolver: SenderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SenderResolver],
    }).compile();

    resolver = module.get<SenderResolver>(SenderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

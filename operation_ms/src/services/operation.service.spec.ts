import { Test, TestingModule } from '@nestjs/testing';
import { OperationService } from './operation.service';

describe('OperationService', () => {
  let provider: OperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationService],
    }).compile();

    provider = module.get<OperationService>(OperationService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

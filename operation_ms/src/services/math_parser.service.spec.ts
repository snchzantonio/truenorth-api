import { Test, TestingModule } from '@nestjs/testing';
import { MathParserService } from './math_parser.service';

describe('MathParserService', () => {
  let provider: MathParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MathParserService],
    }).compile();

    provider = module.get<MathParserService>(MathParserService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

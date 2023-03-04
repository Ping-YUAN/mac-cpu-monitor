import { Test, TestingModule } from '@nestjs/testing';
import { CpuLoadGateway } from './cpu-load.gateway';

xdescribe('CpuLoadGateway', () => {
  let gateway: CpuLoadGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpuLoadGateway],
    }).compile();

    gateway = module.get<CpuLoadGateway>(CpuLoadGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

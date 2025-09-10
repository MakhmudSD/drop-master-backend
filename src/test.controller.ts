import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('public')
  getPublic() {
    return { message: 'This should work without any authentication' };
  }
}

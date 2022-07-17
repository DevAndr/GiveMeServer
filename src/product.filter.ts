import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class ProductFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}

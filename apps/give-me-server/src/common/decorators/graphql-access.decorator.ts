import { SetMetadata } from '@nestjs/common';


export const GraphqlAccess = () => SetMetadata('isGraphql', true)


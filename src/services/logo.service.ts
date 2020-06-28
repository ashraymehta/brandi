import {bind, BindingScope} from '@loopback/core';

@bind({scope: BindingScope.TRANSIENT})
export class LogoService {
  constructor() {}

  getFor(brandName: string) {
    throw new Error(`Not yet implemented`);
  }
}

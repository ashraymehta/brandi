import {LogoService} from '../../../services';
import {instance, mock, verify} from 'ts-mockito';
import {LogoController} from '../../../controllers';

describe(LogoController.name, () => {
  const logoService = mock(LogoService);
  const controller = new LogoController(instance(logoService));

  it('should invoke logo service to get logo', async function () {
    const brandName = 'a-brand-name';

    await controller.get(brandName);

    verify(logoService.getFor(brandName)).once();
  });
});

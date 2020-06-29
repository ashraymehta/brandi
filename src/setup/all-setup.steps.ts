import {SetupData} from './setup.step';
import {ServerStep} from './server-setup.step';
import {DependencyInjectionStep} from './dependency-injection.step';

export class AllSetupSteps {
  private readonly steps = [new DependencyInjectionStep(), new ServerStep()];

  async execute(): Promise<SetupData> {
    const setupData = {} as SetupData;
    for (const step of this.steps) {
      await step.execute(setupData);
    }
    return setupData;
  }
}

import {Container} from 'inversify';
import {Application} from 'express';

export interface SetupData {
  application: Application;
  container: Container;
}

export interface SetupStep {
  execute(setupData: SetupData): Promise<void>;
}

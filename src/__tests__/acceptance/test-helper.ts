import 'reflect-metadata';
import {Server} from 'http';
import {Application} from 'express';
import {AllSetupSteps} from '../../setup/all-setup.steps';

export async function startApplication(): Promise<{
  server: Server;
  app: Application;
}> {
  const setupData = await new AllSetupSteps().execute();
  setupData.application.listen();
  return {server: setupData.application.listen(), app: setupData.application};
}

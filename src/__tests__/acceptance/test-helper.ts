import 'reflect-metadata';
import {Server} from 'http';
import {Application} from 'express';
import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {AllSetupSteps} from '../../setup/all-setup.steps';

export async function startApplication(): Promise<{
  server: Server;
  app: Application;
}> {
  const setupData = await new AllSetupSteps().execute();
  setupData.application.listen();
  return {server: setupData.application.listen(), app: setupData.application};
}

export async function setupTestDatabase(): Promise<MongoClient> {
  const mongod = new MongoMemoryServer();
  const uri = await mongod.getUri();
  return MongoClient.connect(uri, {useUnifiedTopology: true});
}

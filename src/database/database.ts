import chalk from 'chalk';
import { Connection, connection, connect as mongoConnect, disconnect as mongoDisconnect } from 'mongoose';

let database: Connection;

export const connect = async () => {
  const databaseAddress = process.env.DATABASE_ADDRESS || 'localhost';
  const databasePort = process.env.DATABASE_PORT || '27017';
  const databaseUsername = process.env.DATABASE_USERNAME || '';
  const databasePassword = process.env.DATABASE_PASSWORD || '';

  let databaseUrl = `${databaseAddress}`;

  if (databaseAddress.includes('localhost')) databaseUrl += `:${databasePort}`;
  const databaseCredentials = databaseUsername && databasePassword ? `${databaseUsername}:${encodeURIComponent(databasePassword)}@` : '';
  
  const mongoURI = `mongodb+srv://${databaseCredentials}${databaseUrl}/recipe?authSource=admin`;

  if (database) return;

  mongoConnect(mongoURI, { useNewUrlParser: true });

  database = connection;

  database.once('open', async () => {
    console.info(chalk.yellow(`Connected to the database at: ${databaseAddress}`));
  });
  database.on('error', () => {
    console.error(chalk.red('There was an error connecting to the database!'));
  });
};

export const disconnect =() => {
  if (!database) return;
  mongoDisconnect();
  console.info(chalk.red('Disconnected from the database!'));
};

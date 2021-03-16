import { Connection, connection, connect as mongoConnect, disconnect as mongoDisconnect } from 'mongoose';

let database: Connection;

export const connect = async () => {
  const databaseAddress = process.env.DATABASE_ADDRESS || 'localhost';
  const databasePort = process.env.DATABASE_PORT || '27017';

  const mongoURI = `mongodb://${databaseAddress}:${databasePort}/recipe`;

  if (database) return;

  mongoConnect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  database = connection;

  database.once('open', async () => {
    console.info(`Connected to the database at: ${mongoURI}`);
  });
  database.on('error', () => {
    console.error('There was an error connecting to the database!');
  });
};

export const disconnect =() => {
  if (!database) return;
  mongoDisconnect();
  console.info('Disconnected from the database!');
};

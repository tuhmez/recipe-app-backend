import { connect } from 'socket.io-client';
import {
  ADD_RECIPE_REQUEST,
  ADD_RECIPE_RESPONSE,
  EDIT_RECIPE_REQUEST,
  EDIT_RECIPE_RESPONSE,
  DELETE_RECIPE_REQUEST,
  DELETE_RECIPE_RESPONSE,
  GET_RECIPES_REQUEST,
  GET_RECIPES_RESPONSE,
  GET_RECIPE_BY_ID_REQUEST,
  GET_RECIPE_BY_ID_RESPONSE,
  ERROR,
  PING,
  PONG,
} from '../../src/communications/constants';
import { Communications } from '../../src/communications/index';

describe('constants test', () => {
  test('all strings valid', (done) => {
    expect(ADD_RECIPE_REQUEST).toBeTruthy();
    expect(ADD_RECIPE_RESPONSE).toBeTruthy();
    expect(EDIT_RECIPE_REQUEST).toBeTruthy();
    expect(EDIT_RECIPE_RESPONSE).toBeTruthy();
    expect(DELETE_RECIPE_REQUEST).toBeTruthy();
    expect(DELETE_RECIPE_RESPONSE).toBeTruthy();
    expect(GET_RECIPES_REQUEST).toBeTruthy();
    expect(GET_RECIPES_RESPONSE).toBeTruthy();
    expect(GET_RECIPE_BY_ID_REQUEST).toBeTruthy();
    expect(GET_RECIPE_BY_ID_RESPONSE).toBeTruthy();
    expect(ERROR).toBeTruthy();
    expect(PING).toBeTruthy();
    expect(PONG).toBeTruthy();
    done();
  });
});

describe('communications test', () => {
  let server: Communications;
  const port = 3333;

  beforeAll(() => {
    server = new Communications(port);
  });

  afterAll(() => {
    server.io.close();
  });

  test('server gets created', (done) => {
    expect(server).toBeTruthy();
    expect(server.io).toBeTruthy();
    done();
  });

  test('connected client - PING', (done) => {
    const client = connect(`http://localhost:${port}`);
    client.on('PONG', (response: { status: string }) => {
      expect(response.status).toBe('OK');
      client.disconnect();
      done();
    });
    client.emit('PING');
  });
});

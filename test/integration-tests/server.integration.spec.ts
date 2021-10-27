import { connect, Socket as ClientSocket} from "socket.io-client";
import { Communications } from "../../src/communications";
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
  ERROR
} from "../../src/communications/constants";

describe("verifying generic socket server works", () => {
  let server: Communications, clientSocket: ClientSocket;
  const port = 3333;

  beforeAll((done) => {
    server = new Communications(port);
    clientSocket = connect(`http://localhost:${port}`);
    done();
  });

  afterAll(() => {
    clientSocket.close();
    server.io.close();
  });

  // TODO: Add integration tests with mongo
  // test(ADD_RECIPE_REQUEST, (done) => {

  // });
});

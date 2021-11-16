import { connect, Socket as ClientSocket} from "socket.io-client";
import { Communications } from "../../src/communications";

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

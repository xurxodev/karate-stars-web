import * as CompositionRoot from "./CompositionRoot";
import { Server } from "./server";

CompositionRoot.init();

const server = new Server();
server.start();

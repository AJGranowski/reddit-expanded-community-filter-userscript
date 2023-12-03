import { TextEncoder, TextDecoder } from "util";

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn()
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
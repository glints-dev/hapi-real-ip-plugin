import * as Hapi from "@hapi/hapi";

import RealIPPlugin from "./RealIPPlugin";

describe("RealIPPlugin", () => {
  let server: Hapi.Server;
  let spy: jest.Mock<symbol, [Hapi.Request, Hapi.ResponseToolkit]>;

  beforeEach(() => {
    spy = jest.fn(
      (request: Hapi.Request, h: Hapi.ResponseToolkit) => h.continue
    );

    server = new Hapi.Server();
    server.route({
      method: "*",
      path: "/{p*}",
      handler: spy,
    });
  });

  it("should be registered", async () => {
    await server.register({ plugin: RealIPPlugin });
    expect(server.registrations.RealIPPlugin).toBeTruthy();
  });

  describe("Plugin Functionality", () => {
    it("should pass address as-is without X-Forwarded-For header", async () => {
      await server.register({ plugin: RealIPPlugin });
      await server.inject({
        url: "/",
        remoteAddress: "1.2.3.4",
      });

      const request = spy.mock.calls[0][0];
      expect(request.plugins.RealIPPlugin.ip).toStrictEqual("1.2.3.4");
    });

    it("should set request.info.remoteAddress with X-Forwarded-For header", async () => {
      await server.register({
        plugin: RealIPPlugin,
        options: {
          numProxies: 1,
        },
      });

      await server.inject({
        url: "/",
        remoteAddress: "1.2.3.4",
        headers: {
          "X-Forwarded-For": "2.3.4.5",
        },
      });

      const request = spy.mock.calls[0][0];
      expect(request.plugins.RealIPPlugin.ip).toStrictEqual("2.3.4.5");
    });

    it("should handle multiple headers", async () => {
      await server.register({
        plugin: RealIPPlugin,
        options: {
          numProxies: 2,
        },
      });

      await server.inject({
        url: "/",
        remoteAddress: "1.2.3.4",
        headers: {
          "X-Forwarded-For": "3.4.5.6, 4.5.6.7",
        },
      });

      const request = spy.mock.calls[0][0];
      expect(request.plugins.RealIPPlugin.ip).toStrictEqual("3.4.5.6");
    });
  });
});

import 'mocha';

import { assert } from 'chai';
import * as Sinon from 'sinon';

import * as Hapi from '@hapi/hapi';

import RealIPPlugin from './RealIPPlugin';

describe('RealIPPlugin', () => {
  let server: Hapi.Server;
  let spy: Sinon.SinonSpy<[Hapi.Request, Hapi.ResponseToolkit]>;

  before(() => {
    spy = Sinon.spy((request: Hapi.Request, h: Hapi.ResponseToolkit) => h.continue);
  });

  beforeEach(() => {
    server = new Hapi.Server();
    server.route({
      method: '*',
      path: '/{p*}',
      handler: spy,
    });
  });

  afterEach(() => {
    spy.resetHistory();
  });

  it('should be registered', async () => {
    await server.register({ plugin: RealIPPlugin });
    assert.exists(server.registrations.RealIPPlugin);
  });

  describe('Plugin Functionality', () => {
    it('should pass address as-is without X-Forwarded-For header', async () => {
      await server.register({ plugin: RealIPPlugin });
      await server.inject({
        url: '/',
        remoteAddress: '1.2.3.4',
      });

      const request = spy.args[0][0];
      assert.strictEqual(request.plugins.RealIPPlugin.ip, '1.2.3.4');
    });

    it('should set request.info.remoteAddress with X-Forwarded-For header', async () => {
      await server.register({
        plugin: RealIPPlugin,
        options: {
          numProxies: 1,
        },
      });

      await server.inject({
        url: '/',
        remoteAddress: '1.2.3.4',
        headers: {
          'X-Forwarded-For': '2.3.4.5',
        },
      });

      const request = spy.args[0][0];
      assert.strictEqual(request.plugins.RealIPPlugin.ip, '2.3.4.5');
    });

    it('should handle multiple headers', async () => {
      await server.register({
        plugin: RealIPPlugin,
        options: {
          numProxies: 2,
        },
      });

      await server.inject({
        url: '/',
        remoteAddress: '1.2.3.4',
        headers: {
          'X-Forwarded-For': '3.4.5.6, 4.5.6.7',
        },
      });

      const request = spy.args[0][0];
      assert.strictEqual(request.plugins.RealIPPlugin.ip, '3.4.5.6');
    });
  });
});

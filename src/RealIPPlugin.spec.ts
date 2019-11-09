import 'mocha';

import { assert } from 'chai';
import * as Sinon from 'sinon';

import * as Hapi from '@hapi/hapi';

import RealIPPlugin from './RealIPPlugin';

describe('RealIPPlugin', () => {
  let server: Hapi.Server;
  let spy: Sinon.SinonSpy<[any, Hapi.ResponseToolkit]>;

  before(() => {
    spy = Sinon.spy((request: any, h: Hapi.ResponseToolkit) => h.continue);
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
    assert.exists((server.registrations as any)[RealIPPlugin.name]);
  });

  describe('Plugin Functionality', () => {
    it('should pass address as-is without X-Forwarded-For header', async () => {
      await server.register({ plugin: RealIPPlugin });
      await server.inject({
        url: '/',
        remoteAddress: '1.2.3.4',
      });

      const request = spy.args[0][0] as Hapi.Request;
      assert.strictEqual(request.info.remoteAddress, '1.2.3.4');
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

      const request = spy.args[0][0] as Hapi.Request;
      assert.strictEqual(request.info.remoteAddress, '2.3.4.5');
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

      const request = spy.args[0][0] as Hapi.Request;
      assert.strictEqual(request.info.remoteAddress, '3.4.5.6');
    });
  });
});

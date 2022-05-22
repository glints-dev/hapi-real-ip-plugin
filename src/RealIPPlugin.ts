import * as Hapi from '@hapi/hapi';

export interface RealIPPluginOptions {
  numProxies: number;
}

export interface RealIPPluginState {
  ip?: string;
}

declare module '@hapi/hapi' {
  interface PluginsListRegistered {
    RealIPPlugin?: PluginRegistered;
  }

  interface PluginsStates {
    RealIPPlugin?: RealIPPluginState;
  }
}

const RealIPPlugin: Hapi.Plugin<RealIPPluginOptions> & Hapi.PluginNameVersion = {
  name: 'RealIPPlugin',
  register: async (server, options) => {
    server.ext('onRequest', async (request, h) => {
      request.plugins.RealIPPlugin = {
        ip: request.info.remoteAddress,
      };

      const xffHeader = request.headers['x-forwarded-for'];
      if (!xffHeader) {
        return h.continue;
      }

      // X-Forwarded-For can contain more than a single IP address.
      // https://tools.ietf.org/html/rfc7239 - Section 7.4
      const downstreamNodes = xffHeader.split(',').map(part => part.trim());

      // X-Forwarded-For can be spoofed, so be sure to compare with the expected
      // number of proxies.
      if (downstreamNodes.length === options.numProxies) {
        request.plugins.RealIPPlugin.ip = downstreamNodes[0];
      }

      return h.continue;
    });
  },
};

export default RealIPPlugin;

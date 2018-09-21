# real-ip-plugin [![npm version](https://badge.fury.io/js/%40glints%2Fhapi-real-ip-plugin.svg)](https://badge.fury.io/js/%40glints%2Fhapi-real-ip-plugin) [![Greenkeeper badge](https://badges.greenkeeper.io/glints-dev/hapi-real-ip-plugin.svg)](https://greenkeeper.io/)

This plugin resolves client's IP address from the `X-Forwarded-For` header if
any downstream proxies are present. The resolved addresses are stored in
`request.info.remoteAddress`.

# Usage Instructions

To integrate this into your project, install the package:

```
npm install --save @glints/hapi-real-ip-plugin  # If using npm
yarn add @glints/hapi-real-ip-plugin            # If using Yarn
```

Then register the plugin with hapi:

```js
import { RealIPPlugin } from '@glints/hapi-real-ip-plugin';

// Register the plugin with the hapi server.
await hapiServer.register({
  plugin: RealIPPlugin,
  options: {
    numProxies: 1, // Indicates the expected number of downstream proxies.
  },
});
```

# Contribution Guidelines

We use [EditorConfig](https://editorconfig.org) to maintain consistent line-ending and indentation rules across all our projects. Ensure that you have the appropriate plugin installed in your preferred editor, or refer to `.editorconfig`.

# About Glints

Glints is an online talent recruitment and career discovery platform headquartered in Singapore. It is a platform for young talent to build up their career readiness through internships and graduate jobs; developing skill sets required in different careers.

**P.S.** We deal with quite a number of interesting engineering problems centered on matching the right talent to employers. Sounds interesting? Send your resume to tech@glints.com.

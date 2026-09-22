# Metro Custom Path Resolver

Override files from a base source tree with files in a project-specific tree. This is a Metro `resolver.resolveRequest` hook, not a webpack plugin or a hot-reload switch.

## Version and limitations

This README describes `@lomray/metro-custom-path-resolver@1.0.0`. The package has no declared Metro compatibility range and requires `metro-resolver` without declaring it as a dependency. Make that module available alongside this package, using the version matching your Metro installation. Verify against your real Metro version before adopting it; no claim of current Metro compatibility is made here.

Only requests beginning with `./` are candidates for substitution. Bare aliases, package imports, absolute imports and `../` imports are passed to Metro unchanged. The importer path must contain the `rootPath` string, and neither it nor the request may match `excludePath`. This uses substring matching, not directory containment: `/app/src` also matches `/app/src-other`. Choose paths carefully; `rootPath` is not a sandbox or security boundary. The original request is retried if resolving the override throws.

## Install

```sh
npm install --save-dev @lomray/metro-custom-path-resolver@1.0.0
```

## Configure Metro

Merge this resolver setting into your existing `metro.config.js`, retaining any other app-specific Metro configuration. The example assumes `metro-resolver` is already resolvable as described above.

<!-- docs-example: metro -->
```js
const path = require('node:path');
const CustomPathResolver = require('@lomray/metro-custom-path-resolver');

module.exports = {
  resolver: {
    resolveRequest: CustomPathResolver({
      rootPath: path.resolve(__dirname, 'src'),
      projectPath: path.resolve(__dirname, 'src/custom-dir'),
      excludePath: /(custom-dir|node_modules)/,
    }),
  },
};
```

With this layout:

```text
src/
  index.js
  components/card.js
  custom-dir/components/card.js
```

A request for `./components/card` from `src/index.js` tries `src/custom-dir/components/card` first, then falls back to the original request. Keep the override directory excluded to prevent recursive substitution. To refer back to the base file from an override, use an appropriate relative path such as `../../components/card`; `../` requests are not intercepted.

This hook clears `context.resolveRequest` before delegating to `metro-resolver`. It does not chain another custom resolver. There is no runtime listener to clean up; removing the Metro configuration disables the hook.

## Source

[Repository](https://github.com/Lomray-Software/metro-custom-path-resolver) · [npm](https://www.npmjs.com/package/@lomray/metro-custom-path-resolver)

The published package still contains the repository's former MatthewPattell URL, which redirects to Lomray-Software.

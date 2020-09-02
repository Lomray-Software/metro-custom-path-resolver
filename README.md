# Metro Custom Path Resolver

.  
└── src  
    ├── assets  
    │   └── sample-icon.jpg  
    ├── components  
    │   └── sample-component.js  
    ├── custom-dir  
    │   ├── assets  
    │   │   └── sample-icon.jpg  
    │   └── components  
    │       └── sample-component.js  
    └── index.js  

Content index.js:
```js
import image from 'assets/sample-icon.jpg';
import { DemoComponent } from 'components/sample-component.js';

...
```

This module, resolve original ``sample-icon.jpg`` and ``sample-component.js`` from `custom-dir`, if they exist.

PS: For import an original module from resolved, use a relative path instead alias, in other cases, use aliases.

## Installation & Usage

First, install the npm module.

```sh
npm install --save-dev @lomray/metro-custom-path-resolver
```

Next, enable hot reloading in your webpack config:  
1. Import in metro.config.js:
    ```js
    const path               = require('path')
    const fs                 = require('fs')
    const CustomPathResolver = require('@lomray/metro-custom-path-resolver')
   
    const appDirectory = fs.realpathSync(process.cwd())
    const resolveApp   = relativePath => path.resolve(appDirectory, relativePath)
    ```
2. Add the module to the `resolve` / `plugins` array:
    ```js
    module.exports = {
       resolver:    {
           resolveRequest: CustomPathResolver({
               excludePath: /(custom-dir|node_modules)/,
               rootPath:    resolveApp('src/'),
               projectPath: resolveApp(`src/custom-dir/`),
           })
       }
    }
    ```

You're all set!

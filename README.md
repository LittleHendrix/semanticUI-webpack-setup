# SemanticUI-webpack-setup #
---
Semantic UI with webpack build system

* Version **^2.2.10**

## How do I get set up? ##

* Install nodejs ersion 6.x from [nodejs.org](https://nodejs.org/en/)
* Configure proxy for npm
    + **`npm config set proxy http://ediproxy:8080`**
    + **`npm config set https-proxy http://ediproxy:8080`**

#### Project init ####

+ **`cd`** into the root folder (where `package.json` is located) and run **`npm install`**

#### Start in webpack devServer mode ####

* run **`npm start`** `(http://localhost:9999)`

#### Run Bundle Analyser ####

* run **`npm run analyze`** `(http://127.0.0.1:8888)`

#### Watch ####

* run **`npm run watch`**

when in **watch** mode, css output is not production ready as declarations contain absolute path that points to devServer. e.g. `src:url(http://localhost:9999//assets/fonts/icons.eot);`

#### Build for production ####

* run **`npm run build`**

cleans `dist` directory and rebuild all source files in minified version

##### Configuration for deployment #####

+ update `publicPath` property in `webpack.config.js` to match the setup in your environment. e.g. If your stylesheets are located inside `~/css/` folder:

```javascript
const webpackProdOptions =
    {
        output: {
            path: CONFIG.paths.dist,
            publicPath: '/css/',
            filename: 'bundle.min.js'
        }
    };
...
```


## Customization ##

### Components ###
* comment/uncomment individual component in `~/scr/semantic/semantic.less` to include/omit in the style bundle
```less
/* Global */
& { @import "~semantic-ui-less/definitions/globals/reset"; }
& { @import "~semantic-ui-less/definitions/globals/site"; }

/* Elements */
& { @import "~semantic-ui-less/definitions/elements/button"; }
// & { @import "~semantic-ui-less/definitions/elements/container"; }
// & { @import "~semantic-ui-less/definitions/elements/divider"; }
// & { @import "~semantic-ui-less/definitions/elements/flag"; }
& { @import "~semantic-ui-less/definitions/elements/header"; }
& { @import "~semantic-ui-less/definitions/elements/icon"; }
& { @import "~semantic-ui-less/definitions/elements/image"; }
& { @import "~semantic-ui-less/definitions/elements/input"; }
& { @import "~semantic-ui-less/definitions/elements/label"; }
& { @import "~semantic-ui-less/definitions/elements/list"; }
// & { @import "~semantic-ui-less/definitions/elements/loader"; }
...
```
* comment/uncomment individual component in `~/scr/semantic/semantic.js` to include/omit in the script bundle
```javascript
import 'semantic-ui-less/definitions/globals/site';
// import 'semantic-ui-less/definitions/modules/accordion';
import 'semantic-ui-less/definitions/modules/checkbox';
import 'semantic-ui-less/definitions/modules/dimmer';
import 'semantic-ui-less/definitions/modules/dropdown';
// import 'semantic-ui-less/definitions/modules/embed';
import 'semantic-ui-less/definitions/modules/modal';
// import 'semantic-ui-less/definitions/modules/nag';
// import 'semantic-ui-less/definitions/modules/popup';
import 'semantic-ui-less/definitions/modules/progress';
import 'semantic-ui-less/definitions/modules/rating';
import 'semantic-ui-less/definitions/modules/search';
...
```

### Themes ###

* uncomment and edit variable values as needed (e.g. `~/src/semantic/themes/woodmac/globals/site.variables`) 
```less
// /*---  Colors  ---*/
@red              : #85102E;
// @orange           : #F2711C;
@yellow           : #eaa814;
// @olive            : #B5CC18;
@green            : #14472A;
@teal             : #126474;
@blue             : #002257;
@violet           : #776791;
@purple           : #5A1B47;
// @pink             : #E03997;
// @brown            : #A5673F;
@grey             : #adafb2;
@black            : #232323;
...
```
* use `*.overrides` add custom CSS(less) declarations (e.g. `~/src/semantic/themes/woodmac/globals/site.overrides`)

##### Theme files location #####
* `~/src/semantic/themes/{theme-name}/**/*.overrides`
* `~/src/semantic/themes/{theme-name}/**/*.variables`


### Site specific overrides ###

* only add varibales as needed
    + check for available variables in `~/src/semantic/themes/default/globals/site.variables`
* use `*.overrides` to add custom CSS(less) declarations

##### Site files location #####
* `~/src/semantic/site/**/*.overrides`
* `~/src/semantic/site/**/*.variables`


### Webpack bundle ###
edit `~/src/index.js` to add/remove what's included in webpack bundle
```javascript
// import only the selected components through our local semantic.less file
import './semantic/semantic.less';
// import only the selected semantic JS modules
import './semantic/semantic';
// import './path-to/your-custom-code';
...
```
* html (Semantic UI kitchen sink for devServer)
    + `~/src/index.html` - edit this file to render each Semantic UI components
* images
    + `~/src/images/*.*` - processed images will be moved to `~/dist/assets/images/'` folder


# Semantic UI theme guideline (official) #
---
> UI customization should be applied as a site theme – `src/themes/{theme-name}/`

+ `.override` = additional CSS rules which modify the baseline definition
+ `.variable` = modify the default Semantic variables (3000+)
+ Only add variables which you wish to modify; check src/themes/default/ to view all default variables for Semantic.
+ Global theming file `src/semantic.config` allows you to select packaged theme for each UI element

### Global inheritance ###

> **Semantic** Library Defaults -> **Theme** Package Defaults -> **Site** User Overrides

1. Site variables
    * Defaults pulled from `src/themes/default/site.variables`
    * Packaged theme overrides pulled for site from `src/themes/{themename}/site.variables`
    *	Site overrides pulled from `src/site/site.variables`

2. Element variables
    * Button default variables from `src/themes/default/elements/button.variables`
    * Button packaged-theme variables from `src/themes/{theemname}/elements/button.variables`
    * Button's site theme from `src/site/elements/button/variables`

> Site theme overrides are home to the **arbitrary** or **temporaneous** aspects of an element for integrating it on a site. Hacks, one-time fixes, shortcuts, .etc are all sometimes important parts of making a website work, but aren't things we want to re-use from project to project. Using a **site override** file for an element, allows you to make these concessions without sullying the re-usability of the rest of your code.
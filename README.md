# semanticUI-webpack-setup #
Semantic UI with webpack build system

* Semantic UI theme project (Woodmac theme)
* Version 2.2.10

## How do I get set up? ##

Install version 6.x from nodejs
Configure proxy for npm

* npm config set proxy http://ediproxy:8080
* npm config set https-proxy http://ediproxy:8080

### Project init ###
* **npm install**

### Watch ###
* **npm start**

### Build for production ###
* **npm run build**


## Customization ##

### Themes ### 
* uncomment and edit variable values as needed 
* use `*.overrides` sparingly

##### Source file location #####
* `~/src/themes/{theme-name}/**/*.overrides`
* `~/src/themes/{theme-name}/**/*.variables`


### Site overrides ###

* only add varibales as needed 
* use `*.overrides` to add custom CSS(less) declarations

##### Source file location #####
* `~/src/site/**/*.overrides`
* `~/src/site/**/*.variables`


# Semantic UI theme guideline (official) #
UI customization should be applied as a site theme – `src/themes/{theme-name}/`
* `.override` = additional CSS rules which modify the baseline definition
* `.variable` = modify the default Semantic variables (3000+)
* Only add variables which you wish to modify; check src/themes/default/ to view all default variables for Semantic.
* Global theming file `src/semantic.config` allows you to select packaged theme for each UI element

### Global inheritance ###

**Semantic** Library Defaults -> **Theme** Package Defaults -> **Site** User Overrides

1. Site variables
  * Defaults pulled from `src/themes/default/site.variables`
  * Packaged theme overrides pulled for site from `src/themes/{themename}/site.variables`
  *	Site overrides pulled from `src/site/site.variables`

2. Element variables
  * Button default variables from `src/themes/default/elements/button.variables`
  * Button packaged-theme variables from `src/themes/{theemname}/elements/button.variables`
  * Button's site theme from `src/site/elements/button/variables`


Site theme overrides are home to the **arbitrary** or **temporaneous** aspects of an element for integrating it on a site. Hacks, one-time fixes, shortcuts, .etc are all sometimes important parts of making a website work, but aren't things we want to re-use from project to project. Using a **site override** file for an element, allows you to make these concessions without sullying the re-usability of the rest of your code.
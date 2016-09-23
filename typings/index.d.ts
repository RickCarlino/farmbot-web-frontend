/// <reference path="globals/axios/index.d.ts" />
/// <reference path="globals/es6-promise/index.d.ts" />
/// <reference path="globals/jasmine-ajax/index.d.ts" />
/// <reference path="globals/jasmine/index.d.ts" />
/// <reference path="globals/joi/index.d.ts" />
/// <reference path="globals/jquery/index.d.ts" />
/// <reference path="globals/lodash/index.d.ts" />
/// <reference path="globals/node/index.d.ts" />
/// <reference path="globals/react-addons-test-utils/index.d.ts" />
/// <reference path="globals/react-dom/index.d.ts" />
/// <reference path="globals/react-redux/index.d.ts" />
/// <reference path="globals/react-router-redux/index.d.ts" />
/// <reference path="globals/react-router/history/index.d.ts" />
/// <reference path="globals/react-router/index.d.ts" />
/// <reference path="globals/react/index.d.ts" />
/// <reference path="globals/redux-thunk/index.d.ts" />
/// <reference path="globals/redux/index.d.ts" />
/// <reference path="globals/sinon/index.d.ts" />
/// <reference path="globals/toastr/index.d.ts" />
/// <reference path="globals/webpack-require/webpack-require.d.ts" />
/** This is webpacks i18n function. */

interface I18nFunction {
    (input: string): string;
    (input: string, vars: {[name: string]: any} ): string;
}
declare var __: I18nFunction;
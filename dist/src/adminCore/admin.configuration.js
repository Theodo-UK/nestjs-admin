"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppConfiguration = exports.defaultAdminConfigurationOptions = exports.publicFolder = void 0;
const path_1 = require("path");
const lodash_1 = require("lodash");
exports.publicFolder = path_1.join(__dirname, '..', 'public');
function serializeAdminUser(user, done) {
    done(null, user);
}
function deserializeAdminUser(payload, done) {
    done(null, payload);
}
exports.defaultAdminConfigurationOptions = {
    session: {
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    },
    assetPrefix: '/admin-static',
    serializeUser: serializeAdminUser,
    deserializeUser: deserializeAdminUser,
};
function createAppConfiguration(userConfig) {
    const config = lodash_1.merge({}, exports.defaultAdminConfigurationOptions, userConfig);
    return config;
}
exports.createAppConfiguration = createAppConfiguration;
//# sourceMappingURL=admin.configuration.js.map
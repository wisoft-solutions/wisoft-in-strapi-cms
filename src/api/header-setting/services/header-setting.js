'use strict';

/**
 * header-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::header-setting.header-setting');

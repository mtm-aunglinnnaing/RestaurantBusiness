'use strict';
const _ = require('lodash');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getBestSellingMenu(ctx) {
    const entity = await strapi.services["restaurants"].getBestSellingMenu(ctx);
    return entity;
  },
};

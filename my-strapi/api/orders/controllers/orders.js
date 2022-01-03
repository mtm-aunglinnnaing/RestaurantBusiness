'use strict';
const _ = require('lodash');
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getBestBuyingCustomer(ctx) {
    // console.log('ctx.query,', ctx.query)
    let params = {
      ...ctx.query
    };
    // params = {
    //   '_sort': 'sold_out_numbers:DESC'
    // };
    let entities = await strapi.services.orders.find(params);
    if (!entities) {
      return entities;
    }
    // console.log('entities data,', entities)
    // entities.sort((a, b) => a.orders.length < b.orders.length ? 1 : -1)
    return sanitizeEntity(entities, { model: strapi.models.orders });
  },
};

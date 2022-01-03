'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  getDateRange: () => {
    const today = new Date();
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    return {
      lastWeek: lastWeek.toISOString(),
      lastMonth: lastMonth.toISOString(),
      lastYear: lastYear.toISOString(),
      now: now.toISOString(),
    }
  },

  async getBestSellingMenu(ctx) {
    const { date } = ctx.params;

    let entities = await strapi.services.restaurants.find();
    if (!entities) {
      return entities;
    }

    let result = entities.map((el) => {
      const o = Object.assign({}, el);
      const bestMenu = this.getBestMenu(el.orders, date);
      o.bestMenuId = bestMenu?.bestMenuId;
      o.totalOrder = bestMenu?.totalOrder;
      o.mostOrderId = bestMenu?.mostOrder;
      return o;
    })
    return sanitizeEntity(result, { model: strapi.models.restaurants });
  },

  getMostOccurance(array, dateTime) {
    const dateRange = this.getDateRange();
    //for getting best menu item
    let bestMenuCount = {};
    let menuCount = 0;
    let topMenu = {};
    array.forEach(function (item, val) {
      if (item.order_time > dateTime && item.order_time <= dateRange.now) {
        bestMenuCount[item.menu] = bestMenuCount[item.menu] + 1 || 1;
        if (bestMenuCount[item.menu] > menuCount) {
          topMenu = item.menu;
          menuCount = bestMenuCount[item.menu];
        }
      }
    });
    //for getting most order customer of best menu
    let mostOrderCount = {};
    let customerCount = 0;
    let topCustomer = {};
    array.forEach(function (item, val) {
      if (item.order_time > dateTime && item.order_time <= dateRange.now && item.menu === topMenu) {
        mostOrderCount[item.customer] = mostOrderCount[item.customer] + 1 || 1;
        if (mostOrderCount[item.customer] > customerCount) {
          topCustomer = item.customer;
          customerCount = mostOrderCount[item.customer];
        }
      }
    });
    //for getting total order of best menu 
    let filteredList = array.filter((item) => {
      return item.order_time > dateTime && item.order_time <= dateRange.now && item.menu === topMenu && item.customer === topCustomer;
    });
    let topOrder = filteredList.length;
    return {
      bestMenuId: topMenu,
      filteredList: topOrder,
      customerId: topCustomer,
    }
  },

  getBestMenu(array, date) {
    if (array.length == 0)
      return null;
    let bestMenuId;
    let filteredList;
    let customerId;
    if (date === 'lastWeek') {
      const dateRange = this.getDateRange();
      const mostOccurance = this.getMostOccurance(array, dateRange.lastWeek);
      bestMenuId = mostOccurance.bestMenuId;
      filteredList = mostOccurance.filteredList;
      customerId = mostOccurance.customerId;
    } else if (date === 'lastMonth') {
      const dateRange = this.getDateRange();
      const mostOccurance = this.getMostOccurance(array, dateRange.lastMonth);
      bestMenuId = mostOccurance.bestMenuId;
      filteredList = mostOccurance.filteredList;
      customerId = mostOccurance.customerId;
    } else if (date === 'lastYear') {
      const dateRange = this.getDateRange();
      const mostOccurance = this.getMostOccurance(array, dateRange.lastYear);
      bestMenuId = mostOccurance.bestMenuId;
      filteredList = mostOccurance.filteredList;
      customerId = mostOccurance.customerId;
    } else {
      console.error('Invalid date format!')
    }
    return {
      bestMenuId: bestMenuId,
      totalOrder: filteredList,
      mostOrder: customerId,
    }
  },
};

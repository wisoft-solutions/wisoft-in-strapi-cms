'use strict';

/**
 * page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page.page', ({ strapi }) => ({

  async find(ctx) {
    const { slug, id, populate = '*' } = ctx.query;

    // If slug is provided, fetch by slug
    if (slug) {
      const entity = await strapi.entityService.findMany('api::page.page', {
        filters: { slug: { $eq: slug } },
        populate,
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound(`No page found with slug: ${slug}`);
      }

      const sanitized = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitized);
    }

    // If ID is provided, fetch by ID
    if (id) {
      const entity = await strapi.entityService.findOne('api::page.page', id, {
        populate,
      });

      if (!entity) {
        return ctx.notFound(`No page found with id: ${id}`);
      }

      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    }

    // Default behavior: return all pages
    return super.find(ctx);
  },

}));

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service', ({ strapi }) => ({

  async find(ctx) {

    const { slug } = ctx.query;

    // If slug param is present, search by slug
    if (slug) {

      const entity = await strapi.entityService.findMany('api::service.service', {
        filters: { Slug: { $eq: slug } },
        populate: ctx.query.populate || '*',
      });

          console.log('Query params:', entity,slug);

      if (!entity || entity.length === 0) {
        return ctx.notFound('No service found with this slug');
      }

      // Return just that one entity
      const sanitized = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitized);
    }

    // Default: return all services
    return super.find(ctx);
  }
  
}));

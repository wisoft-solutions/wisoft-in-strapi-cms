"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::author.author", ({ strapi }) => ({
  async findOne(ctx) {
    const { slug } = ctx.params;

    const query = {
      filters: { slug },
      ...ctx.query,
    };

    const post = await strapi.entityService.findMany("api::author.author", query);

    const sanitizedEntity = await this.sanitizeOutput(post);

    return this.transformResponse(sanitizedEntity[0]);
  },
}));


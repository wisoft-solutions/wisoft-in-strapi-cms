'use strict';

/**
 * homepage controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::homepage.homepage', ({ strapi }) => ({
  async bundle(ctx) {

    const homepage = await strapi.entityService.findMany('api::homepage.homepage', {
      populate: "deep",
    });


    const clients = await strapi.entityService.findMany('api::client.client', {
      populate: "deep",
    });


    const caseStudies = await strapi.entityService.findMany('api::case-studie.case-studie', {
      populate: "deep",
    });


    const blogs = await strapi.entityService.findMany('api::blog.blog', {
      populate: "deep",
    });

    return {
      homepage: homepage,
      clients,
      case_studies: caseStudies,
      blogs,
    };
  },
}));


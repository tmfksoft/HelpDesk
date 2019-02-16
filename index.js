require('dotenv').config();

// Libraries
const request = require('request');
const Hapi = require('hapi');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Inert = require('inert');
const Boom = require('boom');
const Showdown = require('showdown');
const ShowdownConvertor = new Showdown.Converter({
    strikethrough: true,
    tables: true,
    tasklists: true,
    emoji: true,
});

// Local Stuffs
let Database = require('./database/database');


let Server = new Hapi.Server({ port: 8080 });

async function startHapi() {
    console.log("Loading Database");
    Database = await Database();

    console.log("Starting HAPI");

    await Server.register(Vision);
    await Server.register(Inert);

    Server.views({
        engines: {
            html: Handlebars,
        },
        relativeTo: __dirname,
        path: 'templates/pages',
        partialsPath: 'templates/partials',
        helpersPath: 'templates/helpers',
        layoutPath: 'templates/layouts',
        isCached: false,
        layout: "main",
    });

    Server.route({
        method: 'GET',
        path: '/',
        handler: async (req, h) => {
            try {
                return h.view("home", {
                    categories: await Database.Models.Category.findAll({
                        include: [
                            { model: Database.Models.Section }
                        ]
                    })
                });
            } catch (e) {
                console.log("Failed loading homepage!", e);
                return h.view("special/404");
            }
        },
    });

    Server.route({
        method: 'GET',
        path: '/article/{article}',
        handler: async (req,h) => {
            let id = req.params.article.split("-")[0];
            const article = await Database.Models.Article.findOne({
                where: {
                    $or : [
                        { slug: req.params.article },
                        { id },
                    ]
                },
                include: [
                    { model: Database.Models.Section, include: [ Database.Models.Category ] }
                ]
            });
            
            if (article !== null) {
                article.markdown = ShowdownConvertor.makeHtml(article.body);
                return h.view("article", { article });
            } else {
                return h.view("special/404");
            }
        }
    });

    Server.route({
        method: 'GET',
        path: '/section/{section}',
        handler: async (req,h) => {
            try {
                const section = await Database.Models.Section.findOne({
                    where: { slug: req.params.section },
                    include: [
                        { model: Database.Models.Category },
                        { model: Database.Models.Article },
                    ]
                });
                if (section !== null) {
                    return h.view("section", { section });
                } else {
                    return h.view("special/404");
                }
            } catch (e) {
                console.log("Whoops!", e);
                return h.view("special/404");
            }
        }
    });

    Server.route({
        method: 'GET',
        path: '/category/{category}',
        handler: async (req,h) => {
            const category = await Database.Models.Category.findOne({
                where: { slug: req.params.category },
                include: [{
                    model: Database.Models.Section,
                    include: [
                        {
                            model: Database.Models.Article,
                            limit: 2
                        }
                    ]
                }]
            });
            if (category != null) {
                return h.view("category", { category });
            } else {
                return h.view("special/404");
            }
        }
    });

    Server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
    });

    Server.route({
        method: 'GET',
        path: '/{any*}',
        handler: (req, h) => {
            const accept = req.headers.accept;
            if (accept && accept.match(/json/)) {
                return Boom.notFound();
            }
            return h.view('special/404').code(404);
        }
    });

    await Server.start();
}
startHapi();
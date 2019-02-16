// Sets up the database. This deletes all data.
let Database = require('./database/database');

let categoryCount = 5;
let sectionsPerCategory = 5;
let articlesPerSection = 5;

const setupDatabase = async () => {
    console.log(`I'm about to generate ${categoryCount} Categories, ${(categoryCount*sectionsPerCategory)} Sections and ${(categoryCount*sectionsPerCategory*articlesPerSection)} Articles`);

    await wait(5);

    // Setup DB
    Database = await Database({
        forceSync: true
    });

    let categories = [];
    let sections = [];
    let articles = [];

    // Sample categories.
    for (let i=0; i<categoryCount; i++) {
        const exampleCategory = await Database.Models.Category.create({
            title: "Example Category "+(i+1),
            summary: "A sample category",
            slug: "example-category-"+(i+1),
        });
        await exampleCategory.update({
            slug: exampleCategory.id + "-" + exampleCategory.slug
        });
        categories.push(exampleCategory);
    }

    // Sample Sections
    let sectionNum = 1;
    for (let c of categories) {
        for (let i=0; i<sectionsPerCategory; i++) {
            const exampleSection = await Database.Models.Section.create({
                title: "Example Section "+sectionNum,
                summary: "A sample section",
                slug: "example-section-"+sectionNum,
                categoryId: c.id
            });
            await exampleSection.update({
                slug: exampleSection.id + "-" + exampleSection.slug
            });
            sections.push( exampleSection );

            sectionNum++;
        }
    }

    // Sample Articles
    let articleNum = 1;
    for (let s of sections) {
        for (let i=0; i<articlesPerSection; i++) {
            let article1 = await Database.Models.Article.create({
                title: "Sample Article "+articleNum,
                summary: "Your article could look like this..",
                body: " Here's an idea: why don't we take `SuperiorProject` and turn it into `**Reasonable**Project`. ",
                sectionId: s.id,
                slug: "sample-article-"+articleNum,
            });
            await article1.update({
                slug: article1.id + "-" + article1.slug,
            });
            articleNum++;
        }
    }

}
setupDatabase();

function wait(seconds) {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            resolve();
        }, 1000 * seconds);
    });
}
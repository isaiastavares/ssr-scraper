let organizationTemplate = `
{
    "@type": "Organization",
    "address": {
      "@type": "PostalAddress",
      "name": "SelectSoftware Reviews Address",
      "addressCountry": "http://www.wikidata.org/wiki/Q30",
      "addressLocality": "Cambridge",
      "addressRegion": "Massachusetts",
      "postalCode": "02139",
      "streetAddress": "196 Broadway, Suite 200"
    },
    "sameAs": [
      "https://twitter.com/bestb2bsoftware",
      "https://www.facebook.com/selectsoftwarereviews/",
      "https://www.linkedin.com/company/select-software-reviews",
      "https://www.youtube.com/channel/UC33dCPVWVucOoDuJ3HSNePg"
    ],
    "logo": "https://uploads-ssl.webflow.com/5dbc34a79684004f6e7a6c30/60a579c867fb7827b08da6ea_SelectSoftware%20Reviews%20Logo.png",
    "description": "SelectSoftware is dedicated to helping HR and recruiting teams find and buy the best software through in depth, expert research.",
    "name": "SelectSoftware Reviews",
    "telephone": "+13194812578",
    "url": "https://www.selectsoftwarereviews.com/",
    "knowsLanguage": "http://www.wikidata.org/wiki/Q1860",
    "areaServed": "http://www.wikidata.org/entity/Q13780930",
    "image": "https://uploads-ssl.webflow.com/5dbc34a79684004f6e7a6c30/624c120442f0bbf51c16f142_ssr-hat-optimized.jpg",
    "@id": "https://www.selectsoftwarereviews.com/"
}
`;

let articleTemplate = `
{
    "@type": "Article",
    "@context": "http://schema.org",
    "headline": "REPLACE",
    "url": "REPLACE",
    "dateModified": "REPLACE",
    "author": [
      {
        "@type": "Person",
        "name": "REPLACE",
        "description": "REPLACE",
        "url": "REPLACE",
        "image": "REPLACE"
      }
    ],
    "contributor": [],
    "description": "REPLACE",
    "publisher": {
      "@type": "Organization",
      "name": "SelectSoftware Reviews",
      "url": "https://www.selectsoftwarereviews.com/"
    }
}
`;

let breadcrumbTemplate = `
{
    "@type": "BreadcrumbList",
    "@context": "http://schema.org",
    "itemListElement": []
}
`;

let organization = JSON.parse(organizationTemplate)
let article = JSON.parse(articleTemplate)
let breadcrumb = JSON.parse(breadcrumbTemplate)

// article
let pageUrl = document.querySelector("[rel='canonical']").href
let pageTitle = document.querySelector('meta[property~="og:title"]')?.content
let pageDescription = document.querySelector('meta[property~="og:description"]')?.content;
let date = document.querySelector('.ss-review-author-date').innerText
let dateFormat = new Date(date).toISOString();

article['headline'] = pageTitle
article['url'] = pageUrl
article['dateModified'] = dateFormat
article['description'] = pageDescription

//author
document.querySelectorAll('.ss-buyer-author').forEach(authorDiv => {
    let authorName = authorDiv.querySelector('.ss-buyer-author-name')
    let authorDescription = authorDiv.querySelector('.ss-review-author-postion')
    let authorPhoto = authorDiv.querySelector('.ss-buyer-author-photo > img')

    let author = article.author[0]
    author['name'] = authorName.innerHTML
    author['description'] = authorDescription.innerHTML
    author['url'] = authorDiv.href
    author['image'] = authorPhoto.src
})

//contributor
let contributors = []
document.querySelectorAll('.ssr-experts-list-item').forEach(contributing => {
    let contributor = {}
    contributor['@type'] = 'Person'
    contributor['name'] = contributing.querySelector('.ssr-experts-list-item-name').innerHTML
    contributor['url'] = contributing.href
    contributor['image'] = contributing.querySelector('.ssr-buyer-author-photo > img').src
    contributors.push(contributor)
})

if (contributors.length) {
    article['contributor'] = contributors
} else {
    delete article.contributor
}

//breadcrumb
const breadcrumbItems = document.querySelectorAll('.ss-hero-breadcrumb a');
const lastBreadcrumb = document.querySelector('.ss-hero-breadcrumb span.ss-blog-breadcrumb-text');
const breadcrumbItemList = [];

breadcrumbItems.forEach((elem, index) => {
    const position = index + 1;
    const name = elem.textContent;
    const item = elem.href;
    
    breadcrumbItemList.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
    });
})

if (lastBreadcrumb) {
    const position = breadcrumbItems.length + 1;
    const name = lastBreadcrumb.textContent;
    const item = document.querySelector("[rel='canonical']").href
    
    breadcrumbItemList.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
    });
}
breadcrumb['itemListElement'] = breadcrumbItemList

//create schema
let schema = {};
schema['@context'] = "http://schema.org"
let graph = [organization, article, breadcrumb];

schema['@graph'] = graph

console.log(JSON.stringify(schema));

// create script
let script = document.createElement("script");
script.type = "application/ld+json";
script.innerHTML = JSON.stringify(schema);
document.head.appendChild(script);
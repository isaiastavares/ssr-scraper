let vendors = document.querySelectorAll('.feature-v2')
let numberOfItems = 0
let items = []
vendors.forEach(vendor => {
    let listItemTemplate = `
    {
        "@context": "http://schema.org",
        "@type": "ListItem",
        "item": {
            "@context": "http://schema.org",
            "@type": "WebApplication",
            "applicationCategory": "BusinessApplication"
        }
    }
    `;

    let listItem = JSON.parse(listItemTemplate)
    listItem['position'] = numberOfItems + 1
	listItem['name'] = vendor.querySelector('.service-heading-second').innerHTML
	listItem['image'] = vendor.querySelector('.image-features > img').src
    let id = vendor.querySelector("[id^='tag-applicant-tracking-system']").id
	listItem.item['url'] = location.href + '#' + id
	
    numberOfItems++;
	items.push(listItem)
})

if (items.length) {
    let schema = {};
    schema['@context'] = "http://schema.org"
    
    let itemsList = [];
    let itemList = {};
    
    itemList['@type'] = "ItemList"
    itemList['@context'] = "http://schema.org"
    itemList['description'] = document.querySelector('.ssr-h1').innerHTML
    itemList['url'] = location.href
    itemList['numberOfItems'] = numberOfItems
    itemList['itemListElement'] = items
    
    itemsList.push(itemList)
    
    schema['@graph'] = itemsList

    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const formElm = document.querySelector(".form-elm");
    const formHeight = formElm.offsetHeight;
    
    const nameInput = form.querySelector("input[name='name']");
    const tagSelect = form.querySelector("select[name='tag']");
    const outputTextarea = document.getElementById("json-data");
    outputTextarea.style.height = formHeight  + 'px';

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload

        const name = nameInput.value.trim();
        const tag = tagSelect.value;

        // Generate schema object
        const schema = {
            name: name,
            tag: tag,
            settings: [],
            blocks: [],
            presets: {
                name: name
            }
        };

        // Format as Shopify section schema
        const section = {
            // Only required if integrating into real .liquid file
            // "class": "shopify-section", 
            ...schema
        };

        // Output the formatted JSON to textarea
        const fullSchema = `<!-- live css update on custimzer -->
{% style %}

{% endstyle %}

<!-- section specific CSS -->
{% stylesheet %}

{% endstylesheet %}

<!-- section HTML structure -->
<div>
    <h1>${name}</h1>
</div>

<!-- section specific JS -->
{% javascript %}

{% endjavascript %}

{% schema %}\n${JSON.stringify(schema, null, 2)}\n{% endschema %}
`;
        outputTextarea.value = fullSchema;
    });
});


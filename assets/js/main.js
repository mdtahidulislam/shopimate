// document.addEventListener("DOMContentLoaded", function () {
//     // Setting type options
//     const settingTypes = [
//         'text',
//         'textarea',
//         'richtext',
//         'image_picker',
//         'range',
//         'select',
//         'checkbox',
//         'color',
//         'font_picker',
//         'collection',
//         'product',
//         'link_list',
//         'url',
//         'video_url'
//     ];

//     // Add setting button handler
//     const addSettingBtn = document.getElementById('add-setting');
//     const settingsContainer = document.getElementById('settings-container');

//     function createSettingFields() {
//         const settingDiv = document.createElement('div');
//         settingDiv.className = 'grid setting-group';
//         settingDiv.innerHTML = `
//             <label>
//                 Setting ID
//                 <input type="text" name="setting_id[]" placeholder="unique_id" required />
//             </label>
//             <label>
//                 Label
//                 <input type="text" name="setting_label[]" placeholder="Setting Label" required />
//             </label>
//             <label>
//                 Type
//                 <select name="setting_type[]" required>
//                     ${settingTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
//                 </select>
//             </label>
//             <label>
//                 Default Value
//                 <input type="text" name="setting_default[]" placeholder="Default value (optional)" />
//             </label>
//             <button type="button" class="remove-setting contrast outline" onclick="this.parentElement.remove()">Remove</button>
//         `;
//         settingsContainer.appendChild(settingDiv);
//     }

//     addSettingBtn.addEventListener('click', createSettingFields);
//     const form = document.querySelector("form");
//     const formElm = document.querySelector(".form-elm");
//     const formHeight = formElm.offsetHeight;
    
//     const nameInput = form.querySelector("input[name='name']");
//     const tagSelect = form.querySelector("select[name='tag']");
    
//     const outputTextarea = document.getElementById("json-data");
//     outputTextarea.style.height = formHeight  + 'px';

//     form.addEventListener("submit", function (e) {
//         e.preventDefault(); // Prevent page reload

//         // form data
//         const formData = new FormData(form);
        
//         // Get basic section data
//         const name = formData.get('name');
//         const tag = formData.get('tag');
//         const classes = formData.get('classes');
//         const restrict = formData.get('restrict');
//         const limit = Number(formData.get('limit'));
//         const max_blocks = Number(formData.get('max_blocks'));
        
//         // Process settings
//         const settingIds = formData.getAll('setting_id[]');
//         const settingLabels = formData.getAll('setting_label[]');
//         const settingTypes = formData.getAll('setting_type[]');
//         const settingDefaults = formData.getAll('setting_default[]');
        
//         const settings = settingIds.map((id, index) => {
//             const setting = {
//                 type: settingTypes[index],
//                 id: id,
//                 label: settingLabels[index]
//             };
            
//             if (settingDefaults[index]) {
//                 setting.default = settingDefaults[index];
//             }
            
//             return setting;
//         });
        
//         // Generate schema object
//         const schema = {
//             name,
//             tag,
//             ...(classes !== "" && { "class": classes }),
//             ...(limit !== 0 && { limit }),
//             settings,
//             ...(max_blocks !== 0 && {max_blocks}),
//             blocks: [],
//             presets: [{
//                 name: name,
//                 settings: {},
//                 blocks: []
//             }]
//         };

//         // Handle enable/disable restrictions
//         if (restrict === 'enabled_on') {
//             schema.enabled_on = {
//                 templates: ['*'],
//                 groups: []
//             };
//         } else if (restrict === 'disabled_on') {
//             schema.disabled_on = {
//                 templates: [],
//                 groups: []
//             };
//         }

//         // Output the formatted JSON to textarea
//         const fullSchema = `<!-- live css update on custimzer -->
// {% style %}

// {% endstyle %}

// <!-- section specific CSS -->
// {% stylesheet %}

// {% endstylesheet %}

// <!-- section HTML structure -->
// <div>
//     <h1>${name}</h1>
// </div>

// <!-- section specific JS -->
// {% javascript %}

// {% endjavascript %}

// {% schema %}\n${JSON.stringify(schema, null, 2)}\n{% endschema %}
// `;
//         outputTextarea.value = fullSchema;
//     });
// });


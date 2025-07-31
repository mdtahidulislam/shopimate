class SchemaBuilder {
    constructor() {
        this.settingTypes = [
            'text', 'textarea', 'richtext', 'image_picker', 'range',
            'select', 'checkbox', 'color', 'font_picker', 'collection',
            'product', 'link_list', 'url', 'video_url'
        ];
        
        this.form = document.querySelector('form');
        this.settingsContainer = document.getElementById('settings-container');
        this.jsonOutput = document.getElementById('json-data');
        this.addSettingBtn = document.getElementById('add-setting');
        
        this.initializeEventListeners();
        this.loadSavedData();
    }

    initializeEventListeners() {
        this.addSettingBtn.addEventListener('click', () => this.createSettingFields());
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Save form data on input changes
        this.form.addEventListener('input', () => this.saveFormData());
    }

    createSettingFields() {
        const settingDiv = document.createElement('div');
        settingDiv.className = 'setting-group';
        settingDiv.innerHTML = `
            <div class="grid">
                <div>
                    <label>
                        Setting ID
                        <input type="text" name="setting_id[]" placeholder="unique_id" required />
                    </label>
                    <label>
                        Label
                        <input type="text" name="setting_label[]" placeholder="Setting Label" required />
                    </label>
                </div>
                <div>
                    <label>
                        Type
                        <select name="setting_type[]" required>
                            ${this.settingTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                        </select>
                    </label>
                    <label>
                        Default Value
                        <input type="text" name="setting_default[]" placeholder="Default value (optional)" />
                    </label>
                </div>
            </div>
            <button type="button" class="remove-setting contrast outline">Remove</button>
        `;
        this.settingsContainer.appendChild(settingDiv);
        
        // Add event listener to the new remove button
        const removeBtn = settingDiv.querySelector('.remove-setting');
        removeBtn.addEventListener('click', this.removeSettingsGroup());
    }

    removeSettingsGroup() {
        return (event) => {
            const settingGroup = event.target.closest('.setting-group');
            if (settingGroup) {
                settingGroup.remove();
                this.saveFormData();
            }
        };
    }

    collectFormData() {
        const formData = new FormData(this.form);
        return {
            name: formData.get('name'),
            tag: formData.get('tag'),
            classes: formData.get('classes'),
            restrict: formData.get('restrict'),
            limit: Number(formData.get('limit')),
            max_blocks: Number(formData.get('max_blocks')),
            templates: formData.get('templates'),
            groups: formData.get('groups'),
            settingIds: formData.getAll('setting_id[]'),
            settingLabels: formData.getAll('setting_label[]'),
            settingTypes: formData.getAll('setting_type[]'),
            settingDefaults: formData.getAll('setting_default[]')
        };
    }

    generateSettings(data) {
        return data.settingIds.map((id, index) => {
            const setting = {
                type: data.settingTypes[index],
                id: id,
                label: data.settingLabels[index]
            };
            
            if (data.settingDefaults[index]) {
                setting.default = data.settingDefaults[index];
            }
            
            return setting;
        });
    }

    generateSchema(data) {
        const schema = {
            name: data.name,
            tag: data.tag,
            ...(data.classes !== "" && { "class": data.classes }),
            ...(data.limit !== 0 && { limit: data.limit }),
            settings: this.generateSettings(data),
            ...(data.max_blocks !== 0 && { max_blocks: data.max_blocks }),
            blocks: [],
            presets: [{
                name: data.name,
                settings: {},
                blocks: []
            }]
        };

        if (data.restrict === 'enabled_on') {
            if (data.templates || data.groups) {
                schema.enabled_on = {};
                if (data.templates) {
                    schema.enabled_on.templates = data.templates.split(',').map(t => t.trim()).filter(t => t);
                }
                if (data.groups) {
                    schema.enabled_on.groups = data.groups.split(',').map(g => g.trim()).filter(g => g);
                }
            }
        } else if (data.restrict === 'disabled_on') {
            if (data.templates || data.groups) {
                schema.disabled_on = {};
                if (data.templates) {
                    schema.disabled_on.templates = data.templates.split(',').map(t => t.trim()).filter(t => t);
                }
                if (data.groups) {
                    schema.disabled_on.groups = data.groups.split(',').map(g => g.trim()).filter(g => g);
                }
            }
            
        }

        return schema;
    }

    loadSavedData() {
        const savedData = localStorage.getItem('schemaFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Restore basic fields
            this.form.querySelector('[name="name"]').value = data.name || '';
            this.form.querySelector('[name="tag"]').value = data.tag || '';
            this.form.querySelector('[name="classes"]').value = data.classes || '';
            this.form.querySelector('[name="limit"]').value = data.limit || '';
            this.form.querySelector('[name="max_blocks"]').value = data.max_blocks || '';
            
            // Restore restriction fields
            if (data.restrict) {
                const restrictRadio = this.form.querySelector(`[name="restrict"][value="${data.restrict}"]`);
                if (restrictRadio) restrictRadio.checked = true;
            }
            this.form.querySelector('[name="templates"]').value = data.templates || '';
            this.form.querySelector('[name="groups"]').value = data.groups || '';
            
            // Restore settings
            if (data.settings && data.settings.length > 0) {
                data.settings.forEach(setting => {
                    this.createSettingFields();
                    const lastGroup = this.settingsContainer.lastElementChild;
                    lastGroup.querySelector('[name="setting_id[]"]').value = setting.id;
                    lastGroup.querySelector('[name="setting_label[]"]').value = setting.label;
                    lastGroup.querySelector('[name="setting_type[]"]').value = setting.type;
                    lastGroup.querySelector('[name="setting_default[]"]').value = setting.default || '';
                });
            }
        }
    }

    saveFormData() {
        const data = this.collectFormData();
        // Only include settings that are currently in the form
        const currentSettingGroups = this.settingsContainer.querySelectorAll('.setting-group');
        const settings = Array.from(currentSettingGroups).map(group => ({
            id: group.querySelector('[name="setting_id[]"]').value,
            label: group.querySelector('[name="setting_label[]"]').value,
            type: group.querySelector('[name="setting_type[]"]').value,
            default: group.querySelector('[name="setting_default[]"]').value || ''
        }));
        
        const formData = {
            ...data,
            settings
        };
        localStorage.setItem('schemaFormData', JSON.stringify(formData));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const data = this.collectFormData();
        const schema = this.generateSchema(data);
        
        const fullSchema = `<!-- live css update on custimzer -->
{% style %}

{% endstyle %}

<!-- section specific CSS -->
{% stylesheet %}

{% endstylesheet %}

<!-- section HTML structure -->
<div>
    <h1>${data.name}</h1>
</div>

<!-- section specific JS -->
{% javascript %}

{% endjavascript %}

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}
`;

        this.jsonOutput.value = fullSchema;
    }
}

// Initialize the builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SchemaBuilder();
});
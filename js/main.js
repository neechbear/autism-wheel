document.addEventListener('DOMContentLoaded', () => {
    const templateSelector = document.getElementById('template-selector');
    const templateName = document.getElementById('template-name');
    const templateDescription = document.getElementById('template-description');
    const templateSource = document.getElementById('template-source');
    const templateMetrics = document.getElementById('template-metrics');
    const templateInfo = document.getElementById('template-info');

    templateInfo.style.display = 'none';

    fetch('data/templates.yaml')
        .then(response => response.text())
        .then(yamlText => {
            const data = jsyaml.load(yamlText);
            const templates = data.wheel_templates;

            templates.forEach((template, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = template.name;
                templateSelector.appendChild(option);
            });

            templateSelector.addEventListener('change', (event) => {
                const selectedIndex = event.target.value;
                if (selectedIndex) {
                    const selectedTemplate = templates[selectedIndex];
                    templateInfo.style.display = 'block';
                    templateName.textContent = selectedTemplate.name;
                    templateDescription.textContent = selectedTemplate.description;
                    templateSource.href = selectedTemplate.source_url;
                    templateSource.textContent = `Source: ${selectedTemplate.source_url}`;

                    templateMetrics.innerHTML = '';
                    selectedTemplate.metrics.forEach(metric => {
                        const li = document.createElement('li');
                        li.textContent = metric;
                        templateMetrics.appendChild(li);
                    });
                } else {
                    templateInfo.style.display = 'none';
                }
            });
        });
});

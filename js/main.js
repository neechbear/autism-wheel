document.addEventListener('DOMContentLoaded', () => {
    const templateSelector = document.getElementById('template-selector');
    const templateInfo = document.getElementById('template-info');
    const templateName = document.getElementById('template-name');
    const templateDescription = document.getElementById('template-description');
    const templateSource = document.getElementById('template-source');
    const chartContainer = document.getElementById('chart-container');

    // Hide containers initially
    templateInfo.style.display = 'none';
    chartContainer.style.display = 'none';

    fetch('data/templates.yaml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(yamlText => {
            const data = jsyaml.load(yamlText);
            const templates = data.wheel_templates;

            // Populate the selector
            templates.forEach((template, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = template.name;
                templateSelector.appendChild(option);
            });

            // Handle selection changes
            templateSelector.addEventListener('change', (event) => {
                const selectedIndex = event.target.value;

                if (selectedIndex !== "") {
                    const selectedTemplate = templates[selectedIndex];

                    // Show and populate template info
                    templateInfo.style.display = 'block';
                    templateName.textContent = selectedTemplate.name;
                    templateDescription.textContent = selectedTemplate.description;
                    if (selectedTemplate.source_url) {
                        templateSource.href = selectedTemplate.source_url;
                        templateSource.textContent = `Source: ${selectedTemplate.source_url}`;
                        templateSource.style.display = 'block';
                    } else {
                        templateSource.style.display = 'none';
                    }

                    // Show and initialize the chart
                    chartContainer.style.display = 'block';
                    AutismWheelChart.init(selectedTemplate.metrics);

                } else {
                    // Hide everything if the default option is selected
                    templateInfo.style.display = 'none';
                    chartContainer.style.display = 'none';
                }
            });
        })
        .catch(error => {
            console.error('Error loading or parsing templates:', error);
            // Optionally, display an error message to the user
            const errorMsg = document.createElement('p');
            errorMsg.textContent = 'Could not load templates. Please try again later.';
            errorMsg.style.color = 'red';
            templateSelector.parentElement.appendChild(errorMsg);
        });
});

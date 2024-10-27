// public/js/main.js
document.addEventListener("DOMContentLoaded", function() {
    const loadContent = (section) => {
        switch(section) {
            case 'inbox':
                import('./inbox.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load inbox module: ${error}`));
                break;
            case 'sent':
                import('./sent.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load sent module: ${error}`));
                break;
            case 'drafts':
                import('./drafts.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load drafts module: ${error}`));
                break;
            case 'spam':
                import('./spam.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load spam module: ${error}`));
                break;
            case 'trash':
                import('./trash.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load trash module: ${error}`));
                break;
            case 'compose':
                import('./compose.js')
                    .then(module => module.default())
                    .catch(error => console.error(`Failed to load compose module: ${error}`));
                break;
            default:
                console.error('Unknown section:', section);
        }
    };

    const sectionLinks = {
        "inbox-link": 'inbox',
        "sent-link": 'sent',
        "drafts-link": 'drafts',
        "spam-link": 'spam',
        "trash-link": 'trash',
        "compose-button": 'compose'
    };

    for (const [id, section] of Object.entries(sectionLinks)) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => loadContent(section));
        } else {
            console.warn(`Element with ID ${id} not found.`);
        }
    }

    // Load default section
    loadContent('inbox');
});

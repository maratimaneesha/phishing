// public/js/emailRenderer.js

/**
 * Escapes HTML characters to prevent XSS attacks.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Renders a list of emails into the specified container.
 * @param {Array} emails - An array of email objects.
 * @param {HTMLElement} container - The container element to render emails into.
 */
export function renderEmails(emails, container) {
    container.innerHTML = '';

    emails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.classList.add('email-item', 'd-flex', 'justify-content-between', 'align-items-center', 'p-3', 'border-bottom');

        emailItem.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="">
            </div>
            <div class="email-sender">${escapeHTML(email.sender)}</div>
            <div class="email-subject">${escapeHTML(email.subject)}</div>
            <div class="email-content">${escapeHTML(email.content)}</div>
            <div class="email-date">${escapeHTML(email.date)}</div>
        `;

        container.appendChild(emailItem);
    });
}

// public/js/trash.js
import { renderEmails } from './emailRenderer.js';

export default function() {
    document.addEventListener("DOMContentLoaded", function() {
        const trashLink = document.getElementById("trash-link");
        const sectionTitle = document.getElementById("section-title");
        const emailList = document.getElementById("email-list");

        if (trashLink) {
            trashLink.addEventListener('click', function() {
                sectionTitle.textContent = 'Trash';
                const emails = [
                    { sender: 'Old Email', subject: 'Old email subject', content: 'This is an old email.', date: 'June 23, 2024' },
                    // Add more email objects here for Trash
                ];

                renderEmails(emails, emailList);
            });
        } else {
            console.warn('Trash link not found.');
        }
    });
}

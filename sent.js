// public/js/sent.js
import { renderEmails } from './emailRenderer.js';

export default function() {
    document.addEventListener("DOMContentLoaded", function() {
        const sentLink = document.getElementById("sent-link");
        const sectionTitle = document.getElementById("section-title");
        const emailList = document.getElementById("email-list");

        if (sentLink) {
            sentLink.addEventListener('click', function() {
                sectionTitle.textContent = 'Sent';
                const emails = [
                    { sender: 'Me', subject: 'Project Update', content: 'Here is the latest update on the project.', date: 'June 26, 2024' },
                    // Add more email objects here for Sent
                ];

                renderEmails(emails, emailList);
            });
        } else {
            console.warn('Sent link not found.');
        }
    });
}

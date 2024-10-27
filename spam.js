// public/js/spam.js
import { renderEmails } from './emailRenderer.js';

export default function() {
    document.addEventListener("DOMContentLoaded", function() {
        const spamLink = document.getElementById("spam-link");
        const sectionTitle = document.getElementById("section-title");
        const emailList = document.getElementById("email-list");

        if (spamLink) {
            spamLink.addEventListener('click', function() {
                sectionTitle.textContent = 'Spam';
                const emails = [
                    { sender: 'Spammer', subject: 'You won a prize!', content: 'Click here to claim your prize.', date: 'June 24, 2024' },
                    // Add more email objects here for Spam
                ];

                renderEmails(emails, emailList);
            });
        } else {
            console.warn('Spam link not found.');
        }
    });
}

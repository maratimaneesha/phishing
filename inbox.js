// public/js/inbox.js
import { renderEmails } from './emailRenderer.js';

async function updateNavLinks() {
    try {
        const response = await fetch('/api/user'); // Assume this endpoint returns user info
        const user = await response.json();
        const userEmail = user.email;

        if (!userEmail) {
            throw new Error("User email not found");
        }

        document.getElementById('inbox-link').href = `/inbox/${userEmail}`;
        document.getElementById('sent-link').href = `/sent/${userEmail}`;
        document.getElementById('spam-link').href = `/spam/${userEmail}`;
        document.getElementById('trash-link').href = `/trash/${userEmail}`;
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateNavLinks);

document.addEventListener("DOMContentLoaded", function () {
    const inboxLink = document.getElementById("inbox-link");
    const sectionTitle = document.getElementById("section-title");
    const emailList = document.getElementById("email-list");

    if (!inboxLink || !sectionTitle || !emailList) {
        console.error("Required elements are missing from the DOM.");
        return;
    }

    inboxLink.addEventListener('click', async function () {
        try {
            const response = await fetch('/api/user');  // Assume this endpoint returns user info
            const user = await response.json();
            const userEmail = user.email;

            if (!userEmail) {
                throw new Error("User email not found");
            }

            window.location.href = `/inbox/${userEmail}`;
        } catch (error) {
            console.error("Error fetching user info:", error);
            sectionTitle.textContent = 'Error';
            emailList.innerHTML = '<p>Failed to load user info. Please try again later.</p>';
        }
    });
});

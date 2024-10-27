// js/email.js
// Example of sending email from the frontend
// Example of sending email from the frontend with attachments
function sendEmail() {
    const senderInput = document.getElementById('from-input');
    const recipientInput = document.getElementById('to-input');
    const subjectInput = document.getElementById('subject-input');
    const bodyInput = document.getElementById('body-input');
    const fileInput = document.getElementById('file-input');
    // console.log(senderInput);
    // console.log(recipientInput);
    // console.log(subjectInput);
    // console.log(bodyInput);
    if (!senderInput || !recipientInput || !subjectInput || !bodyInput) {
        console.error('One or more input fields are missing');
        return;
    }

    const sender = senderInput.value;
    const recipient = recipientInput.value;
    const subject = subjectInput.value;
    const body = bodyInput.value;
    const files = fileInput.files; // Assuming input type is 'file'

    const formData = new FormData();
    formData.append('from', sender);
    formData.append('to', recipient);
    formData.append('subject', subject);
    formData.append('body', body);

    // Append each file to the form data
    for (const file of files) {
        formData.append('files', file);
    }

    fetch('/send-email', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
    })
        .then(async response => {
            const text = await response.text();
            console.log(text); // Log the response text for debugging
            return JSON.parse(text); // Attempt to parse as JSON
        })
        .then(data => {
            console.log(data);
            alert('Email sent successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send email');
        });

}

// Function to search emails
function searchEmails() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const emailItems = document.querySelectorAll('.email-item');

    emailItems.forEach(item => {
        const emailSubject = item.querySelector('.email-subject').innerText.toLowerCase();
        const emailContent = item.querySelector('.email-content').innerText.toLowerCase();

        item.style.display = (emailSubject.includes(searchText) || emailContent.includes(searchText)) ? 'block' : 'none';
    });
}

// Sample data for demonstration
// const emails = [
//     { sender: "John Smith", subject: "Meeting Agenda", content: "Please find the agenda for our upcoming meeting attached.", date: "June 27, 2024", unread: true, starred: false },
//     { sender: "Alice Johnson", subject: "Proposal Submission", content: "Attached is the proposal document for your review.", date: "June 26, 2024", unread: false, starred: true }
//     // Add more sample emails as needed
// ];

// Function to filter emails by unread status
function filterByUnread() {
    const filteredEmails = emails.filter(email => email.unread);
    renderEmails(filteredEmails);
}

// Function to filter emails by starred status
function filterByStarred() {
    const filteredEmails = emails.filter(email => email.starred);
    renderEmails(filteredEmails);
}

// Function to sort emails by date
function sortByDate() {
    const sortedEmails = [...emails].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderEmails(sortedEmails);
}

// Function to sort emails by sender
function sortBySender() {
    const sortedEmails = [...emails].sort((a, b) => a.sender.localeCompare(b.sender));
    renderEmails(sortedEmails);
}

// Function to render emails on the page
function renderEmails(emailsToShow) {
    const emailList = document.querySelector('.email-list');
    emailList.innerHTML = '';
    emailsToShow.forEach(email => {
        const emailItem = `
      <div class="email-item d-flex justify-content-between align-items-center p-3 border-bottom">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="">
        </div>
        <div class="email-sender">${email.sender}</div>
        <div class="email-subject">${email.subject}</div>
        <div class="email-content">${email.content}</div>
        <div class="email-date">${email.date}</div>
      </div>
    `;
        emailList.innerHTML += emailItem;
    });
}

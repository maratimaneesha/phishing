document.addEventListener('DOMContentLoaded', function () {
    const composeForm = document.getElementById('send-email-form');

    if (composeForm) {
        console.log('composeForm found');
        composeForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(composeForm); // Create FormData object from the form

            try {
                const response = await fetch('/api/send-email', {  // Ensure URL matches server route
                    method: 'POST',
                    body: formData,
                });                

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const result = await response.json();
                alert(result.message);

                // Hide the modal and reset form
                const modalElement = document.getElementById('composeModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                composeForm.reset();

                // Refresh the inbox or update the email list
                refreshInbox(); // Implement this function to refresh your email list
            } catch (error) {
                console.error('Error sending email:', error);
                alert('Failed to send email. Please try again.');
            }
        });
    }
    else
    {
        console.error('composeForm not found');
    }
});

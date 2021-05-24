function submitForm(form) {
  const data = new FormData(form);

  const request = new XMLHttpRequest();
  request.open(form.method, form.action);

  // Construct a promise that will fire when the appropriate event listener is called.
  const response = new Promise((resolve, reject) => {
    request.addEventListener('load', event => {
      resolve(event.target);
    });
    request.addEventListener('error', event => {
      reject('Something went wrong. Please try again later.');
    })
  });

  request.send(data);

  // Return promise for chaining.
  return response;
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact form');
  const formSection = document.getElementById('contact');
  const submitButton = document.querySelector('[type=submit]');

  formSection.addEventListener('transitionend', (event) => {
    // Remove notification and restore submit button.
    event.target.parentElement.removeChild(event.target);
    submitButton.disabled = false;
  });

  // Attach invalid event handlers to inputs.
  for (let input of contactForm.elements) {
    input.addEventListener('invalid', event => {
      event.preventDefault();
      let label = event.target.labels[0];

      let error = document.createElement('span');
      error.className = 'invalid';

      // Only two types of possible errors; missing value or invalid email.
      if (event.target.validity.valueMissing) {
        error.textContent = 'This field is required.';
      } else {
        error.textContent = 'Please enter a valid email.';
      }
      
      // Add immediately after the label.
      label.parentElement.insertBefore(error, label.nextSibling);
    });
  }

  function appendUserNotification(status, message) {    
    // Appends a user notification and sets up a timeout to clear it.
    let notification = document.createElement('p');
    notification.className = status;
    notification.textContent = message
        
    formSection.appendChild(notification);
    
    setTimeout(() => {
      // Fades out the element and fires a transitionend event.
      notification.style.opacity = 0;
    }, 5000);
  }

  function isValid(form) {
    const errorMessages = document.querySelectorAll('.invalid');
    for (let error of errorMessages) {
      form.removeChild(error);
    }
    if (!form.reportValidity()) {
      return false;
    }
    return true;
  }

  submitButton.addEventListener('click', event => {
    let status;
    let message;

    event.preventDefault();

    if (!isValid(contactForm)) {
      return;
    }

    submitForm(contactForm).then(respData => {
      if (respData.status === 200) {
        // Successful requests.
        status = 'success';
        message = 'Thank you for contacting Victoria Plant Shop, ' +
                  'we\'ll be in touch within 24 hrs.';
        contactForm.reset();  // Clear form on success.
      } else {
        // Server or Client Failures.
        status = 'failure';
        message = 'There was a problem submitting the form.';
      }
    }).catch((errorMessage) => {
      // Other Failures, i.e. network failures.
      status = 'failure';
      message = errorMessage
    }).finally(() => {
      appendUserNotification(status, message);
      submitButton.disabled = true;  // Temporarily disabled to avoid repeat submits.
    });
  });
});

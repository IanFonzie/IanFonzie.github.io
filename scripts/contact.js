function submitForm(form) {
  const data = new FormData(form);

  const request = new XMLHttpRequest();
  request.open(form.method, form.action);

  const response = new Promise((resolve, reject) => {
    request.addEventListener('load', event => {
      resolve(event.target);
    });
    request.addEventListener('error', event => {
      reject('Something went wrong. Please try again later.');
    })
  });

  request.send(data);

  return response;
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact form');
  const formSection = document.getElementById('contact');
  const submitButton = document.querySelector('[type=submit]');

  formSection.addEventListener('transitionend', (event) => {
    event.target.parentElement.removeChild(event.target);
  })

  function appendUserNotification(status, message) {    
    let notification = document.createElement('p');
    notification.className = status;
    notification.textContent = message
    
    const formSection = document.getElementById('contact');
    
    formSection.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = 0;
      submitButton.disabled = false;
    }, 5000)
  }
  
  contactForm.addEventListener('submit', event => {
    let status;
    let message;

    event.preventDefault();
    submitForm(contactForm).then(respData => {
      if (respData.status === 200) {
        status = 'success';
        message = 'Thank you for contacting Victoria Plant Shop, ' +
                  'we\'ll be in touch within 24 hrs.';
        contactForm.reset();
      } else {
        status = 'failure';
        message = 'There was a problem submitting the form.';
      }
    }).catch((errorMessage) => {
      status = 'failure';
      message = errorMessage
    }).finally(() => {
      if (status === 'success') {
        contactForm.reset();
      }
      appendUserNotification(status, message);
      submitButton.disabled = true;
    });
  });
});

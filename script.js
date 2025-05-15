// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation and Submission
const spaBookingForm = document.getElementById('spa-booking-form');
const contactForm = document.getElementById('contact-form');

if (spaBookingForm) {
    spaBookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('location').value
        };

        // Format message for Telegram
        const message = `
🔔 New Booking Request:
👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
💆 Service: ${formData.service}
📅 Date: ${formData.date}
⏰ Time: ${formData.time}
🏨 Location: ${formData.location}
        `;

        // Send to Telegram
        const telegramBotToken = '7009582933:AAHBTYa4rg_6EWGm09DNUEo3Oo0k4jsRUKU';
        const chatId = '7490761656';
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        // Create form data for the request
        const telegramData = new URLSearchParams();
        telegramData.append('chat_id', chatId);
        telegramData.append('text', message);

        // Send the request
        fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: telegramData
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Show success message
                alert('Booking request sent successfully! We will contact you shortly.');
                // Reset form
                document.getElementById('spa-booking-form').reset();
            } else {
                throw new Error('Failed to send booking request');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sorry, there was an error sending your booking request. Please try again.');
        });
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Here you would typically send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add animation class to service cards on scroll
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Date and Time Input Validation
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');

if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

if (timeInput) {
    // Set time range (e.g., 9 AM to 9 PM)
    timeInput.min = '09:00';
    timeInput.max = '21:00';
}

// Add smooth scroll behavior for the entire page
document.documentElement.style.scrollBehavior = 'smooth';

// Chat Functionality
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatBookingForm = document.getElementById('chatBookingForm');
const chatBookingFormElement = document.getElementById('chatBookingFormElement');

// Quick options responses
const quickResponses = {
    book: {
        message: "I'll help you book a session. Please fill out the booking form below.",
        showForm: true
    },
    services: {
        message: "Our premium services include:\n- Swedish Massage\n- Deep Tissue Massage\n- Hot Stone Therapy\n- Aromatherapy\n\nWould you like to book any of these services?",
        showForm: false
    },
    pricing: {
        message: "Our pricing varies based on the service and duration. Here's a quick overview:\n\n- Swedish Massage: Starting from ₹3,000\n- Deep Tissue Massage: Starting from ₹3,500\n- Hot Stone Therapy: Starting from ₹4,000\n- Aromatherapy: Starting from ₹3,500\n\nWould you like to book a session?",
        showForm: false
    }
};

// Handle quick option clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-option')) {
        const option = e.target.dataset.option;
        const response = quickResponses[option];
        
        if (response) {
            addMessage(response.message, 'system');
            if (response.showForm) {
                chatBookingForm.style.display = 'block';
            }
        }
    }
});

// Handle chat booking form submission
if (chatBookingFormElement) {
    chatBookingFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Validate form data
        if (!bookingData.name || !bookingData.phone || !bookingData.service || !bookingData.date || !bookingData.time) {
            addMessage("Please fill in all required fields.", 'system');
            return;
        }
        
        // Add user's booking request to chat
        addMessage(`Booking request for ${bookingData.service} on ${bookingData.date} at ${bookingData.time}`, 'user');
        
        // Simulate booking confirmation
        setTimeout(() => {
            addMessage("Thank you for your booking request! Our team will contact you shortly to confirm your appointment.", 'system');
            this.reset();
            chatBookingForm.style.display = 'none';
        }, 1000);
    });
}

// Handle chat form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        messageInput.value = '';
        
        // Simulate system response
        setTimeout(() => {
            const responses = [
                "Thank you for your message! Our team will get back to you shortly.",
                "Would you like to know more about our services?",
                "I can help you with booking information.",
                "Please provide your hotel details for better assistance."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'system');
        }, 1000);
    }
});

// Function to add messages to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Handle multiline messages
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<p>${formattedText}</p>`;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Toggle chat window
chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatToggle.style.display = 'none';
});

// Close chat window
closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatToggle.style.display = 'flex';
});

// Close chat window when clicking outside
document.addEventListener('click', (e) => {
    if (!chatWindow.contains(e.target) && !chatToggle.contains(e.target)) {
        chatWindow.classList.remove('active');
        chatToggle.style.display = 'flex';
    }
});

// Prevent chat window from closing when clicking inside it
chatWindow.addEventListener('click', (e) => {
    e.stopPropagation();
}); 
// Contact Page Form Handler

// Step Navigation
function nextStep(step) {
    // Validate current step before proceeding
    const currentStep = document.querySelector('.form-step.active');
    const currentStepNum = parseInt(currentStep.dataset.step);
    
    if (!validateStep(currentStepNum)) {
        return;
    }
    
    // Hide current step
    currentStep.classList.remove('active');
    
    // Show next step
    const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    nextStepEl.classList.add('active');
    
    // Update progress bar
    updateProgress(step);
    
    // Scroll to top of form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    const currentStep = document.querySelector('.form-step.active');
    currentStep.classList.remove('active');
    
    // Show previous step
    const prevStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    prevStepEl.classList.add('active');
    
    // Update progress bar
    updateProgress(step);
    
    // Scroll to top of form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        
        if (stepNum === step) {
            el.classList.add('active');
        } else if (stepNum < step) {
            el.classList.add('completed');
        }
    });
}

// Validation
function validateStep(stepNum) {
    const step = document.querySelector(`.form-step[data-step="${stepNum}"]`);
    const requiredFields = step.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff4444';
            
            // Add shake animation
            field.style.animation = 'shake 0.5s';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        } else {
            field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    return isValid;
}

// Hazardous Cargo Toggle
const hazardousToggle = document.querySelector('input[name="Hazardous Cargo"]');
const hazardousDetails = document.getElementById('hazardousDetails');
const hazardousTextarea = document.getElementById('hazardousInfo');

if (hazardousToggle) {
    hazardousToggle.addEventListener('change', function() {
        if (this.checked) {
            hazardousDetails.style.display = 'block';
            hazardousTextarea.setAttribute('required', 'required');
        } else {
            hazardousDetails.style.display = 'none';
            hazardousTextarea.removeAttribute('required');
            hazardousTextarea.value = '';
        }
    });
}

// Date Validation - Ensure collection date is not in the past
const collectionDateInput = document.getElementById('collectionDate');
const deliveryDateInput = document.getElementById('deliveryDate');

if (collectionDateInput) {
    const today = new Date().toISOString().split('T')[0];
    collectionDateInput.setAttribute('min', today);
    
    collectionDateInput.addEventListener('change', function() {
        if (deliveryDateInput) {
            deliveryDateInput.setAttribute('min', this.value);
        }
    });
}

// Form Submission
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        // Final validation
        if (!validateStep(3)) {
            e.preventDefault();
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Form will submit naturally to Web3Forms
        // The redirect is handled by the hidden input in HTML
    });
}

// Shake animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Navigation active state
const currentPage = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    if (link.getAttribute('href').includes('contact')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});
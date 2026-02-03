document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('registrationForm');
    const successModal = document.getElementById('successModal');
    const previewModal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const previewModalClose = document.getElementById('previewModalClose');
    const submitBtn = document.getElementById('submitBtn');
    const btnLoading = document.getElementById('btnLoading');
    const previewBtn = document.getElementById('previewBtn');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const submitFromPreviewBtn = document.getElementById('submitFromPreviewBtn');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    const newRegistrationBtn = document.getElementById('newRegistrationBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    
    // Form validation functions
    const validators = {
        fullName: function() {
            const name = document.getElementById('fullName').value.trim();
            const errorElement = document.getElementById('nameError');
            
            if (name === '') {
                errorElement.textContent = 'Full name is required';
                return false;
            } else if (name.length < 2) {
                errorElement.textContent = 'Name must be at least 2 characters long';
                return false;
            } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
                errorElement.textContent = 'Name contains invalid characters';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        email: function() {
            const email = document.getElementById('email').value.trim();
            const errorElement = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email === '') {
                errorElement.textContent = 'Email address is required';
                return false;
            } else if (!emailRegex.test(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        phone: function() {
            const phone = document.getElementById('phone').value.trim();
            const errorElement = document.getElementById('phoneError');
            const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,}$/;
            
            if (phone === '') {
                errorElement.textContent = 'Phone number is required';
                return false;
            } else if (!phoneRegex.test(phone)) {
                errorElement.textContent = 'Please enter a valid phone number';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        dob: function() {
            const dob = document.getElementById('dob').value;
            const errorElement = document.getElementById('dobError');
            
            if (dob === '') {
                errorElement.textContent = 'Date of birth is required';
                return false;
            } else {
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                
                if (age < 13) {
                    errorElement.textContent = 'You must be at least 13 years old';
                    return false;
                } else if (age > 100) {
                    errorElement.textContent = 'Please enter a valid date of birth';
                    return false;
                } else {
                    errorElement.textContent = '';
                    return true;
                }
            }
        },
        
        course: function() {
            const course = document.getElementById('course').value;
            const errorElement = document.getElementById('courseError');
            
            if (course === '') {
                errorElement.textContent = 'Please select your course';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        year: function() {
            const year = document.getElementById('year').value;
            const errorElement = document.getElementById('yearError');
            
            if (year === '') {
                errorElement.textContent = 'Please select your year of study';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        password: function() {
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('passwordError');
            
            if (password === '') {
                errorElement.textContent = 'Password is required';
                return false;
            } else if (password.length < 8) {
                errorElement.textContent = 'Password must be at least 8 characters long';
                return false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                errorElement.textContent = 'Password must contain uppercase, lowercase letters and a number';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        confirmPassword: function() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorElement = document.getElementById('confirmPasswordError');
            
            if (confirmPassword === '') {
                errorElement.textContent = 'Please confirm your password';
                return false;
            } else if (password !== confirmPassword) {
                errorElement.textContent = 'Passwords do not match';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        gender: function() {
            const genderInputs = document.querySelectorAll('input[name="gender"]:checked');
            const errorElement = document.getElementById('genderError');
            
            if (genderInputs.length === 0) {
                errorElement.textContent = 'Please select your gender';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        },
        
        terms: function() {
            const terms = document.getElementById('terms').checked;
            const errorElement = document.getElementById('termsError');
            
            if (!terms) {
                errorElement.textContent = 'You must agree to the terms and conditions';
                return false;
            } else {
                errorElement.textContent = '';
                return true;
            }
        }
    };
    
    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60', '#16a085'];
        
        const level = Math.min(strength, 5);
        const width = (level + 1) * 20;
        
        strengthBar.style.width = width + '%';
        strengthBar.style.backgroundColor = colors[level];
        strengthText.textContent = strengthLevels[level];
        strengthText.style.color = colors[level];
    }
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Real-time validation
    document.getElementById('fullName').addEventListener('blur', validators.fullName);
    document.getElementById('email').addEventListener('blur', validators.email);
    document.getElementById('phone').addEventListener('blur', validators.phone);
    document.getElementById('dob').addEventListener('change', validators.dob);
    document.getElementById('course').addEventListener('change', validators.course);
    document.getElementById('year').addEventListener('change', validators.year);
    
    document.getElementById('password').addEventListener('input', function() {
        validators.password();
        checkPasswordStrength(this.value);
    });
    
    document.getElementById('confirmPassword').addEventListener('blur', validators.confirmPassword);
    
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        input.addEventListener('change', validators.gender);
    });
    
    document.getElementById('terms').addEventListener('change', validators.terms);
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitForm();
    });
    
    function submitForm() {
        // Validate all fields
        const isValid = Object.keys(validators).every(key => validators[key]());
        
        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnLoading.style.display = 'inline-block';
        
        // Simulate API call
        setTimeout(() => {
            // Generate a random student ID
            const studentId = 'STU-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
            
            // Update modal with data
            document.getElementById('modalStudentId').textContent = studentId;
            document.getElementById('modalEmail').textContent = document.getElementById('email').value;
            
            const now = new Date();
            document.getElementById('modalRegDate').textContent = 
                now.toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            
            // Show success modal
            successModal.style.display = 'flex';
            
            // Reset button state
            submitBtn.disabled = false;
            btnLoading.style.display = 'none';
        }, 1500);
    }
    
    // Preview functionality
    previewBtn.addEventListener('click', function() {
        generatePreview();
        previewModal.style.display = 'flex';
    });
    
    function generatePreview() {
        const previewContent = document.getElementById('previewContent');
        
        // Get form values
        const formData = {
            'Full Name': document.getElementById('fullName').value || 'Not provided',
            'Email Address': document.getElementById('email').value || 'Not provided',
            'Phone Number': document.getElementById('phone').value || 'Not provided',
            'Date of Birth': document.getElementById('dob').value || 'Not provided',
            'Course': document.getElementById('course').options[document.getElementById('course').selectedIndex].text || 'Not provided',
            'Year of Study': document.getElementById('year').options[document.getElementById('year').selectedIndex].text || 'Not provided',
            'Gender': document.querySelector('input[name="gender"]:checked') ? 
                document.querySelector('input[name="gender"]:checked').parentElement.querySelector('.radio-text').textContent : 'Not provided',
            'Address': document.getElementById('address').value || 'Not provided'
        };
        
        // Generate preview HTML
        let previewHTML = '';
        
        Object.keys(formData).forEach(key => {
            previewHTML += `
                <div class="preview-row">
                    <div class="preview-label">${key}:</div>
                    <div class="preview-value">${formData[key]}</div>
                </div>
            `;
        });
        
        previewContent.innerHTML = `
            <div class="preview-section">
                <h3><i class="fas fa-user-circle"></i> Personal Information</h3>
                ${Object.keys(formData).slice(0, 4).map(key => `
                    <div class="preview-row">
                        <div class="preview-label">${key}:</div>
                        <div class="preview-value">${formData[key]}</div>
                    </div>
                `).join('')}
            </div>
            <div class="preview-section">
                <h3><i class="fas fa-graduation-cap"></i> Academic Information</h3>
                ${Object.keys(formData).slice(4, 6).map(key => `
                    <div class="preview-row">
                        <div class="preview-label">${key}:</div>
                        <div class="preview-value">${formData[key]}</div>
                    </div>
                `).join('')}
            </div>
            <div class="preview-section">
                <h3><i class="fas fa-info-circle"></i> Additional Information</h3>
                ${Object.keys(formData).slice(6).map(key => `
                    <div class="preview-row">
                        <div class="preview-label">${key}:</div>
                        <div class="preview-value">${formData[key]}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Modal close buttons
    modalClose.addEventListener('click', () => successModal.style.display = 'none');
    previewModalClose.addEventListener('click', () => previewModal.style.display = 'none');
    closePreviewBtn.addEventListener('click', () => previewModal.style.display = 'none');
    
    // Submit from preview
    submitFromPreviewBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
        submitForm();
    });
    
    // New registration
    newRegistrationBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
        form.reset();
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        // Reset password strength
        strengthBar.style.width = '20%';
        strengthBar.style.backgroundColor = '#e74c3c';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#e74c3c';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Download confirmation
    downloadBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        this.disabled = true;
        
        setTimeout(() => {
            alert('Confirmation downloaded successfully!');
            this.innerHTML = '<i class="fas fa-download"></i> Download Confirmation';
            this.disabled = false;
        }, 2000);
    });
    
    // Go to dashboard
    dashboardBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
        
        setTimeout(() => {
            alert('In a real application, this would redirect to the student dashboard.');
            this.innerHTML = '<i class="fas fa-tachometer-alt"></i> Go to Student Dashboard';
            successModal.style.display = 'none';
        }, 1500);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape key closes modals
        if (event.key === 'Escape') {
            successModal.style.display = 'none';
            previewModal.style.display = 'none';
        }
        
        // Ctrl+Enter submits form
        if (event.ctrlKey && event.key === 'Enter') {
            submitForm();
        }
    });
    
    // Initialize date input with max date (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('max', today);
    
    // Add some initial styles to password strength bar
    strengthBar.style.width = '20%';
    strengthBar.style.backgroundColor = '#e74c3c';
});
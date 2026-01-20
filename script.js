// Login Form 1 - Glassmorphism Style JavaScript
// EXTENDED: Login + Add Account (Signup Mode)

class LoginForm1 {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.submitBtn = this.form.querySelector('.login-btn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;

        // MODE: login | signup
        this.mode = 'login';

        this.validators = {
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword
        };

        this.init();
    }

    init() {
        this.addEventListeners();
        FormUtils.setupFloatingLabels(this.form);
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        FormUtils.addSharedAnimations();
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => FormUtils.clearError(fieldName));
            }
        });

        const signupLink = document.querySelector('.signup-link a');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => this.toggleMode(e));
        }
    }

    toggleMode(e) {
        e.preventDefault();
        this.mode = this.mode === 'login' ? 'signup' : 'login';

        const title = document.getElementById('formTitle');
        const subtitle = document.getElementById('formSubtitle');
        const btnText = document.getElementById('btnText');
        const loginOptions = document.querySelector('.form-options');
        const switchText = document.querySelector('.signup-link p');

        if (this.mode === 'signup') {
            title.innerText = 'Masukkan Akun';
            subtitle.innerText = 'Tambahkan akun baru';
            btnText.innerText = 'Add';
            if (loginOptions) loginOptions.style.display = 'none';

            switchText.innerHTML = `
                Sudah punya akun?
                <a href="#" id="switchMode">Sign in</a>
            `;
        } else {
            title.innerText = 'Welcome Back';
            subtitle.innerText = 'Sign in to your account';
            btnText.innerText = 'Sign In';
            if (loginOptions) loginOptions.style.display = 'flex';

            switchText.innerHTML = `
                Don't have an account?
                <a href="#" id="switchMode">Sign up</a>
            `;
        }

        // Re-bind link
        document
            .getElementById('switchMode')
            .addEventListener('click', (e) => this.toggleMode(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        const isValid = this.validateForm();
        if (!isValid) return this.shakeForm();

        if (this.mode === 'login') {
            await this.submitLogin();
        } else {
            this.submitAddAccount();
        }
    }

    validateForm() {
        let valid = true;
        Object.keys(this.validators).forEach(field => {
            if (!this.validateField(field)) valid = false;
        });
        return valid;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        if (!field || !validator) return true;

        const result = validator(field.value.trim(), field);
        if (!result.isValid) {
            FormUtils.showError(fieldName, result.message);
            return false;
        }

        FormUtils.clearError(fieldName);
        return true;
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.4s';
        setTimeout(() => this.form.style.animation = '', 400);
    }

    async submitLogin() {
        this.isSubmitting = true;
        this.submitBtn.classList.add('loading');

        try {
            await FormUtils.simulateLogin(
                document.getElementById('email').value,
                document.getElementById('password').value
            );
            FormUtils.showNotification('Login berhasil', 'success', this.form);
        } catch {
            FormUtils.showNotification('Login gagal', 'error', this.form);
        } finally {
            this.submitBtn.classList.remove('loading');
            this.isSubmitting = false;
        }
    }

    submitAddAccount() {
        this.isSubmitting = true;
        this.submitBtn.classList.add('loading');

        setTimeout(() => {
            const data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                createdAt: new Date().toISOString()
            };

            console.log('SIAP KIRIM KE SPREADSHEET:', data);

            FormUtils.showNotification(
                'Akun berhasil ditambahkan',
                'success',
                this.form
            );

            this.submitBtn.classList.remove('loading');
            this.isSubmitting = false;
            this.form.reset();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginForm1();
});

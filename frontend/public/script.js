// Capstok Website JavaScript
// Admin mode code: 1990

(function() {
    'use strict';

    // State
    let isAdminMode = false;
    let keySequence = '';
    const adminCode = '1990';
    const keyTimeout = 2000; // Reset sequence after 2 seconds
    let keyTimer = null;

    // DOM Elements
    const body = document.body;
    const adminBanner = document.getElementById('adminBanner');
    const adminControls = document.getElementById('adminControls');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const exitAdminBtn = document.getElementById('exitAdminMode');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const editableElements = document.querySelectorAll('.editable');

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Key sequence detection for admin mode
    document.addEventListener('keydown', function(e) {
        // Only listen for number keys
        if (!/^[0-9]$/.test(e.key)) {
            keySequence = '';
            return;
        }

        // Clear previous timer
        if (keyTimer) {
            clearTimeout(keyTimer);
        }

        // Add key to sequence
        keySequence += e.key;

        // Set timer to reset sequence
        keyTimer = setTimeout(function() {
            keySequence = '';
        }, keyTimeout);

        // Check if sequence matches admin code
        if (keySequence === adminCode) {
            toggleAdminMode();
            keySequence = '';
        }

        // Reset if sequence is longer than code
        if (keySequence.length >= adminCode.length && keySequence !== adminCode) {
            keySequence = keySequence.slice(-adminCode.length);
        }
    });

    // Toggle Admin Mode
    function toggleAdminMode() {
        isAdminMode = !isAdminMode;

        if (isAdminMode) {
            enableAdminMode();
        } else {
            disableAdminMode();
        }
    }

    // Enable Admin Mode
    function enableAdminMode() {
        body.classList.add('admin-mode');
        adminBanner.classList.remove('hidden');
        adminBanner.style.display = 'block';
        adminControls.classList.remove('hidden');
        adminControls.style.display = 'block';

        // Make editable elements contenteditable
        editableElements.forEach(function(el) {
            el.setAttribute('contenteditable', 'true');
        });

        // Adjust body padding for admin banner
        document.getElementById('navbar').style.top = '40px';

        showToast('Bewerkingsmodus geactiveerd! Klik op tekst om te bewerken.', 'info');
    }

    // Disable Admin Mode
    function disableAdminMode() {
        body.classList.remove('admin-mode');
        adminBanner.classList.add('hidden');
        adminBanner.style.display = 'none';
        adminControls.classList.add('hidden');
        adminControls.style.display = 'none';

        // Remove contenteditable from elements
        editableElements.forEach(function(el) {
            el.removeAttribute('contenteditable');
        });

        // Reset navbar position
        document.getElementById('navbar').style.top = '0';

        showToast('Bewerkingsmodus afgesloten.', 'info');
    }

    // Exit Admin Mode Button
    if (exitAdminBtn) {
        exitAdminBtn.addEventListener('click', function() {
            if (isAdminMode) {
                disableAdminMode();
                isAdminMode = false;
            }
        });
    }

    // Copy HTML Button
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', function() {
            copyHtmlToClipboard();
        });
    }

    // Copy HTML to Clipboard
    function copyHtmlToClipboard() {
        // First, remove admin-mode specific attributes for clean export
        const tempBody = body.cloneNode(true);
        
        // Remove admin mode classes and styles
        tempBody.classList.remove('admin-mode');
        
        // Remove contenteditable attributes
        tempBody.querySelectorAll('[contenteditable]').forEach(function(el) {
            el.removeAttribute('contenteditable');
        });

        // Hide admin elements in clone
        const adminBannerClone = tempBody.querySelector('#adminBanner');
        const adminControlsClone = tempBody.querySelector('#adminControls');
        const toastClone = tempBody.querySelector('#toast');
        
        if (adminBannerClone) adminBannerClone.style.display = 'none';
        if (adminControlsClone) adminControlsClone.style.display = 'none';
        if (toastClone) toastClone.style.display = 'none';

        // Reset navbar position in clone
        const navbarClone = tempBody.querySelector('#navbar');
        if (navbarClone) navbarClone.style.top = '0';

        // Get the complete HTML document
        const doctype = '<!DOCTYPE html>';
        const html = document.documentElement.cloneNode(false);
        html.appendChild(document.head.cloneNode(true));
        html.appendChild(tempBody);
        
        const fullHtml = doctype + '\n' + html.outerHTML;

        // Copy to clipboard
        navigator.clipboard.writeText(fullHtml).then(function() {
            showToast('HTML succesvol gekopieerd naar klembord! Plak dit in je GitHub repository.', 'success');
        }).catch(function(err) {
            // Fallback for older browsers
            fallbackCopyToClipboard(fullHtml);
        });
    }

    // Fallback copy method for older browsers
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('HTML succesvol gekopieerd naar klembord!', 'success');
            } else {
                showToast('Kopiëren mislukt. Probeer het opnieuw.', 'error');
            }
        } catch (err) {
            showToast('Kopiëren niet ondersteund in deze browser.', 'error');
        }

        document.body.removeChild(textArea);
    }

    // Show Toast Notification
    function showToast(message, type) {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        
        // Set color based on type
        toast.className = 'fixed bottom-6 left-6 z-50 px-6 py-4 flex items-center space-x-3 shadow-2xl toast-enter';
        
        switch(type) {
            case 'success':
                toast.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                toast.classList.add('bg-red-500', 'text-white');
                break;
            case 'info':
            default:
                toast.classList.add('bg-capstok-yellow', 'text-capstok-dark');
                break;
        }

        toast.style.display = 'flex';

        // Auto-hide after 4 seconds
        setTimeout(function() {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            
            setTimeout(function() {
                toast.style.display = 'none';
                toast.classList.remove('toast-exit');
            }, 300);
        }, 4000);
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }

        lastScrollY = currentScrollY;
    });

    // Initialize - ensure admin elements are hidden on load
    if (adminBanner) adminBanner.style.display = 'none';
    if (adminControls) adminControls.style.display = 'none';
    if (toast) toast.style.display = 'none';

    // Console message for developers
    console.log('%c🔒 Capstok Admin Mode', 'color: #facc15; font-size: 16px; font-weight: bold;');
    console.log('%cTyp "1990" om de bewerkingsmodus te activeren.', 'color: #a1a1aa; font-size: 12px;');

})();

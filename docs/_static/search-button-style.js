// search-button-style.js
// Customize search button appearance: change text from "Search Ctrl+K" to "Type / to search"
// Lightweight version - only handles visual changes

(function() {
    'use strict';
    
    // Performance optimization: debounce function to avoid excessive DOM queries
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Main function to customize button appearance
    function customizeButtonAppearance() {
        // Use efficient selector
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            // Button not found, but don't retry aggressively to avoid performance issues
            return;
        }
        
        // Check if already styled to avoid duplicate work
        if (searchButton.getAttribute('data-styled')) {
            return;
        }
        
        // Hide original text elements (lightweight approach)
        const defaultText = searchButton.querySelector('.search-button__default-text');
        const kbdShortcut = searchButton.querySelector('.search-button__kbd-shortcut');
        
        if (defaultText) {
            defaultText.style.display = 'none';
        }
        
        if (kbdShortcut) {
            kbdShortcut.style.display = 'none';
        }
        
        // Create and add new text
        const newText = document.createElement('span');
        newText.className = 'search-button__custom-text';
        newText.textContent = 'Type / to search';
        newText.style.cssText = 'margin-left:8px;font-size:0.9em;font-weight:500;';
        
        // Use DocumentFragment for minimal reflow
        const fragment = document.createDocumentFragment();
        fragment.appendChild(newText);
        searchButton.appendChild(fragment);
        
        // Update tooltip if present
        if (searchButton.hasAttribute('data-bs-original-title')) {
            searchButton.setAttribute('data-bs-original-title', 'Type / to search');
        }
        
        // Mark as styled
        searchButton.setAttribute('data-styled', 'true');
        
        console.log('Button appearance customized');
    }
    
    // Initialize with performance considerations
    function init() {
        // Wait a short time for DOM to be ready, but not too long
        if (document.readyState === 'loading') {
            // If still loading, wait for DOMContentLoaded but with a timeout
            const domReadyTimeout = setTimeout(() => {
                customizeButtonAppearance();
            }, 100);
            
            document.addEventListener('DOMContentLoaded', () => {
                clearTimeout(domReadyTimeout);
                customizeButtonAppearance();
            });
        } else {
            // DOM already ready, execute immediately
            customizeButtonAppearance();
        }
    }
    
    // Start initialization
    init();
})();
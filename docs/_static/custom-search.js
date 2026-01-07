// search-button-integrated.js
// Single file solution: customizes button appearance AND ensures click triggers SSS search

(function() {
    'use strict';
    
    console.log('Integrated search button solution loading...');
    
    let isInitialized = false;
    let clickHandler = null;
    
    // Main function that handles both styling and click behavior
    function initializeSearchButton() {
        if (isInitialized) return;
        
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            console.log('Search button not found yet, will retry...');
            setTimeout(initializeSearchButton, 300);
            return;
        }
        
        console.log('Found search button, initializing...');
        
        // Part 1: Customize button appearance (if not already done)
        if (!searchButton.getAttribute('data-customized')) {
            customizeAppearance(searchButton);
        }
        
        // Part 2: Ensure click event works
        ensureClickBehavior(searchButton);
        
        isInitialized = true;
        console.log('✅ Search button fully initialized');
    }
    
    // Customize button text from "Search Ctrl+K" to "Type / to search"
    function customizeAppearance(button) {
        console.log('Customizing button appearance...');
        
        // Hide original text elements
        const defaultText = button.querySelector('.search-button__default-text');
        const kbdShortcut = button.querySelector('.search-button__kbd-shortcut');
        
        if (defaultText) {
            defaultText.style.display = 'none';
        }
        
        if (kbdShortcut) {
            kbdShortcut.style.display = 'none';
        }
        
        // Add new text
        const newText = document.createElement('span');
        newText.className = 'search-button__custom-text';
        newText.textContent = 'Type / to search';
        newText.style.cssText = 'margin-left:8px;font-size:0.9em;font-weight:500;';
        
        button.appendChild(newText);
        
        // Update tooltip
        if (button.hasAttribute('data-bs-original-title')) {
            button.setAttribute('data-bs-original-title', 'Type / to search');
        } else if (button.hasAttribute('title')) {
            button.setAttribute('title', 'Type / to search');
        }
        
        button.setAttribute('data-customized', 'true');
    }
    
    // Ensure button click triggers SSS search
    function ensureClickBehavior(button) {
        console.log('Setting up click behavior...');
        
        // Remove any existing click handler we created
        if (clickHandler) {
            button.removeEventListener('click', clickHandler);
        }
        
        // Create new click handler
        clickHandler = function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            console.log('Search button clicked - triggering SSS');
            triggerSSSSearch();
            
            return false;
        };
        
        // Add event listener with capture phase to ensure we get it first
        button.addEventListener('click', clickHandler, true);
        
        // Also try to remove any other click handlers (by cloning the button)
        try {
            // Clone button to remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Re-apply our click handler to the new button
            newButton.addEventListener('click', clickHandler, true);
            
            // Re-apply customization if needed
            if (!newButton.getAttribute('data-customized')) {
                customizeAppearance(newButton);
            }
            
            console.log('Button replaced to ensure clean event handling');
        } catch (e) {
            console.log('Could not clone button, using direct event handler');
        }
    }
    
    // Function to trigger Read the Docs SSS search
    function triggerSSSSearch() {
        console.log('Triggering SSS search...');
        
        try {
            // Method 1: Simulate pressing / key
            const event = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            
            // Dispatch the event
            document.dispatchEvent(event);
            
            console.log('✅ / key event dispatched');
            
            // Also try to trigger keyup event for completeness
            setTimeout(() => {
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: '/',
                    bubbles: true
                });
                document.dispatchEvent(keyUpEvent);
            }, 50);
            
        } catch (error) {
            console.error('Failed to trigger SSS search:', error);
            
            // Fallback: try to find and focus the SSS search input
            setTimeout(() => {
                const sssInput = document.querySelector('.search-query, [type="search"]');
                if (sssInput) {
                    sssInput.focus();
                    console.log('Focused existing search input');
                } else {
                    // Final fallback: redirect to search page
                    window.location.href = '/search/';
                }
            }, 100);
        }
    }
    
    // Add minimal CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'search-button-styles';
        style.textContent = `
            .search-button-field {
                min-width: 160px !important;
                justify-content: flex-start !important;
            }
            
            .search-button-field:hover {
                cursor: pointer;
                transform: translateY(-1px);
                transition: transform 0.2s;
            }
            
            .search-button__custom-text {
                font-size: 0.9em !important;
                font-weight: 500 !important;
            }
            
            @media (max-width: 768px) {
                .search-button-field {
                    min-width: 140px !important;
                }
                
                .search-button__custom-text {
                    font-size: 0.85em !important;
                }
            }
        `;
        
        if (!document.getElementById('search-button-styles')) {
            document.head.appendChild(style);
        }
    }
    
    // Initialize everything
    function init() {
        console.log('Initializing integrated search button solution...');
        
        // Add styles first
        addStyles();
        
        // Try to initialize immediately
        initializeSearchButton();
        
        // Also set up a MutationObserver for dynamic content
        const observer = new MutationObserver(function(mutations) {
            const searchButton = document.querySelector('.search-button-field.search-button__button');
            if (searchButton && !isInitialized) {
                console.log('Button appeared dynamically, initializing...');
                initializeSearchButton();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Set timeout to ensure initialization even if observer misses it
        setTimeout(() => {
            if (!isInitialized) {
                console.log('Timeout: forcing initialization...');
                initializeSearchButton();
            }
        }, 2000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Use setTimeout to avoid blocking
        setTimeout(init, 100);
    }
    
    // Debug function for testing
    window.debugSearchButton = function() {
        console.group('🔍 Search Button Debug Info');
        
        const button = document.querySelector('.search-button-field.search-button__button');
        console.log('Button exists:', !!button);
        
        if (button) {
            console.log('Button HTML:', button.outerHTML);
            console.log('Is customized:', button.getAttribute('data-customized'));
            console.log('Event listeners:', 
                typeof getEventListeners === 'function' ? 
                getEventListeners(button) : 'Use Chrome DevTools');
            
            // Test click programmatically
            console.log('Testing click...');
            button.click();
        }
        
        console.groupEnd();
    };
    
})();
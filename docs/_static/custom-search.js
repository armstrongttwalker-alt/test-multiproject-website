// search-button-enhanced.js
// Enhanced version with kbd styling for the slash key

(function() {
    'use strict';
    
    console.log('Enhanced search button solution loading...');
    
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
        if (!searchButton.getAttribute('data-enhanced')) {
            customizeAppearance(searchButton);
        }
        
        // Part 2: Ensure click event works
        ensureClickBehavior(searchButton);
        
        isInitialized = true;
        console.log('✅ Search button fully initialized with enhanced styling');
    }
    
    // Customize button text from "Search Ctrl+K" to "Type / to search"
    function customizeAppearance(button) {
        console.log('Customizing button appearance with kbd element...');
        
        // Hide original text elements
        const defaultText = button.querySelector('.search-button__default-text');
        const kbdShortcut = button.querySelector('.search-button__kbd-shortcut');
        
        if (defaultText) {
            defaultText.style.display = 'none';
        }
        
        if (kbdShortcut) {
            kbdShortcut.style.display = 'none';
        }
        
        // Create enhanced text with kbd element for the slash key
        const textContainer = document.createElement('span');
        textContainer.className = 'search-button__custom-text';
        
        // Create text nodes and kbd element
        const textBefore = document.createTextNode('Type ');
        const kbdElement = document.createElement('kbd');
        kbdElement.className = 'search-button__kbd';
        kbdElement.textContent = '/';
        const textAfter = document.createTextNode(' to search');
        
        // Assemble the text
        textContainer.appendChild(textBefore);
        textContainer.appendChild(kbdElement);
        textContainer.appendChild(textAfter);
        
        // Add to button
        button.appendChild(textContainer);
        
        // Update tooltip
        if (button.hasAttribute('data-bs-original-title')) {
            button.setAttribute('data-bs-original-title', 'Type / to search');
        } else if (button.hasAttribute('title')) {
            button.setAttribute('title', 'Type / to search');
        }
        
        // Update aria-label for better accessibility
        try {
            button.setAttribute('aria-label', 'Type slash to search');
        } catch (e) {
            // Ignore if we can't set it
        }
        
        button.setAttribute('data-enhanced', 'true');
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
            
        } catch (error) {
            console.error('Failed to trigger SSS search:', error);
            
            // Fallback
            setTimeout(() => {
                window.location.href = '/search/';
            }, 100);
        }
    }
    
    // Add enhanced CSS styles with kbd styling
    function addEnhancedStyles() {
        const style = document.createElement('style');
        style.id = 'search-button-enhanced-styles';
        style.textContent = `
            /* Base button styling */
            .search-button-field {
                min-width: 180px !important;
                justify-content: flex-start !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
            
            /* Hover effect */
            .search-button-field:hover {
                cursor: pointer;
                transform: translateY(-1px);
                transition: transform 0.2s;
            }
            
            /* Custom text container */
            .search-button__custom-text {
                font-size: 0.9em !important;
                font-weight: 500 !important;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            /* Kbd element styling - similar to the example */
            .search-button__kbd {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 20px;
                height: 20px;
                padding: 0 4px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                font-size: 12px;
                font-weight: 600;
                line-height: 1;
                color: #1f2328;
                background-color: #f6f8fa;
                border: 1px solid #d0d7de;
                border-radius: 4px;
                box-shadow: 0 1px 0 rgba(31, 35, 40, 0.04);
                margin: 0 2px;
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .search-button__kbd {
                    color: #e6edf3;
                    background-color: #30363d;
                    border-color: #6e7681;
                    box-shadow: 0 1px 0 rgba(110, 118, 129, 0.2);
                }
            }
            
            /* More compact kbd for small screens */
            @media (max-width: 768px) {
                .search-button__kbd {
                    min-width: 18px;
                    height: 18px;
                    font-size: 11px;
                }
                
                .search-button__custom-text {
                    font-size: 0.85em !important;
                }
            }
            
            /* Animation for the kbd on hover */
            .search-button-field:hover .search-button__kbd {
                transform: translateY(-1px);
                box-shadow: 0 2px 0 rgba(31, 35, 40, 0.08);
                transition: all 0.1s ease;
            }
        `;
        
        if (!document.getElementById('search-button-enhanced-styles')) {
            document.head.appendChild(style);
        }
    }
    
    // Alternative: More prominent kbd styling
    function addAlternativeStyles() {
        const style = document.createElement('style');
        style.id = 'search-button-alternative-styles';
        style.textContent = `
            /* Alternative kbd styling - more like GitHub's style */
            .search-button__kbd {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
                font-size: 13px;
                font-weight: 700;
                line-height: 1;
                color: #24292f;
                background: linear-gradient(180deg, #f6f8fa 0%, #ebedf0 100%);
                border: 1px solid #d1d9e0;
                border-bottom-color: #c0c8d1;
                border-radius: 6px;
                box-shadow: inset 0 -1px 0 #c0c8d1, 0 1px 1px rgba(31, 35, 40, 0.04);
                margin: 0 3px;
            }
            
            /* Dark mode for alternative style */
            @media (prefers-color-scheme: dark) {
                .search-button__kbd {
                    color: #f0f6fc;
                    background: linear-gradient(180deg, #30363d 0%, #262b32 100%);
                    border: 1px solid #6e7681;
                    border-bottom-color: #484f58;
                    box-shadow: inset 0 -1px 0 #484f58, 0 1px 1px rgba(110, 118, 129, 0.2);
                }
            }
        `;
        
        // Uncomment the line below to use the alternative style
        // document.head.appendChild(style);
    }
    
    // Initialize everything
    function init() {
        console.log('Initializing enhanced search button solution...');
        
        // Add styles
        addEnhancedStyles();
        // Uncomment the line below to try the alternative style
        // addAlternativeStyles();
        
        // Try to initialize immediately
        initializeSearchButton();
        
        // Set up a MutationObserver for dynamic content
        const observer = new MutationObserver(function(mutations) {
            const searchButton = document.querySelector('.search-button-field.search-button__button');
            if (searchButton && !isInitialized) {
                console.log('Button appeared dynamically, initializing...');
                initializeSearchButton();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Set timeout to ensure initialization
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
        setTimeout(init, 100);
    }
    
    // Debug function
    window.debugSearchButton = function() {
        console.group('🔍 Enhanced Search Button Debug Info');
        
        const button = document.querySelector('.search-button-field.search-button__button');
        console.log('Button exists:', !!button);
        
        if (button) {
            console.log('Button HTML:', button.outerHTML);
            console.log('Is enhanced:', button.getAttribute('data-enhanced'));
            
            // Check if kbd element exists
            const kbdElement = button.querySelector('.search-button__kbd');
            console.log('KBD element found:', !!kbdElement);
            if (kbdElement) {
                console.log('KBD element:', kbdElement.outerHTML);
            }
        }
        
        console.groupEnd();
    };
    
})();
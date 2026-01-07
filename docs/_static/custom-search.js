// search-button-spacing.js
// Enhanced version with proper spacing between icon and text

(function() {
    'use strict';
    
    console.log('Search button with improved spacing loading...');
    
    let isInitialized = false;
    let clickHandler = null;
    
    // Main function
    function initializeSearchButton() {
        if (isInitialized) return;
        
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            console.log('Search button not found yet, will retry...');
            setTimeout(initializeSearchButton, 300);
            return;
        }
        
        console.log('Found search button, initializing...');
        
        // Part 1: Customize button appearance
        if (!searchButton.getAttribute('data-spacing-fixed')) {
            customizeAppearance(searchButton);
        }
        
        // Part 2: Ensure click event works
        ensureClickBehavior(searchButton);
        
        isInitialized = true;
        console.log('✅ Search button fully initialized with improved spacing');
    }
    
    // Customize button appearance
    function customizeAppearance(button) {
        console.log('Customizing button with improved spacing...');
        
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
        
        // Update aria-label
        try {
            button.setAttribute('aria-label', 'Type slash to search');
        } catch (e) {
            // Ignore if we can't set it
        }
        
        button.setAttribute('data-spacing-fixed', 'true');
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
            // Simulate pressing / key
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
    
    // Add CSS styles with improved spacing
    function addImprovedSpacingStyles() {
        const style = document.createElement('style');
        style.id = 'search-button-spacing-styles';
        style.textContent = `
            /* Base button styling with improved spacing */
            .search-button-field {
                min-width: 190px !important; /* Slightly wider to accommodate more spacing */
                justify-content: flex-start !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
            
            /* Increased spacing between search icon and text */
            /* Target the search icon (FontAwesome icon) */
            .search-button-field .svg-inline--fa,
            .search-button-field .fa-magnifying-glass,
            .search-button-field i[class*="fa-"] {
                margin-right: 14px !important; /* Increased from default 8px to 14px */
            }
            
            /* Alternative selectors for different icon implementations */
            .search-button-field svg:first-child,
            .search-button-field [class*="icon"]:first-child {
                margin-right: 14px !important;
            }
            
            /* Hover effect */
            .search-button-field:hover {
                cursor: pointer;
                transform: translateY(-1px);
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            /* Custom text container - use flex for better alignment */
            .search-button__custom-text {
                font-size: 0.9em !important;
                font-weight: 500 !important;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
            }
            
            /* Kbd element styling */
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
                background-color: #f6f8fa;
                border: 1px solid #d0d7de;
                border-radius: 6px;
                box-shadow: 0 1px 0 rgba(31, 35, 40, 0.04);
                margin: 0 4px;
            }
            
            /* Additional spacing adjustments for better visual balance */
            .search-button__custom-text {
                letter-spacing: 0.01em; /* Slight letter spacing for better readability */
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
            
            /* Responsive adjustments */
            @media (max-width: 992px) {
                .search-button-field {
                    min-width: 180px !important;
                }
                
                .search-button-field .svg-inline--fa,
                .search-button-field .fa-magnifying-glass,
                .search-button-field i[class*="fa-"] {
                    margin-right: 12px !important; /* Slightly less spacing on medium screens */
                }
            }
            
            @media (max-width: 768px) {
                .search-button-field {
                    min-width: 170px !important;
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                }
                
                .search-button-field .svg-inline--fa,
                .search-button-field .fa-magnifying-glass,
                .search-button-field i[class*="fa-"] {
                    margin-right: 10px !important; /* Reduced spacing on small screens */
                }
                
                .search-button__custom-text {
                    font-size: 0.85em !important;
                    gap: 3px;
                }
                
                .search-button__kbd {
                    min-width: 20px;
                    height: 20px;
                    font-size: 12px;
                    padding: 0 5px;
                }
            }
            
            @media (max-width: 576px) {
                .search-button-field {
                    min-width: 150px !important;
                    padding-left: 8px !important;
                    padding-right: 8px !important;
                }
                
                .search-button-field .svg-inline--fa,
                .search-button-field .fa-magnifying-glass,
                .search-button-field i[class*="fa-"] {
                    margin-right: 8px !important; /* Minimal spacing on very small screens */
                }
                
                .search-button__custom-text {
                    font-size: 0.8em !important;
                }
            }
            
            /* Animation for the kbd on hover */
            .search-button-field:hover .search-button__kbd {
                transform: translateY(-1px);
                box-shadow: 0 2px 0 rgba(31, 35, 40, 0.08);
                transition: all 0.1s ease;
            }
            
            /* Ensure proper alignment of all button contents */
            .search-button-field > * {
                vertical-align: middle;
            }
        `;
        
        if (!document.getElementById('search-button-spacing-styles')) {
            document.head.appendChild(style);
        }
    }
    
    // Initialize everything
    function init() {
        console.log('Initializing search button with improved spacing...');
        
        // Add styles
        addImprovedSpacingStyles();
        
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
    
    // Debug function for testing spacing
    window.debugSpacing = function() {
        console.group('🔍 Button Spacing Debug Info');
        
        const button = document.querySelector('.search-button-field.search-button__button');
        console.log('Button exists:', !!button);
        
        if (button) {
            // Get the search icon
            const icon = button.querySelector('svg, .fa-magnifying-glass, i[class*="fa-"]');
            console.log('Icon found:', !!icon);
            
            if (icon) {
                const computedStyle = window.getComputedStyle(icon);
                console.log('Icon margin-right:', computedStyle.marginRight);
                console.log('Icon width/height:', icon.clientWidth, 'x', icon.clientHeight);
            }
            
            // Get the custom text container
            const textContainer = button.querySelector('.search-button__custom-text');
            console.log('Text container found:', !!textContainer);
            
            // Calculate spacing
            if (icon && textContainer) {
                const iconRect = icon.getBoundingClientRect();
                const textRect = textContainer.getBoundingClientRect();
                const spacing = textRect.left - iconRect.right;
                console.log('Actual spacing between icon and text:', spacing, 'px');
            }
            
            console.log('Button HTML:', button.outerHTML);
        }
        
        console.groupEnd();
    };
    
})();
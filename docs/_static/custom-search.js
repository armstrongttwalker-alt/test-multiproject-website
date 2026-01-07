// search-button-customization.js
// Customize PyData Theme search button to show "Type / to search" and trigger Read the Docs SSS (Server Side Search)
// This script will:
// 1. Change button text from "Search Ctrl+K" to "Type / to search"
// 2. Make button click trigger Read the Docs SSS (simulating / key press)
// 3. Keep the original / key functionality unchanged

(function() {
    'use strict';
    
    console.log('PyData search button customization script loading...');
    
    // Main function to customize the search button
    function customizeSearchButton() {
        // Find the PyData Theme search button using its class
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        // If button not found, retry after a delay
        if (!searchButton) {
            console.log('Search button not found, retrying...');
            setTimeout(customizeSearchButton, 300);
            return;
        }
        
        // Check if already customized to avoid duplicate processing
        if (searchButton.getAttribute('data-customized')) {
            return;
        }
        
        console.log('Found search button, starting customization...');
        
        // 1. Hide original text and keyboard shortcut
        hideOriginalElements(searchButton);
        
        // 2. Create and add new text element
        addNewTextElement(searchButton);
        
        // 3. Update accessibility attributes
        updateAccessibilityAttributes(searchButton);
        
        // 4. Override click event to trigger SSS search
        overrideClickEvent(searchButton);
        
        // 5. Add custom styles for better appearance
        addButtonStyles();
        
        // Mark as customized
        searchButton.setAttribute('data-customized', 'true');
        
        console.log('✅ Search button customization complete');
    }
    
    // Hide original text and Ctrl+K shortcut elements
    function hideOriginalElements(button) {
        const defaultText = button.querySelector('.search-button__default-text');
        const kbdShortcut = button.querySelector('.search-button__kbd-shortcut');
        
        if (defaultText) {
            defaultText.style.display = 'none';
        }
        
        if (kbdShortcut) {
            kbdShortcut.style.display = 'none';
        }
        
        console.log('Original text elements hidden');
    }
    
    // Create and add "Type / to search" text element
    function addNewTextElement(button) {
        const newText = document.createElement('span');
        newText.className = 'search-button__custom-text';
        newText.textContent = 'Type / to search';
        
        // Apply styling
        newText.style.cssText = `
            margin-left: 8px;
            font-size: 0.9em;
            font-weight: 500;
            color: inherit;
            white-space: nowrap;
        `;
        
        // Add to button (after the search icon)
        button.appendChild(newText);
        
        console.log('New text "Type / to search" added');
    }
    
    // Update accessibility attributes for better screen reader support
    function updateAccessibilityAttributes(button) {
        // Update aria-label for screen readers
        try {
            button.setAttribute('aria-label', 'Search documentation. Type / to open search box.');
        } catch (e) {
            console.log('Could not update aria-label');
        }
        
        // Update tooltip if present
        if (button.hasAttribute('data-bs-original-title')) {
            button.setAttribute('data-bs-original-title', 'Type / to search');
        } else if (button.hasAttribute('title')) {
            button.setAttribute('title', 'Type / to search');
        }
        
        console.log('Accessibility attributes updated');
    }
    
    // Override button click to trigger Read the Docs SSS search
    function overrideClickEvent(button) {
        // Clone button to remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new click event handler
        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('Search button clicked, triggering SSS search...');
            triggerSSSSearch();
        });
        
        console.log('Click event overridden to trigger SSS search');
    }
    
    // Trigger Read the Docs server side search (simulates pressing / key)
    function triggerSSSSearch() {
        try {
            console.log('Simulating / key press for SSS search...');
            
            // Create and dispatch / key event
            const slashEvent = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            
            // Dispatch the event
            document.dispatchEvent(slashEvent);
            
            console.log('✅ / key event dispatched for SSS search');
            
        } catch (error) {
            console.error('Failed to trigger SSS search:', error);
            
            // Fallback: redirect to search page if event dispatch fails
            setTimeout(() => {
                window.location.href = '/search/';
            }, 100);
        }
    }
    
    // Add custom CSS styles for the button
    function addButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ensure button has enough width for the new text */
            .search-button-field {
                min-width: 180px !important;
                justify-content: flex-start !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
                transition: all 0.2s ease !important;
            }
            
            /* Style the search icon */
            .search-button-field .svg-inline--fa {
                margin-right: 8px !important;
            }
            
            /* Style for the custom text */
            .search-button__custom-text {
                font-size: 0.9em !important;
                font-weight: 500 !important;
                color: inherit !important;
            }
            
            /* Hover effect */
            .search-button-field:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            /* Responsive adjustments for smaller screens */
            @media (max-width: 768px) {
                .search-button-field {
                    min-width: 160px !important;
                }
                .search-button__custom-text {
                    font-size: 0.85em !important;
                }
            }
            
            @media (max-width: 576px) {
                .search-button-field {
                    min-width: 140px !important;
                    padding: 8px 10px !important;
                }
                .search-button__custom-text {
                    font-size: 0.8em !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('Custom styles added');
    }
    
    // Initialize the script
    function init() {
        // Start customization
        customizeSearchButton();
        
        // Set up a MutationObserver to handle dynamically loaded buttons
        const observer = new MutationObserver(function(mutations) {
            const searchButton = document.querySelector('.search-button-field.search-button__button');
            if (searchButton && !searchButton.getAttribute('data-customized')) {
                console.log('New search button detected, customizing...');
                customizeSearchButton();
            }
        });
        
        // Observe DOM changes
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('Search button customization script initialized');
    }
    
    // Start when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export functions for debugging in console
    window._searchButtonCustomizer = {
        recustomize: customizeSearchButton,
        triggerSearch: triggerSSSSearch,
        checkStatus: function() {
            const btn = document.querySelector('.search-button-field');
            return {
                found: !!btn,
                customized: btn && btn.getAttribute('data-customized'),
                text: btn ? btn.textContent : 'No button'
            };
        }
    };
    
    console.log('Debug tools available: type _searchButtonCustomizer in console');
})();
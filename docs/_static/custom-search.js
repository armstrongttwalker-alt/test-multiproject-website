// search-button-spacing.js
// Only adjust spacing between search icon and "Type" text

(function() {
    'use strict';
    
    console.log('Search button spacing adjustment loading...');
    
    let isInitialized = false;
    let clickHandler = null;
    
    function initializeSearchButton() {
        if (isInitialized) return;
        
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            setTimeout(initializeSearchButton, 300);
            return;
        }
        
        console.log('Found search button, initializing spacing...');
        
        if (!searchButton.getAttribute('data-spacing-adjusted')) {
            customizeSpacing(searchButton);
        }
        
        ensureClickBehavior(searchButton);
        
        isInitialized = true;
        console.log('✅ Search button spacing adjusted');
    }
    
    function customizeSpacing(button) {
        console.log('Adjusting spacing between icon and text...');
        
        // Hide original text elements
        const defaultText = button.querySelector('.search-button__default-text');
        const kbdShortcut = button.querySelector('.search-button__kbd-shortcut');
        
        if (defaultText) {
            defaultText.style.display = 'none';
        }
        
        if (kbdShortcut) {
            kbdShortcut.style.display = 'none';
        }
        
        // Create text with kbd element
        const textContainer = document.createElement('span');
        textContainer.className = 'search-button__custom-text';
        
        const textBefore = document.createTextNode('Type ');
        const kbdElement = document.createElement('kbd');
        kbdElement.className = 'search-button__kbd';
        kbdElement.textContent = '/';
        const textAfter = document.createTextNode(' to search');
        
        textContainer.appendChild(textBefore);
        textContainer.appendChild(kbdElement);
        textContainer.appendChild(textAfter);
        
        button.appendChild(textContainer);
        
        if (button.hasAttribute('data-bs-original-title')) {
            button.setAttribute('data-bs-original-title', 'Type / to search');
        }
        
        button.setAttribute('data-spacing-adjusted', 'true');
    }
    
    function ensureClickBehavior(button) {
        if (clickHandler) {
            button.removeEventListener('click', clickHandler);
        }
        
        clickHandler = function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            triggerSSSSearch();
            
            return false;
        };
        
        button.addEventListener('click', clickHandler, true);
    }
    
    function triggerSSSSearch() {
        try {
            const event = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            
            document.dispatchEvent(event);
            
        } catch (error) {
            setTimeout(() => {
                window.location.href = '/search/';
            }, 100);
        }
    }
    
    // Only adjust spacing here, nothing else
    function addSpacingStyles() {
        const style = document.createElement('style');
        style.id = 'search-button-spacing-styles';
        style.textContent = `
            /* ONLY adjust spacing: increase margin between search icon and text */
            .search-button-field .svg-inline--fa {
                margin-right: 16px !important; /* Increased from original 8px */
            }
            
            /* Keep existing styles for kbd element */
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
            
            @media (prefers-color-scheme: dark) {
                .search-button__kbd {
                    color: #e6edf3;
                    background-color: #30363d;
                    border-color: #6e7681;
                    box-shadow: 0 1px 0 rgba(110, 118, 129, 0.2);
                }
            }
        `;
        
        if (!document.getElementById('search-button-spacing-styles')) {
            document.head.appendChild(style);
        }
    }
    
    function init() {
        console.log('Initializing spacing adjustment...');
        
        // Only add spacing styles
        addSpacingStyles();
        
        initializeSearchButton();
        
        const observer = new MutationObserver(function(mutations) {
            const searchButton = document.querySelector('.search-button-field.search-button__button');
            if (searchButton && !isInitialized) {
                initializeSearchButton();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(() => {
            if (!isInitialized) {
                initializeSearchButton();
            }
        }, 2000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
})();
// search-button-dark-mode.js
// Fix text visibility on dark mode hover

(function() {
    'use strict';
    
    console.log('Dark mode hover fix loading...');
    
    let isInitialized = false;
    let clickHandler = null;
    
    function initializeSearchButton() {
        if (isInitialized) return;
        
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            setTimeout(initializeSearchButton, 300);
            return;
        }
        
        if (!searchButton.getAttribute('data-dark-mode-fixed')) {
            customizeButton(searchButton);
        }
        
        ensureClickBehavior(searchButton);
        
        isInitialized = true;
        console.log('✅ Dark mode hover fix applied');
    }
    
    function customizeButton(button) {
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
        
        button.setAttribute('data-dark-mode-fixed', 'true');
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
    
    // Fix dark mode hover visibility
    function addDarkModeFix() {
        const style = document.createElement('style');
        style.id = 'search-button-dark-mode-fix';
        style.textContent = `
            /* Increase spacing between icon and text */
            .search-button-field .svg-inline--fa {
                margin-right: 16px !important;
            }
            
            /* Original kbd styling */
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
            
            /* FIX: Ensure text remains visible on hover in dark mode */
            .search-button-field:hover {
                /* Keep existing hover effects but ensure text contrast */
            }
            
            /* Explicitly set text color for dark mode hover */
            @media (prefers-color-scheme: dark) {
                .search-button-field:hover {
                    /* Force text color to ensure visibility */
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                
                .search-button-field:hover .search-button__custom-text {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                
                .search-button-field:hover .search-button__kbd {
                    /* Keep kbd styling but make sure it contrasts with hover background */
                    background-color: #40464d !important;
                    border-color: #7a828b !important;
                    color: #f0f6fc !important;
                }
            }
            
            /* Additional fix for all themes - ensure text contrast */
            .search-button-field:hover .search-button__custom-text {
                opacity: 1 !important;
            }
            
            .search-button-field:hover .search-button__kbd {
                opacity: 1 !important;
            }
        `;
        
        if (!document.getElementById('search-button-dark-mode-fix')) {
            document.head.appendChild(style);
        }
    }
    
    // Alternative: Force specific colors for dark mode hover
    function addForceDarkModeColors() {
        const forceStyle = document.createElement('style');
        forceStyle.id = 'search-button-force-dark-colors';
        forceStyle.textContent = `
            /* Force specific colors for dark mode hover to ensure visibility */
            @media (prefers-color-scheme: dark) {
                .search-button-field.search-button__button:hover {
                    /* Force specific background and text colors */
                    background-color: rgba(255, 255, 255, 0.15) !important;
                }
                
                .search-button-field.search-button__button:hover .search-button__custom-text {
                    color: #ffffff !important;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }
                
                .search-button-field.search-button__button:hover .search-button__kbd {
                    background-color: #50565d !important;
                    border-color: #8a9199 !important;
                    color: #ffffff !important;
                    box-shadow: 0 1px 0 rgba(140, 148, 157, 0.3) !important;
                }
            }
        `;
        
        if (!document.getElementById('search-button-force-dark-colors')) {
            document.head.appendChild(forceStyle);
        }
    }
    
    function init() {
        console.log('Initializing dark mode hover fix...');
        
        // Add the main dark mode fix
        addDarkModeFix();
        
        // Add more aggressive color forcing if needed
        addForceDarkModeColors();
        
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
    
    // Debug function to check current colors
    window.checkButtonColors = function() {
        const btn = document.querySelector('.search-button-field');
        if (!btn) {
            console.log('Button not found');
            return;
        }
        
        const computedStyle = window.getComputedStyle(btn);
        const textColor = computedStyle.color;
        const bgColor = computedStyle.backgroundColor;
        
        console.group('Button Color Analysis');
        console.log('Text color:', textColor);
        console.log('Background color:', bgColor);
        console.log('Is dark mode?', window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Calculate contrast ratio (simplified)
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        console.groupEnd();
    };
    
})();
// search-button-click.js
// Handle search button click to trigger Read the Docs SSS search
// Lightweight version - only handles click behavior

(function() {
    'use strict';
    
    // Performance optimization: single event listener with event delegation
    let searchButton = null;
    let clickHandlerAttached = false;
    
    // Efficient function to find and cache the search button
    function findSearchButton() {
        if (!searchButton) {
            searchButton = document.querySelector('.search-button-field.search-button__button');
        }
        return searchButton;
    }
    
    // Function to trigger SSS search (simulates / key press)
    function triggerSSSSearch() {
        try {
            // Create keyboard event
            const event = new KeyboardEvent('keydown', {
                key: '/',
                bubbles: true,
                cancelable: true
            });
            
            // Dispatch event
            document.dispatchEvent(event);
        } catch (error) {
            console.warn('Could not trigger SSS search:', error);
        }
    }
    
    // Handle button click
    function handleButtonClick(event) {
        // Ensure we're clicking the search button or its children
        const target = event.target;
        const button = target.closest('.search-button-field');
        
        if (button && button.classList.contains('search-button__button')) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('Search button clicked - triggering SSS');
            triggerSSSSearch();
        }
    }
    
    // Attach click handler with event delegation (more efficient)
    function attachClickHandler() {
        if (clickHandlerAttached) return;
        
        // Use event delegation on document body
        document.body.addEventListener('click', handleButtonClick, true); // Use capture phase
        
        clickHandlerAttached = true;
        console.log('Click handler attached via event delegation');
    }
    
    // Initialize - wait for button to be available
    function init() {
        // Try to find button immediately
        if (findSearchButton()) {
            attachClickHandler();
            return;
        }
        
        // If button not found, set up a more efficient observer
        // Use a single MutationObserver with limited scope
        const observer = new MutationObserver(function(mutations) {
            // Check if button exists now
            if (findSearchButton() && !clickHandlerAttached) {
                attachClickHandler();
                // Once attached, we can disconnect the observer
                observer.disconnect();
            }
        });
        
        // Only observe direct children of body for added nodes (more efficient)
        observer.observe(document.body, { 
            childList: true, 
            subtree: false // Don't go deep into subtree
        });
        
        // Set timeout to stop observing after 5 seconds
        setTimeout(() => {
            observer.disconnect();
            console.log('Button observer stopped');
        }, 5000);
    }
    
    // Start initialization based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Use setTimeout to avoid blocking main thread
        setTimeout(init, 0);
    }
})();
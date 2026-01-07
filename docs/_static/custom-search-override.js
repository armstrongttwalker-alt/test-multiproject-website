// simple-search-redirect.js
// 只触发SSS搜索，不显示备用窗口
(function() {
    'use strict';
    
    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        setTimeout(() => {
            try {
                overrideSearchButton();
                overrideCtrlKShortcut();
                console.log('搜索重定向已激活：只会触发SSS搜索');
            } catch (error) {
                console.warn('搜索重定向失败:', error);
            }
        }, 500);
    }
    
    function overrideSearchButton() {
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            console.log('未找到搜索按钮');
            return;
        }
        
        // 克隆按钮移除原有事件
        const newButton = searchButton.cloneNode(true);
        searchButton.parentNode.replaceChild(newButton, searchButton);
        
        // 只绑定点击事件，不打开备用窗口
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('触发SSS搜索...');
            triggerSSSSearch();
        });
        
        newButton.setAttribute('data-sss-only', 'true');
    }
    
    function overrideCtrlKShortcut() {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Ctrl+K 触发SSS搜索');
                triggerSSSSearch();
            }
        }, true);
    }
    
    function triggerSSSSearch() {
        // 方法1: 直接模拟按/键（最可靠）
        simulateSlashKey();
        
        // 方法2: 或者跳转到搜索页面（备用）
        // window.location.href = '/search/';
    }
    
    function simulateSlashKey() {
        try {
            // 创建/键事件
            const event = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true
            });
            
            // 触发事件
            document.dispatchEvent(event);
            
            console.log('已模拟/键事件');
        } catch (error) {
            console.warn('模拟/键失败:', error);
            // 如果模拟失败，直接跳转到搜索页面
            window.location.href = '/search/';
        }
    }
})();
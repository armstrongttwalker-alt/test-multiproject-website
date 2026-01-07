// 健壮的搜索重定向脚本
(function() {
    'use strict';
    
    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchOverride);
    } else {
        initSearchOverride();
    }
    
    function initSearchOverride() {
        // 延迟执行，确保所有脚本已加载
        setTimeout(function() {
            try {
                overridePyDataSearch();
                setupKeyboardShortcuts();
                console.log('搜索重定向脚本已成功加载');
            } catch (error) {
                console.warn('搜索重定向初始化失败:', error);
                // 失败后重试一次
                setTimeout(overridePyDataSearch, 1000);
            }
        }, 500);
    }
    
    function overridePyDataSearch() {
        // 找到PyData搜索按钮
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        
        if (!searchButton) {
            console.log('未找到搜索按钮，等待重试...');
            // 可能按钮是动态加载的，稍后重试
            setTimeout(overridePyDataSearch, 500);
            return;
        }
        
        console.log('找到PyData搜索按钮，准备重定向...');
        
        // 移除所有现有的事件监听器（通过克隆并替换）
        const newButton = searchButton.cloneNode(true);
        searchButton.parentNode.replaceChild(newButton, searchButton);
        
        // 添加点击事件
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('触发Read the Docs搜索...');
            
            // 方法1: 尝试触发RTD搜索模态框
            if (triggerRTDSearchModal()) {
                return;
            }
            
            // 方法2: 如果方法1失败，使用备用方案
            console.log('使用备用搜索方案...');
            openFallbackSearch();
        });
        
        // 标记按钮已处理
        newButton.setAttribute('data-sss-enabled', 'true');
        console.log('搜索按钮重定向完成');
    }
    
    function triggerRTDSearchModal() {
        try {
            console.log('尝试模拟/键打开搜索...');
            
            // 创建并触发/键事件
            const event = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true
            });
            
            // 先聚焦到body，确保事件能被捕获
            document.activeElement.blur();
            document.body.focus();
            
            // 触发事件
            const eventDispatched = document.dispatchEvent(event);
            
            if (eventDispatched) {
                console.log('/键事件已触发');
                return true;
            }
            
            return false;
        } catch (error) {
            console.warn('触发搜索失败:', error);
            return false;
        }
    }
    
    function openFallbackSearch() {
        // 备用方案：创建一个简单的搜索输入框
        const searchOverlay = document.createElement('div');
        searchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 100px;
        `;
        
        const searchBox = document.createElement('div');
        searchBox.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        searchBox.innerHTML = `
            <h3 style="margin-top: 0;">搜索文档</h3>
            <input type="search" 
                   placeholder="输入搜索关键词..." 
                   style="width: 100%; padding: 12px; font-size: 16px; border: 2px solid #ddd; border-radius: 4px;"
                   id="fallback-search-input">
            <div style="margin-top: 10px; text-align: right;">
                <button id="fallback-search-cancel" style="padding: 8px 16px; margin-right: 10px;">取消</button>
                <button id="fallback-search-submit" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 4px;">搜索</button>
            </div>
        `;
        
        searchOverlay.appendChild(searchBox);
        document.body.appendChild(searchOverlay);
        
        // 聚焦到输入框
        const searchInput = document.getElementById('fallback-search-input');
        searchInput.focus();
        
        // 处理取消按钮
        document.getElementById('fallback-search-cancel').addEventListener('click', function() {
            document.body.removeChild(searchOverlay);
        });
        
        // 处理提交按钮
        document.getElementById('fallback-search-submit').addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = getSearchPageUrl(query);
            }
        });
        
        // 按Enter键搜索
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = getSearchPageUrl(query);
                }
            } else if (e.key === 'Escape') {
                document.body.removeChild(searchOverlay);
            }
        });
        
        // 点击背景关闭
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                document.body.removeChild(searchOverlay);
            }
        });
    }
    
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+K 快捷键
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                console.log('Ctrl+K 被捕获，触发搜索');
                
                if (!triggerRTDSearchModal()) {
                    openFallbackSearch();
                }
            }
        }, true);
    }
    
    function getSearchPageUrl(query) {
        // 获取当前页面的基本路径
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p);
        
        // 构建搜索URL
        let searchUrl = '/search/';
        if (query) {
            searchUrl += `?q=${encodeURIComponent(query)}`;
        }
        
        // 如果当前路径有语言/版本前缀，保留它
        if (pathParts.length > 0 && pathParts[0] !== 'search') {
            searchUrl = `/${pathParts[0]}${searchUrl}`;
        }
        
        return searchUrl;
    }
    
    // 添加一些样式
    const style = document.createElement('style');
    style.textContent = `
        .search-button-field[data-sss-enabled="true"] {
            position: relative;
        }
        
        .search-button-field[data-sss-enabled="true"]:hover {
            cursor: pointer;
            transform: translateY(-1px);
            transition: transform 0.2s;
        }
    `;
    document.head.appendChild(style);
})();
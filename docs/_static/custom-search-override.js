// sss-ctrlk-fix.js
// 专门修复Ctrl+K快捷键，确保它触发SSS搜索
(function() {
    'use strict';
    
    console.log('SSS Ctrl+K 修复脚本加载...');
    
    // ========== 第一部分：立即执行的Ctrl+K捕获 ==========
    // 这段代码会立即执行，不等待DOM加载
    
    // 1. 在捕获阶段监听keydown事件（最高优先级）
    window.addEventListener('keydown', function(e) {
        // 检查是否为Ctrl+K或Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            console.log('🚨 Ctrl+K 被捕获（捕获阶段）');
            
            // 阻止所有后续事件处理
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // 立即触发SSS搜索
            triggerSSSSearchImmediately();
            
            // 阻止默认行为
            return false;
        }
    }, true); // true 表示在捕获阶段监听
    
    // 2. 在window对象上再添加一层保护（确保覆盖其他监听器）
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        // 如果其他人试图添加keydown监听器，我们可以检测并确保我们的优先级更高
        if (type === 'keydown') {
            console.log('有人尝试添加keydown监听器，已记录');
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // 3. 直接覆盖document的keydown事件处理
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            console.log('📌 Ctrl+K 被捕获（document层）');
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
    
    function triggerSSSSearchImmediately() {
        console.log('立即触发SSS搜索...');
        
        // 方法1: 模拟按/键（最可靠）
        try {
            const slashEvent = new KeyboardEvent('keydown', {
                key: '/',
                keyCode: 191,
                code: 'Slash',
                which: 191,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            
            // 延迟一点点，确保Ctrl+K事件完全被阻止
            setTimeout(() => {
                document.dispatchEvent(slashEvent);
                console.log('✅ 已发送/键事件');
            }, 10);
        } catch (error) {
            console.warn('模拟/键失败:', error);
        }
        
        // 方法2: 如果方法1失败，使用备用方案
        setTimeout(() => {
            // 检查SSS搜索框是否出现
            const sssSearch = document.querySelector('.search-container, [aria-label="Search"]');
            if (!sssSearch || sssSearch.style.display === 'none') {
                console.log('SSS搜索未激活，尝试备用方法...');
                openSSSSearchDirectly();
            }
        }, 100);
    }
    
    function openSSSSearchDirectly() {
        // 尝试找到并点击RTD的搜索按钮（如果有的话）
        const rtdSearchButtons = document.querySelectorAll('button, [role="button"]');
        rtdSearchButtons.forEach(btn => {
            const text = btn.textContent || btn.innerText || '';
            if (text.includes('Search') || text.includes('搜索')) {
                console.log('找到可能的搜索按钮:', btn);
                btn.click();
            }
        });
        
        // 如果还是不行，聚焦到搜索输入框（如果可见）
        const searchInputs = document.querySelectorAll('input[type="search"]');
        searchInputs.forEach(input => {
            if (input.offsetParent !== null) { // 检查是否可见
                input.focus();
                console.log('已聚焦到搜索输入框');
            }
        });
    }
    
    // ========== 第二部分：DOM加载后的优化 ==========
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('DOM已加载，优化搜索功能...');
        
        // 1. 修复搜索按钮（如果还没修复）
        fixSearchButton();
        
        // 2. 添加视觉提示
        addVisualFeedback();
        
        // 3. 监控Ctrl+K的使用
        monitorShortcutUsage();
    }
    
    function fixSearchButton() {
        const searchButton = document.querySelector('.search-button-field.search-button__button');
        if (!searchButton) return;
        
        // 检查是否已被处理
        if (searchButton.getAttribute('data-sss-fixed')) return;
        
        // 克隆并替换
        const newButton = searchButton.cloneNode(true);
        searchButton.parentNode.replaceChild(newButton, searchButton);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('搜索按钮点击 → 触发SSS搜索');
            triggerSSSSearchImmediately();
        });
        
        newButton.setAttribute('data-sss-fixed', 'true');
        console.log('✅ 搜索按钮已修复');
    }
    
    function addVisualFeedback() {
        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
            /* 高亮显示已修复的搜索按钮 */
            .search-button-field[data-sss-fixed="true"] {
                position: relative;
                transition: all 0.2s;
            }
            
            .search-button-field[data-sss-fixed="true"]:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
            }
            
            .search-button-field[data-sss-fixed="true"]::after {
                content: " (SSS)";
                font-size: 0.7em;
                opacity: 0.7;
                position: absolute;
                right: 5px;
                bottom: 2px;
            }
            
            /* SSS搜索框激活时的样式 */
            .search-container, .search-interface {
                z-index: 10000 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    function monitorShortcutUsage() {
        // 监听所有keydown事件，调试用
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                console.group('🔍 Ctrl+K 事件追踪');
                console.log('事件阶段:', e.eventPhase);
                console.log('目标:', e.target);
                console.log('当前目标:', e.currentTarget);
                console.log('时间戳:', e.timeStamp);
                console.groupEnd();
            }
        }, true);
        
        // 记录快捷键使用
        console.log('🔧 快捷键监控已启用');
        console.log('按Ctrl+K应该会打开SSS搜索框');
    }
    
    // ========== 第三部分：暴力覆盖（备用方案） ==========
    
    // 如果以上方法都不行，使用更激进的方法
    setTimeout(() => {
        // 查找并禁用所有可能的Ctrl+K处理
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            try {
                // 获取元素的所有事件监听器（需要通过开发者工具，这里只是概念）
                // 实际上我们无法直接获取，但可以尝试覆盖
                el.onkeydown = null;
                el.onkeypress = null;
                el.onkeyup = null;
            } catch (e) {
                // 忽略错误
            }
        });
        
        // 重新绑定我们的处理
        document.onkeydown = function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                triggerSSSSearchImmediately();
                return false;
            }
        };
    }, 1000); // 延迟1秒执行
})();
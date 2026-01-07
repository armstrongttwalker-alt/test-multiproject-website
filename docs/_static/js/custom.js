// _static/js/pydata-sss-integration.js
// 专用于将 PyData 主题的搜索按钮重定向到 Read the Docs SSS

(function() {
    'use strict';

    // 等待 RTD 环境就绪
    document.addEventListener('readthedocs-addons-data-ready', function() {
        // 检查 SSS 是否应被启用
        if (typeof READTHEDOCS_DATA !== 'undefined' && READTHEDOCS_DATA.features.use_sphinx_search) {

            // 核心函数：触发 SSS 搜索
            function triggerRTDSSS() {
                // 方法1: 如果 RTD 全局对象存在，调用其 API
                if (typeof window.ReadTheDocsSearch !== 'undefined') {
                    window.ReadTheDocsSearch.openSearch('');
                    return;
                }

                // 方法2: 模拟按下 '/' 键（SSS 的全局快捷键）
                // 这是最可靠的后备方案
                const slashKeyEvent = new KeyboardEvent('keydown', {
                    key: '/',
                    code: 'Slash',
                    keyCode: 191,
                    which: 191,
                    bubbles: true
                });
                document.dispatchEvent(slashKeyEvent);
            }

            // 找到并重写 PyData 搜索按钮的行为
            function overridePyDataSearchButton() {
                // 选择器需要匹配你提供的按钮结构
                const searchButtons = document.querySelectorAll('button.btn.search-button-field.search-button__button');

                if (searchButtons.length === 0) {
                    console.warn('[RTD SSS] 未找到 PyData 搜索按钮，重定向失败。');
                    return;
                }

                searchButtons.forEach(function(button) {
                    // 移除所有现有的事件监听器（避免冲突）
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);

                    // 为新按钮添加我们自己的点击处理
                    newButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation(); // 阻止事件冒泡
                        event.stopImmediatePropagation(); // 阻止其他监听器

                        console.log('[RTD SSS] 已拦截 PyData 搜索按钮点击，转向服务器端搜索。');
                        triggerRTDSSS();
                        return false;
                    });

                    // 可选：更新按钮的 tooltip 提示，告知用户现在使用 SSS
                    if (newButton.getAttribute('data-bs-original-title')) {
                        newButton.setAttribute('data-bs-original-title', 'Search (Powered by Read the Docs)');
                    }
                    if (newButton.getAttribute('title')) {
                        newButton.setAttribute('title', 'Search (Powered by Read the Docs)');
                    }
                });
            }

            // 同时监听 Ctrl+K / Cmd+K 快捷键，保持体验一致
            document.addEventListener('keydown', function(event) {
                if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                    event.preventDefault(); // 阻止浏览器默认搜索
                    triggerRTDSSS();
                }
            });

            // 页面加载完成后执行重写
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', overridePyDataSearchButton);
            } else {
                overridePyDataSearchButton();
            }

            console.log('[RTD SSS] PyData 主题搜索重定向脚本已加载。');
        }
    });

})();
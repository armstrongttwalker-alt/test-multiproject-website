// custom-search-override.js
// 专门针对PyData Theme搜索按钮的SSS重定向

document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行以确保所有元素已加载
    setTimeout(overridePyDataSearch, 300);
});

function overridePyDataSearch() {
    // 1. 找到PyData Theme的搜索按钮（根据你提供的HTML）
    const searchButton = document.querySelector('.search-button-field.search-button__button');
    
    if (!searchButton) {
        console.warn('未找到PyData搜索按钮，尝试其他选择器...');
        // 尝试其他可能的选择器
        const alternativeButtons = [
            '.search-button',
            '[aria-label="Search"]',
            '.btn[aria-label="Search"]',
            'button[data-bs-original-title="Search"]'
        ];
        
        for (const selector of alternativeButtons) {
            const btn = document.querySelector(selector);
            if (btn) {
                attachSSSBehavior(btn);
                return;
            }
        }
        console.error('无法找到PyData搜索按钮');
        return;
    }
    
    attachSSSBehavior(searchButton);
    
    // 2. 也查找搜索输入框（如果有的话）
    const searchInputs = document.querySelectorAll('input[type="search"], input.search-field');
    searchInputs.forEach(input => {
        overrideSearchInput(input);
    });
}

function attachSSSBehavior(button) {
    console.log('找到PyData搜索按钮，正在附加SSS行为...', button);
    
    // 移除所有现有的事件监听器（通过克隆元素）
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // 添加点击事件 - 触发SSS搜索
    newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('搜索按钮被点击，触发SSS搜索');
        
        // 方法A: 尝试触发Read the Docs的搜索模态框（像按/键一样）
        if (!triggerRTDSearchModal()) {
            // 方法B: 如果方法A失败，跳转到搜索页面
            window.location.href = getSearchPageUrl();
        }
    });
    
    // 更新工具提示（可选）
    if (newButton.getAttribute('data-bs-original-title')) {
        newButton.setAttribute('data-bs-original-title', 'Search (Read the Docs SSS)');
    }
    
    // 添加强制使用SSS的标识
    newButton.setAttribute('data-sss-enabled', 'true');
    
    console.log('PyData搜索按钮已成功重定向到SSS');
}

function overrideSearchInput(input) {
    // 克隆并替换输入框以移除原有事件监听器
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    // 阻止默认表单提交
    const searchForm = newInput.closest('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = newInput.value.trim();
            if (query) {
                window.location.href = getSearchPageUrl(query);
            }
        });
    }
    
    // 监听Ctrl+K快捷键
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Ctrl+K被按下，触发SSS搜索');
            
            // 聚焦到输入框
            newInput.focus();
            
            // 如果有查询词，跳转到搜索页面
            const query = newInput.value.trim();
            if (query) {
                window.location.href = getSearchPageUrl(query);
            } else if (!triggerRTDSearchModal()) {
                // 否则尝试打开SSS搜索模态框
                window.location.href = getSearchPageUrl();
            }
        }
    });
}

function triggerRTDSearchModal() {
    console.log('尝试触发Read the Docs搜索模态框...');
    
    // 方法1: 模拟按/键（Read the Docs的标准搜索快捷键）
    try {
        const slashEvent = new KeyboardEvent('keydown', {
            key: '/',
            keyCode: 191,
            which: 191,
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(slashEvent);
        console.log('已触发/键事件');
        
        // 检查是否有搜索模态框出现
        setTimeout(() => {
            const searchModal = document.querySelector('.search-container, .search-interface, #search-modal');
            if (searchModal && searchModal.style.display !== 'none') {
                console.log('SSS搜索模态框已打开');
                return true;
            }
            return false;
        }, 100);
        
        return true;
    } catch (error) {
        console.log('无法通过模拟/键触发搜索:', error);
        return false;
    }
}

function getSearchPageUrl(query = '') {
    // 获取基础路径
    const basePath = window.location.pathname;
    
    // 移除可能的语言/版本前缀
    const pathParts = basePath.split('/').filter(p => p);
    
    // 构建搜索URL - Read the Docs的标准搜索页面
    let searchUrl = '/search.html';
    if (query) {
        searchUrl += `?q=${encodeURIComponent(query)}`;
    }
    
    // 如果需要保持语言/版本上下文
    if (pathParts.length > 0 && !pathParts.includes('search.html')) {
        // 假设第一个部分是项目名或语言
        searchUrl = `/${pathParts[0]}/search.html`;
        if (query) {
            searchUrl += `?q=${encodeURIComponent(query)}`;
        }
    }
    
    console.log('搜索URL:', searchUrl);
    return searchUrl;
}

// 添加样式增强（可选）
function addSearchEnhancements() {
    const style = document.createElement('style');
    style.textContent = `
        .search-button-field[data-sss-enabled="true"] {
            background-color: #2980b9 !important;
            border-color: #2980b9 !important;
        }
        
        .search-button-field[data-sss-enabled="true"]:hover {
            background-color: #1c5d87 !important;
            border-color: #1c5d87 !important;
        }
        
        .search-button-field[data-sss-enabled="true"]::after {
            content: " (SSS)";
            font-size: 0.8em;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// 初始化增强
addSearchEnhancements();
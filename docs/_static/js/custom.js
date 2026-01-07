// _static/js/custom.js
// 此脚本用于将 PyData 主题的搜索框重定向到 Read the Docs 的服务器端搜索 (SSS)

document.addEventListener('readthedocs-addons-data-ready', function () {
  // 确保 RTD 的 SSS 功能已加载
  if (typeof READTHEDOCS_DATA !== 'undefined' && READTHEDOCS_DATA.features.use_sphinx_search) {
    // 等待 DOM 完全就绪
    $(document).ready(function () {
      // 找到 PyData 主题的搜索输入框（选择器可能需要根据主题版本微调）
      var pydataSearchInput = document.querySelector('input[type="search"][name="q"]');
      
      if (pydataSearchInput) {
        // 1. 阻止原生的表单提交（即阻止客户端搜索）
        var searchForm = pydataSearchInput.closest('form');
        if (searchForm) {
          searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            triggerSSSSearch(pydataSearchInput.value);
          });
        }
        
        // 2. 监听搜索框的回车键
        pydataSearchInput.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            triggerSSSSearch(this.value);
          }
        });
        
        // 3. 可选：监听搜索按钮的点击事件（如果有的话）
        var searchButton = document.querySelector('button[type="submit"][aria-label="Search"]');
        if (searchButton) {
          searchButton.addEventListener('click', function (event) {
            event.preventDefault();
            triggerSSSSearch(pydataSearchInput.value);
          });
        }
        
        console.log('[RTD SSS] PyData 搜索框已成功重定向至服务器端搜索。');
      }
    });
  }
});

/**
 * 触发 RTD SSS 搜索
 * @param {string} query - 搜索关键词
 */
function triggerSSSSearch(query) {
  if (query && query.trim() !== '') {
    // 调用 RTD SSS 的全局搜索函数
    if (typeof window.ReadTheDocsSearch !== 'undefined') {
      window.ReadTheDocsSearch.openSearch(query.trim());
    } else {
      // 备用方案：手动打开 SSS 搜索框并填入关键词
      var sssInput = document.querySelector('#rtd-search-form input[name="q"]');
      if (sssInput) {
        sssInput.value = query.trim();
        sssInput.focus();
        // 触发输入事件，可能促使实时搜索开始
        sssInput.dispatchEvent(new Event('input'));
      } else {
        // 如果找不到 SSS 输入框，回退到使用快捷键模拟
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': '/'}));
        setTimeout(function() {
          var sssInputAlt = document.querySelector('#rtd-search-form input[name="q"]');
          if (sssInputAlt) {
            sssInputAlt.value = query.trim();
            sssInputAlt.dispatchEvent(new Event('input'));
          }
        }, 100);
      }
    }
  }
}
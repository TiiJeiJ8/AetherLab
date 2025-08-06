#!/usr/bin/env python3
"""
批量修复CSS冲突脚本
为每个instruction模块的CSS添加作用域前缀
"""

import os
import re
from pathlib import Path

# CSS文件映射和对应的前缀
CSS_MODULES = {
    'QuickStart_instruction.css': 'quick-start',
    'DataVisualization_instruction.css': 'data-visualization', 
    'DataPreprocessing_instruction.css': 'data-preprocessing',
    'MathematicalModeling_instruction.css': 'mathematical-modeling',
    'DeveloperGuide_instruction.css': 'developer-guide'
}

# 需要添加前缀的通用CSS类名
COMMON_CLASSES = [
    'content-section',
    'feature-card', 
    'feature-icon',
    'feature-grid',
    'feature-item',
    'section-description',
    'notice-card',
    'center-content',
    'content-card',
    'features-list',
    'steps-container',
    'step-item',
    'step-number',
    'step-content',
    'code-example'
]

def add_scope_prefix(css_content, prefix):
    """为CSS内容添加作用域前缀"""
    
    # 处理每个通用类名
    for class_name in COMMON_CLASSES:
        # 处理单独的类选择器：.class-name
        pattern = rf'\.{re.escape(class_name)}(?=\s*[{{,:])'
        replacement = f'.{prefix} .{class_name}'
        css_content = re.sub(pattern, replacement, css_content)
        
        # 处理嵌套选择器：.class-name h1, .class-name:hover 等
        pattern = rf'\.{re.escape(class_name)}([:\s]+[^{{,]*)?(?=\s*[{{,])'
        replacement = f'.{prefix} .{class_name}\\1'
        css_content = re.sub(pattern, replacement, css_content)
    
    return css_content

def update_vue_component(vue_file, class_prefix):
    """更新Vue组件添加CSS类前缀"""
    if not vue_file.exists():
        print(f"Vue文件不存在: {vue_file}")
        return
        
    content = vue_file.read_text(encoding='utf-8')
    
    # 查找根div并添加前缀类
    pattern = r'(<div class="[^"]*?)(".*?>)'
    
    def add_prefix(match):
        class_attr = match.group(1)
        rest = match.group(2)
        if class_prefix not in class_attr:
            return f'{class_attr} {class_prefix}{rest}'
        return match.group(0)
    
    updated_content = re.sub(pattern, add_prefix, content, count=1)
    
    if updated_content != content:
        vue_file.write_text(updated_content, encoding='utf-8')
        print(f"已更新Vue组件: {vue_file.name}")
    else:
        print(f"Vue组件无需更新: {vue_file.name}")

def main():
    """主函数"""
    # 设置路径
    project_root = Path(__file__).parent
    css_dir = project_root / 'frontend' / 'src' / 'assets' / 'CSS'
    vue_dir = project_root / 'frontend' / 'src' / 'components' / 'Instruction' / 'modules'
    
    print("开始处理CSS冲突修复...")
    print(f"CSS目录: {css_dir}")
    print(f"Vue目录: {vue_dir}")
    
    # 处理每个CSS文件
    for css_filename, prefix in CSS_MODULES.items():
        css_file = css_dir / css_filename
        
        if not css_file.exists():
            print(f"CSS文件不存在: {css_file}")
            continue
            
        print(f"\n处理 {css_filename} (前缀: .{prefix})")
        
        # 读取CSS内容
        try:
            css_content = css_file.read_text(encoding='utf-8')
        except Exception as e:
            print(f"读取CSS文件失败: {e}")
            continue
            
        # 添加作用域前缀
        updated_css = add_scope_prefix(css_content, prefix)
        
        # 如果内容有变化，则写回文件
        if updated_css != css_content:
            try:
                css_file.write_text(updated_css, encoding='utf-8')
                print(f"已更新CSS文件: {css_filename}")
            except Exception as e:
                print(f"写入CSS文件失败: {e}")
        else:
            print(f"CSS文件无需更新: {css_filename}")
        
        # 更新对应的Vue组件
        vue_filename = css_filename.replace('_instruction.css', '.vue')
        vue_file = vue_dir / vue_filename
        update_vue_component(vue_file, prefix)
    
    print("\n修复完成！")
    print("\n注意事项:")
    print("1. 请检查修复后的文件是否正确")
    print("2. 建议先在开发环境中测试")
    print("3. 如有问题可以使用git回滚")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
修复重复前缀问题
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

def fix_duplicate_prefixes(css_content, prefix):
    """修复重复前缀问题"""
    # 修复 .prefix .prefix .class 这种重复情况
    pattern = rf'\.{re.escape(prefix)}\s+\.{re.escape(prefix)}\s+'
    replacement = f'.{prefix} '
    
    while re.search(pattern, css_content):
        css_content = re.sub(pattern, replacement, css_content)
    
    return css_content

def main():
    """主函数"""
    # 设置路径
    project_root = Path(__file__).parent
    css_dir = project_root / 'frontend' / 'src' / 'assets' / 'CSS'
    
    print("开始修复重复前缀问题...")
    
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
            
        # 修复重复前缀
        updated_css = fix_duplicate_prefixes(css_content, prefix)
        
        # 如果内容有变化，则写回文件
        if updated_css != css_content:
            try:
                css_file.write_text(updated_css, encoding='utf-8')
                print(f"已修复重复前缀: {css_filename}")
            except Exception as e:
                print(f"写入CSS文件失败: {e}")
        else:
            print(f"无重复前缀问题: {css_filename}")
    
    print("\n修复完成！")

if __name__ == '__main__':
    main()

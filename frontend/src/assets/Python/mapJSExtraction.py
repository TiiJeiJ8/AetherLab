
import os
import re
import json
from pypinyin import lazy_pinyin

# 需要扫描的所有目录
MAP_DIRS = [
    r'd:\Learning Material\Git\AetherLab\frontend\public\maps\chinaCities',
    r'd:\Learning Material\Git\AetherLab\frontend\public\maps\worldCountries'
]
OUTPUT_PATH = r'd:\Learning Material\Git\AetherLab\frontend\src\assets\JS\utils\mapMatchDispatcher.js'

register_map_pattern = re.compile(r'registerMap\(\s*["\']([^"\']+)["\']')

mapping = {}
unmatched_files = []

for map_dir in MAP_DIRS:
    is_china = 'chinaCities' in map_dir  # 判断是否国内城市目录
    source = 'chinaCities' if is_china else 'worldCountries'
    for filename in os.listdir(map_dir):
        if filename.endswith('.js'):
            filepath = os.path.join(map_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read(4096)
                match = register_map_pattern.search(content)
                if match:
                    city_cn = match.group(1)
                    mapping[city_cn] = {"file": filename, "source": source, 'origin': city_cn}
                    # 国内城市自动生成拼音英文主键
                    if is_china:
                        pinyin_key = ''.join([w.capitalize() for w in lazy_pinyin(city_cn)])
                        mapping[pinyin_key.upper()] = {"file": filename, "source": source, 'origin': city_cn}
                    else:
                        # 国外直接用文件名去掉.js作为英文主键
                        en_key = filename[:-3]
                        mapping[en_key.upper()] = {"file": filename, "source": source, 'origin': city_cn}
                else:
                    unmatched_files.append(filename)

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    f.write('export default ')
    json.dump(mapping, f, ensure_ascii=False, indent=2)
    f.write(';')

total_js_count = sum([len([f for f in os.listdir(d) if f.endswith('.js')]) for d in MAP_DIRS])
print('The mapping table has been generated with--', len(mapping), '--entries.')
print('Total js file count:', total_js_count)
print('Unmatched js files:', len(unmatched_files))
if unmatched_files:
    print('Files not matched:')
    for fname in unmatched_files:
        print('  ', fname)
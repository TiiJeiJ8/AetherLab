import dash
from dash import dcc, html, Input, Output, State, callback, no_update
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import base64
import io
import json
from datetime import datetime 
import numpy as np
import traceback # Import traceback for better error logging
import re
from sklearn.preprocessing import MinMaxScaler

# Help convert coordinate string to decimal degrees format
def convert_coordinate(coord_str):
    """Convert coordinate string to decimal degrees format
    
    Args:
        coord_str (str): Coordinate string in one of these formats:
            - DMS format: "39°54'22.5\"N" or "39 54 22.5N" or "39°54′22.5″N"
            - Decimal format: "39.90625°" or "-116.40717" or "39.90469°N"
    
    Returns:
        float: Decimal degrees value (negative for S/W)
    
    Raises:
        TypeError: If input is not a string
        ValueError: For empty string or invalid format
    
    Examples:
        >>> convert_coordinate("39°54'22.5\"N")  # DMS format
        39.90625
        >>> convert_coordinate("116 23 50E")     # Space-separated
        116.397222
        >>> convert_coordinate("39.90469°N")     # Decimal with direction
        39.90469
        >>> convert_coordinate("-116.40717")     # Pure decimal
        -116.40717
    """
    if not isinstance(coord_str, str):
        raise TypeError("Coordinate must be a string")
    
    coord_str = coord_str.strip().upper()
    if not coord_str:
        raise ValueError("Empty coordinate string")
    
    # Pattern 1: Decimal degrees with optional direction (e.g. "39.90625°" or "-116.40717" or "39.90469°N")
    decimal_pattern = r'^([-+]?\d*\.?\d+)°?([NSWE]?)$'
    if match := re.match(decimal_pattern, coord_str):
        value = float(match.group(1))
        direction = match.group(2)
        return -value if direction in ('S', 'W') else value
    
    # Pattern 2: DMS format with various symbols (e.g. "39°54'22.5\"N" or "39 54 22.5N")
    dms_pattern = r'^(\d+)[°\s](\d+)[′\'’\s](\d*\.?\d*)[″\"\s]?([NSWE]?)$'
    if match := re.match(dms_pattern, coord_str):
        degrees = float(match.group(1))
        minutes = float(match.group(2))
        seconds = float(match.group(3)) if match.group(3) else 0.0
        direction = match.group(4)
        
        # Validate ranges
        if not (0 <= minutes < 60) or not (0 <= seconds < 60):
            raise ValueError("Minutes and seconds must be between 0-60")
        
        decimal = degrees + minutes/60 + seconds/3600
        return -decimal if direction in ('S', 'W') else decimal
    
    # Pattern 3: Pure decimal number (e.g. "39.90469")
    try:
        return float(coord_str)
    except ValueError:
        pass
    
    raise ValueError(
        f"Invalid coordinate format: '{coord_str}'\n"
        "Supported formats examples:\n"
        "- DMS: 39°54'22.5\"N or 39 54 22.5N\n"
        "- Decimal: 39.90625° or -116.40717\n"
        "- Decimal with direction: 39.90469°N"
    )

# Help convert data to sunburst format
def convert_to_sunburst_data(df, hierarchy_columns, value_column):
    """
    将层级化DataFrame转换为旭日图所需格式
    :param df: 原始DataFrame
    :param hierarchy_columns: 层级列名列表（从高到低），例如 ['country', 'province', 'city']
    :param value_column: 数值列名
    :return: 包含character、parent、value的字典
    """
    nodes = {}
    result = {"character": [], "parent": [], "value": []}
    
    # 遍历每一行数据
    for _, row in df.iterrows():
        full_path = []
        parent = ""
        
        # 遍历每个层级
        for level, col in enumerate(hierarchy_columns):
            current_name = str(row[col]).strip()
            if not current_name:
                continue
            
            # 生成唯一标识（处理同名不同级的情况）
            node_id = f"{parent}>{current_name}" if parent else current_name
            
            # 如果节点不存在则创建
            if node_id not in nodes:
                nodes[node_id] = {
                    "name": current_name,
                    "parent": parent,
                    "value": row[value_column] if level == len(hierarchy_columns)-1 else 0
                }
                result["character"].append(current_name)
                result["parent"].append(parent)
                result["value"].append(nodes[node_id]["value"])
            
            # 准备下一级父节点
            parent = current_name
            full_path.append(parent)
    
    # 自动计算中间节点的值（可选）
    for level in reversed(range(len(hierarchy_columns)-1)):
        for node in nodes.values():
            if node["value"] == 0:
                children = [n["value"] for n in nodes.values() if n["parent"] == node["name"]]
                node["value"] = sum(children)
                # 更新结果中的值
                idx = result["character"].index(node["name"])
                result["value"][idx] = node["value"]
    
    return result

# --- Layout Definition ---
chart_visualizations_layout = html.Div([
    # Floating Home button top-left corner
    html.Div(
        dbc.Button(
            "Home",
            href="/",
            id="home-btn",
            className="me-1 btn-animated",
        )
    ),
    
    # Store components for holding data and intermediate states
    dcc.Store(id='data-store'), # To store the main dataframe
    dcc.Store(id='data-info-store'), # To store filename, row count etc.

    dbc.Container([
        # --- Top Header Row ---
        dbc.Row([
            dbc.Col([
                html.H1("Fuck-Charts", className="text-center mb-2 d-inline-block dynamic-gradient-text"),
                html.H6([
                        "---------- ",  # 左侧破折号保持原样
                        html.Span("Present by TiiJeiJ8", className="d-inline-block dynamic-gradient-text-sub"),  # 渐变部分
                        " ----------"   # 右侧破折号
                    ], className="text-center mb-2 text-light d-inline", style={'margin-top': 'auto'}),
            ], id='top-header-title', width=4, style={'flex-direction': 'column', 'justify-content': 'flex-end'}),
            dbc.Col([
                html.Button(
                    'Data Visualizing', id='data-visualization-button', className="btn btn-primary btn-animated", disabled=True,
                    style={
                        'margin-top': '1.1rem', 'margin-right': '1rem',
                        'background': 'linear-gradient(to right, #e84545, #53354a)',
                        'color': 'white', 'border': 'none', 'padding': '0.6rem 1.5rem', 'font-size': '16px',
                        'border-radius': '16px', 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.4)',
                        'cursor': 'pointer', 'transition': '0.3s'
                    }
                ),
                dbc.DropdownMenu(
                    [
                        dbc.DropdownMenuItem("Data Preprocessing", id="data-preprocess-btn", href='/data-preprocessing'),
                        dbc.DropdownMenuItem("Data Clustering 🚧", id="data-cluster-btn", disabled=True),
                        dbc.DropdownMenuItem("Math modeling 🚧", id="data-modeling-btn", disabled=True),
                    ],
                    label="Data Analysis",
                    id='data-analysis-button',
                    className="btn btn-animated",
                    style={'margin-top': '1.1rem', 'margin-right': '1rem'},
                    menu_variant="dark",
                    toggle_style={
                        'background': 'linear-gradient(to right, #39C5BB, #2575fc)', 'color': 'white',
                        'border': 'none', 'padding': '0.6rem 1.5rem', 'font-size': '16px',
                        'border-radius': '16px', 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.4)', 'transition': '0.3s'
                    }
                ),
                dbc.Button(
                    'Color Palette', id='color-scheme-button', href='https://coolors.co/palettes/trending', className="btn btn-primary btn-animated", disabled=False,
                    style={
                        'margin-top': '1.1rem', 'margin-right': '1rem',
                        'background': 'linear-gradient(to right, #43cea2, #185a9d)',
                        'color': 'white', 'border': 'none', 'padding': '0.6rem 1.5rem', 'font-size': '16px',
                        'border-radius': '16px', 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.4)',
                        'cursor': 'pointer', 'transition': '0.3s'
                    }
                ),
                dbc.Button(
                    'About ME', href="https://tiijeij8.github.io/", id='about-button', className="btn btn-primary btn-animated", disabled=False,
                    style={
                        'margin-top': '1.1rem', 'margin-right': '1rem',
                        'background': 'linear-gradient(to right, #ff512f, #dd2476)',
                        'color': 'white', 'border': 'none', 'padding': '0.6rem 1.5rem', 'font-size': '16px',
                        'border-radius': '16px', 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.4)',
                        'cursor': 'pointer', 'transition': '0.3s'
                    }
                ),
            ], id='top-header-buttons', style={'text-align': 'center'}),
        ],
        id = 'top-header',
        className="bg-secondary shadow-sm top-header",
        style={'height': '6rem'}),

        dbc.Row([
            dbc.Col([], width=12, style={
            'height': '128px',
            "border-radius": "20px",
            })
        ]),

        # --- Main Content Area ---
        dbc.Row([
            # --- Left Sidebar Toggle ---
            dbc.Col([
                html.Button(
                    html.I("Menu",className="fas fa-bars"), id="sidebar-toggle", className="btn btn-dark position-fixed btn-animated",
                    
                ),
                dbc.Offcanvas(
                    id="sidebar", is_open=False,
                    children=[
                        dbc.Card([
                            dbc.CardHeader(html.H4("Data Upload", className="text-info")),
                            dbc.CardBody([
                                dcc.Upload(
                                    id='upload-data',
                                    children=html.Div(['Drag or ', html.A('Select', className="text-primary")]),
                                    style={'width': '100%', 
                                           'height': '60px', 
                                           'lineHeight': '60px', 
                                           'borderWidth': '1px',
                                           'borderStyle': 'dashed', 
                                           'borderRadius': '5px', 
                                           'textAlign': 'center', 
                                           'margin': '10px 0', 
                                           'userSelect': 'none',
                                           '-moz-user-select': 'none', 
                                           'cursor': 'pointer'
                                    },
                                    multiple=False
                                ),
                                html.Div(id='upload-status', className="mt-2"),
                            ]),
                            dbc.Tooltip('Upload your data file in CSV, Excel or JSON format', target='upload-data'),
                        ], className="mb-4 shadow"),
                        dbc.Card([
                            dbc.CardHeader(html.H4("Sampling", className="text-info")),
                            dbc.CardBody([
                                html.Div(id='sampling-controls', children=[
                                    dbc.Switch(id="sample-data-switch", label="Enable Sampling", value=False, className="mb-1 mt-2"),
                                    dbc.Tooltip("When the data is large, it is recommended to turn on the sampling function to improve the performance. The program will randomly select a few rows to draw the chart.", target="sample-data-switch"),
                                    dbc.Tooltip("When the scale of data is large, it is recommended to turn on the sampling function to improve the performance. The program will randomly select a few rows to draw the chart.", target="sample-data-switch"),
                                ], style={'display': 'none'})
                            ])
                        ], className="mb-4 shadow", style={'display': 'none'}),
                        dbc.Card([
                            dbc.CardHeader(html.H4("Charts Type", className="text-info")),
                            dbc.CardBody([
                                dcc.Dropdown(
                                    id='chart-type',
                                    options=[{'label': 'Line Chart', 'value': 'line'}, 
                                             {'label': 'Bar Chart', 'value': 'bar'},
                                             {'label': 'Scatter Chart', 'value': 'scatter'}, 
                                             {'label': 'Pie Chart', 'value': 'pie'},
                                             {'label': 'HeatMap Chart', 'value': 'heatmap'}, 
                                             {'label': 'Area Chart', 'value': 'area'},
                                             {'label': 'Radar Chart', 'value': 'radar'},
                                             {'label': 'Sunburst Chart', 'value': 'sunburst'},
                                             {'label': 'Box Plot Chart', 'value': 'box'},
                                             {'label': 'Violin Chart', 'value': 'violin'}, 
                                             {'label': 'TreeMap Chart', 'value': 'treemap'},
                                             {'label': 'Scatter Map Chart', 'value': 'scatter_map'},
                                             {'label': 'Heatmap Map Chart', 'value': 'heatmap_map'},
                                             ],
                                    value='line', clearable=False, className="mb-3"
                                ),
                                dbc.Alert(
                                    "Tip: Choose the chart type that best fits your data visualization needs. ",
                                    color="success",
                                    dismissable=False,
                                    className="small p-2"
                                )
                            ])
                        ], className="mb-4 shadow"),
                        dbc.Card([
                            dbc.CardHeader(html.H4("Data Selection", className="text-info")),
                            dbc.CardBody([
                                html.Div(children=[
                                    html.Div([html.Label("X axis / Paths (TreeMap)", className="text-secondary"),
                                          dcc.Dropdown(id='x-axis', className="mb-3", placeholder="Select column...")], id='x-axis-div'),
                                    html.Div([html.Label("Y axis / Labels", className="text-secondary"),
                                            dcc.Dropdown(id='y-axis', className="mb-3", multi=True, placeholder="Select one or more columns...")], id='y-axis-div'),
                                    html.Div(id='pie-options', style={'display': 'none'}, children=[
                                        html.Label("Value Column (Pie/TreeMap)", className="text-secondary"),
                                        dcc.Dropdown(id='pie-values', className="mb-3", placeholder="Select value column..."),
                                        html.Label("Name Column (Pie)", className="text-secondary"),
                                        dcc.Dropdown(id='pie-names', className="mb-3", placeholder="Select name column..."),
                                        dbc.Tooltip("Pie chart is optional, rectangular tree chart is not supported", target="pie-names"),
                                    ]),
                                    html.Div(id='heatmap-options', style={'display': 'none'}, children=[
                                        html.Label("Z axis (Heatmap)", className="text-secondary"),
                                        dcc.Dropdown(id='z-axis', className="mb-3", placeholder="Select z column...")
                                    ]),
                                    html.Div(id='radar-options', style={'display': 'none'}, children=[
                                        html.Label('Category Column (Radar)', className="text-secondary"),
                                        dcc.Dropdown(id='radar-category', className="mb-3", placeholder="Select category column..."),
                                        html.Label('Value Column (Radar)', className="text-secondary"),
                                        dcc.Dropdown(id='radar-values', className="mb-3", multi=True, placeholder="Select value column..."),
                                        # 开关
                                        html.Label('Normalization', className="text-secondary"),
                                        dbc.Switch(id='radar-normalize', value=False, className="mb-3"),
                                        dbc.Tooltip("After activation, the data will be normalized to facilitate comparison of data with different dimensions.", target="radar-normalize"),
                                    ]),
                                    html.Div(
                                        id='sunburst-options',
                                        style={'display': 'none'},
                                        children=[
                                            html.Label("Hierarchical Path Column (Multiple Choice)", className="text-secondary"),
                                            dcc.Dropdown(
                                                id='sunburst-path',
                                                multi=True,
                                                placeholder="Select hierarchical columns in order",
                                                className="mb-2"
                                            ),
                                            html.Label("Value column", className="text-secondary"),
                                            dcc.Dropdown(
                                                id='sunburst-value',
                                                placeholder="Select value column...",
                                                className="mb-3"
                                            ),
                                            dbc.Alert(
                                                "Tips: Hierarchical columns need to be selected in order from root to leaf (e.g. country → province → city)",
                                                color="info",
                                                dismissable=True,
                                                className="small p-2"
                                            )
                                        ]
                                    ),
                                ]),
                                html.Div(id='color-column-div', children=[
                                        html.Label("Group by color", id='color-column-title', className="text-secondary"),
                                        dcc.Dropdown(id='color-column', className="mb-3", placeholder="(Optional)")
                                    ]),
                                html.Div(id='size-column-div', children=[
                                        html.Label("Group by value", id='size-column-title', className="text-secondary"),
                                        dcc.Dropdown(id='size-column', className="mb-3", placeholder="(Optional)")
                                ]),
                                html.Div(id='Formap', style={'display': 'none'}, children=[
                                    html.Div([html.Label("Longitude and Latitude Columns", className="text-secondary"),
                                          dcc.Dropdown(id='longitude-column', className="mb-3", placeholder="Select longitude column"),
                                          dcc.Dropdown(id='latitude-column', className="mb-3", placeholder="Select latitude column")]),
                                    html.Div([html.Label("Region column (province, city, county)", className="text-secondary"),
                                            dbc.Tooltip("Independently selected from the latitude and longitude columns, automatically recognize the names of provinces, cities, and districts and convert them into latitude and longitude coordinates for drawing", target="province-column"),
                                            dcc.Dropdown(id='province-column', className="mb-3", placeholder="Select region column")
                                    ]),
                                    html.Div([html.Label("Map themes", className="text-secondary"),
                                            # 添加提示信息
                                            dbc.Tooltip("Choose a map theme, loading map tiles may require 🪜", target="map-theme"),
                                            dcc.Dropdown(
                                                id='map-theme',
                                                options=[
                                                    {'label': 'Default', 'value': 'carto-positron'},
                                                    {'label': 'Open Street Map', 'value': 'open-street-map'},
                                                    {'label': 'Stamen Terrain', 'value': 'stamen-terrain'},
                                                    {'label': 'Dark', 'value': 'carto-darkmatter'},
                                                    {'label': 'Black & White', 'value': 'stamen-toner'},
                                                ],
                                                value='carto-positron',
                                            ),
                                            dbc.Input(
                                                id='mapbox-api-key',
                                                type='password',
                                                placeholder='Input Mapbox API key(Optional)',
                                                className="mt-2",
                                                value=' ',
                                                style={'display': 'none'}
                                            ),
                                            dbc.Tooltip(
                                                "To use Mapbox online map style, please enter your Mapbox API key here",
                                                target="mapbox-api-key",
                                            ),
                                    ]),
                                    html.Div([html.Label("Zoom level", className='text-secondary'),
                                            dcc.Slider(id='map-zoom', min=1, max=15, marks={1: str(i) for i in range(1, 16)}, value=5),
                                            ], style={'display': 'none'}),
                                ]),
                                html.Div(id='heatmap-map-style', style={'display': 'none'}, children=[
                                    html.Hr(),
                                    dbc.Row([
                                        dbc.Label("Heatmap Map Style", width=3, style={'display': 'none'}),
                                        dbc.Col(
                                            dcc.Dropdown(
                                                id='heatmap-type',
                                                options=[
                                                    {'label': 'Density Heatmap', 'value': 'density'},
                                                    {'label': 'Regional heat map', 'value': 'region'}
                                                ],
                                                value='density', style={'display': 'none'}, className="mb-3"
                                            ),
                                            width=9
                                        )
                                        ], className="mb-3"),
                                    dbc.Row([
                                        # 区域热力图数值列选择
                                        html.Div(id='heatmap-value-select', style={'display': 'none'}, children=[
                                            html.Label("Heatmap Value Column", className="text-secondary"),
                                            dcc.Dropdown(id='heatmap-value-col', options=[], placeholder='Select value column', className="mb-3"),
                                        ]),
                                        dbc.Label("Thermal radius", width=3),
                                        dbc.Col(
                                            dcc.Slider(
                                                id='heatmap-radius',
                                                min=1,
                                                max=50,
                                                step=1,
                                                value=10,
                                                marks={i: str(i) for i in range(0, 51, 10)}
                                            ),
                                            width=9
                                        )
                                    ], className="mb-3"),
                                    html.Hr(),
                                ]),

                                # 添加比例选择控件
                                html.Div([
                                    html.Label("Chart Aspect Ratio", className="text-secondary"),
                                    dcc.Dropdown(
                                        id='aspect-ratio-select',
                                        options=[
                                            {'label': '16:9', 'value': '16:9'},
                                            {'label': '4:3', 'value': '4:3'},
                                            {'label': '1:1', 'value': '1:1'},
                                            {'label': 'Custom', 'value': 'custom'}
                                        ],
                                        value='16:9',
                                        clearable=False,
                                        className="mb-3"
                                    ),
                                    html.Div(id='custom-ratio-inputs', style={'display': 'none'}, children=[
                                        dbc.Row([
                                            dbc.Col([
                                                dbc.Label("Width(rem)", className="text-secondary"),
                                                dbc.Input(id='width-input', type='number', min=1, value=100, 
                                                         step=1, className="mb-2")
                                            ], width=6),
                                            dbc.Col([
                                                dbc.Label("Height(rem)", className="text-secondary"),
                                                dbc.Input(id='height-input', type='number', min=1, value=56.25,
                                                         step=1, className="mb-2")
                                            ], width=6)
                                        ]),
                                        dbc.Alert("After entering the values, the chart will automatically update (note that excessive values may cause the chart to overflow the screen)", color="info", className="mt-2", 
                                                 style={'display': 'none'}, id='ratio-alert')
                                    ])
                                ])
                            ])
                        ], className="mb-4 shadow"),
                        dbc.Card([
                            dbc.CardHeader(html.H4("Rendering Options", className="text-info")),
                            dbc.CardBody([
                                dbc.Switch(id="real-time-render-switch", label="Real-time rendering", value=True, className="mb-3"),
                                dbc.Button("Manually rendering", id="start-render-button", color="primary", className="w-100", style={"display": "none"}),
                            ])
                        ], className="mb-4 shadow")
                    ],
                    placement="start",
                    style={"width": "clamp(280px, 22%, 350px)", "height": "calc(100vh - 140px)", "top": "90px",
                           "border-radius": "15px", "margin-left": "5px", "box-shadow": "2px 0px 5px rgba(0,0,0,0.1)",
                           "overflow-y": "auto"}
                )
            ], width="auto"),
            # --- Main Chart and Customization Area ---
            dbc.Col([
                dbc.Card([
                    dbc.CardHeader(html.H4("📊 Chart", className="text-info")),
                    dbc.CardBody([
                        dcc.Loading(id="loading-graph", type="circle", children=dcc.Graph(
                            id='visualization-graph', figure={}, style={'height': '55rem', 'width': '100%'},
                            config={'displayModeBar': True, 'toImageButtonOptions': {'format': 'png', 'filename': 'data_visualization', 'scale': 2}}
                        ))
                    ])
                ], className="mb-4 shadow"),
                dbc.Card([
                    dbc.CardHeader(html.H4("⚙️ Chart Customization", className="text-info")),
                    dbc.CardBody([
                        dbc.Row([
                            dbc.Col([
                                html.Label("Chart title", className="text-secondary"),
                                dbc.Input(id='chart-title', type='text', placeholder='Enter chart title (optional)', className="mb-3"),
                                
                                # 背景颜色选择器
                                dbc.Row([
                                    dbc.Col([
                                        html.Label("Chart BG color", className="text-secondary"),
                                        dbc.Select(
                                            id='bg-color-select',
                                            options=[
                                                {'label': 'Default', 'value': 'default'},
                                                {'label': 'Dark', 'value': '#2b2e4a'},
                                                {'label': 'Gray', 'value': '#b8b0b0'},
                                                {'label': 'Warm', 'value': '#ffe6d0'},
                                                {'label': 'Custom', 'value': 'custom'}
                                            ],
                                            value='default',
                                            className="mb-3"
                                        )
                                    ]),
                                    dbc.Col([
                                        html.Label("", className="text-secondary"),
                                        dbc.Input(
                                            id='custom-bg-color',
                                            type='text',
                                            placeholder='eg.#f8f9fa',
                                            style={'display': 'none'},
                                            className="mb-3"
                                        )
                                    ])
                                ]),
                                html.Div(id='x-y-grid-options', children=[
                                    html.Label("X axis label", className="text-secondary"),
                                    dbc.Input(id='x-axis-title', type='text', placeholder='X axis label (leave blank for auto)', className="mb-3"),
                                    html.Label("Y axis label", className="text-secondary"),
                                    dbc.Input(id='y-axis-title', type='text', placeholder='Y axis label (leave blank for auto)', className="mb-3"),
                                    html.Label("Legend position", className="text-secondary", style={'display': 'none'}), # Moved Legend Position here
                                    dcc.Dropdown(
                                        id='legend-position',
                                        options=[{'label': 'Top right', 'value': 'top-right'}, {'label': 'Middle right', 'value': 'middle-right'},
                                                {'label': 'Bottom right', 'value': 'bottom-right'}, {'label': 'Top left', 'value': 'top-left'},
                                                {'label': 'Middle left', 'value': 'middle-left'}, {'label': 'Bottom left', 'value': 'bottom-left'},
                                                {'label': 'Middle top', 'value': 'top-center'}, {'label': 'Middle bottom', 'value': 'bottom-center'},
                                                {'label': 'Hidden', 'value': 'hidden'}],
                                        value='top-right', clearable=False, className="mb-3", style={'display': 'none'}
                                    ),
                                    html.Label("Grid lines", className="text-secondary d-block"),
                                    dbc.RadioItems(id='grid-lines', options=[{'label': 'Display', 'value': True}, {'label': 'Hidden', 'value': False}],
                                                value=True, inline=True, className="mb-3")
                                ]),
                            ], width=6),
                            dbc.Col([
                                html.Label("Color palette", className="text-secondary"),
                                dcc.Dropdown(
                                    id='color-theme',
                                    options=[
                                        {'label': 'Plotly (default)', 'value': 'plotly'}, 
                                        {'label': 'Viridis', 'value': 'viridis'},
                                        {'label': 'Plasma', 'value': 'plasma'}, 
                                        {'label': 'Rainbow', 'value': 'rainbow'},
                                        {'label': 'Turbo', 'value': 'turbo'}, 
                                        {'label': 'Blues', 'value': 'blues'},
                                        {'label': 'Cividis', 'value': 'cividis'}, 
                                        {'label': 'Temps(Carto)', 'value': 'temps'},
                                        {'label': 'Custom', 'value': 'custom'}
                                        ],
                                    value='plotly', clearable=False, className="mb-3"
                                ),
                                html.Div(id='color-picker', style={'display': 'none'}, children=[
                                    html.Label("Custom colors (one per line)", className="text-secondary"),
                                    dbc.Textarea(id='custom-colors', placeholder='eg. #FF5733\nred\nrgb(0,255,0)', className="mb-3", rows=3),
                                ]),
                                # --- Chart Specific Options Section ---
                                html.Div(id='line-bar-area-options', children=[ # Renamed Div for clarity
                                    html.Label("Line/Bar/Area Chart Options:", className="text-secondary fw-bold"),
                                    dbc.Checkbox(id='show-mean-line', label="Mean line", value=False, className="mb-1"),
                                    dbc.Tooltip('small data size not plotted', target='show-mean-line'),
                                    dbc.Checkbox(id='show-median-line', label="Median line", value=False, className="mb-3"),
                                    dbc.Tooltip('small data size not plotted', target='show-median-line')
                                ], style={'display': 'none'}), # Initially hidden, controlled by callback
                                html.Div(id='scatter-options', children=[
                                    html.Label("Scatter Chart Options:", className="text-secondary fw-bold"),
                                    html.Label("Point Opacity:", className="text-secondary"),
                                    dcc.Slider(id='scatter-opacity', min=0.1, max=1, step=0.1, value=0.7,
                                               marks={i / 10: str(i / 10) for i in range(1, 11)}, className="mb-3"),
                                ], style={'display': 'none'}),
                            ], width=6)
                        ]),
                        dbc.Row([
                            dbc.Col([
                                # 折线图样式控制
                                html.Div(id='line-style-options', style={'display': 'none'}, children=[
                                    # 线条宽度控制
                                    html.Label("Line width", className="text-secondary"),
                                    dcc.Slider(id='line-width', min=1, max=10, step=0.5, value=2, marks={i: str(i) for i in range(1, 11)}),
                                    
                                    # 线条样式控制
                                    html.Label("Line style", className="text-secondary mt-3"),
                                    dcc.Dropdown(
                                        id='line-dash',
                                        options=[
                                            {'label': 'Solid line', 'value': 'solid'},
                                            {'label': 'Dash', 'value': 'dash'},
                                            {'label': 'Dot', 'value': 'dot'},
                                            {'label': 'Dash-dot', 'value': 'dashdot'}
                                        ],
                                        value='solid',
                                        clearable=False,
                                        className="mb-3"
                                    ),
                                    
                                    # 标记点大小控制
                                    html.Label("Marker size", className="text-secondary"),
                                    dcc.Slider(id='marker-size', min=2, max=20, step=1, value=6, marks={i: str(i) for i in range(2, 21, 2)}),
                                    
                                    # 标记点样式控制
                                    html.Label("Marker style", className="text-secondary mt-3"),
                                    dcc.Dropdown(
                                        id='marker-symbol',
                                        options=[
                                            {'label': 'Circle', 'value': 'circle'},
                                            {'label': 'Square', 'value': 'square'},
                                            {'label': 'Diamond', 'value': 'diamond'},
                                            {'label': 'Triangle', 'value': 'triangle-up'}
                                        ],
                                        value='circle',
                                        clearable=False,
                                        className="mb-3"
                                    )
                                ]),
                            ]),
                            dbc.Col([

                            ])
                        ])
                    ])
                ], className="shadow mb-4"),
                dbc.Card([
                    dbc.CardHeader(html.H4("🔍 Data preview", className="text-info")),
                    dbc.CardBody([
                        html.Div(id='data-summary-info', className="mb-3"),
                        html.Div(id='data-preview', style={'maxHeight': '400px', 'overflow': 'auto'}),
                    ])
                ], className="shadow", style={'maxHeight': '600px', 'overflowY': 'auto'}),
            ]),
        ], id='main-content'),
        # --- Footer ---
        dbc.Row([
            dbc.Col(
                html.Footer(f"Fuck Charts © {datetime.now().year} - TiiJeiJ8", className="text-center text-muted p-3 mt-4 border-top"),
                width=12
            )
        ])
    ], fluid=True, className="pt-3")
], className="bg-light min-vh-100")

# --- Callback Definitions ---

# Helper function to parse file contents
def parse_contents(contents, filename):
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'csv' in filename.lower():
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
            
            # 自动检测并转换经纬度列
            lat_cols = [col for col in df.columns if any(kw in col.lower() for kw in ['lat', '纬度', 'latitude'])]
            lon_cols = [col for col in df.columns if any(kw in col.lower() for kw in ['lon', 'lng', '经度', 'longitude', 'long'])]
            
            # 转换纬度列
            for col in lat_cols:
                try:
                    if df[col].dtype == object:
                        df[col] = df[col].astype(str).apply(
                            lambda x: convert_coordinate(x) if pd.notna(x) else None)
                        print(f"Converted latitude column '{col}' to decimal degrees.", flush=True)
                except Exception as e:
                    print(f'Error converting latitude column {col}: {str(e)}', flush=True)
                    
            # 转换经度列    
            for col in lon_cols:
                try:
                    if df[col].dtype == object:
                        df[col] = df[col].astype(str).apply(
                            lambda x: convert_coordinate(x) if pd.notna(x) else None)
                        print(f"Converted longitude column '{col}' to decimal degrees.", flush=True)
                except Exception as e:
                    print(f'Error converting longitude column {col}: {str(e)}', flush=True)
                    
        elif 'xls' in filename.lower():
            df = pd.read_excel(io.BytesIO(decoded))
        elif 'json' in filename.lower():
             try:
                 data = json.loads(decoded.decode('utf-8'))
                 df = pd.json_normalize(data) # More robust JSON parsing
             except ValueError: # Handle JSON Lines format
                 df = pd.read_json(io.StringIO(decoded.decode('utf-8')), lines=True)
             except Exception as json_e: # Catch other JSON parsing issues
                 print(f"Error parsing JSON: {json_e}", flush=True)
                 traceback.print_exc()
                 return None, html.Div([f'JSON parsing error: {str(json_e)}'], className="text-danger")
        else:
            return None, html.Div(['Unsupported file type, please upload CSV, Excel or JSON file.'], className="text-danger")

        # Convert potential object columns containing numbers to numeric
        for col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col])
                print(f"Converted column '{col}' to numeric.", flush=True)
            except (ValueError, TypeError):
                 # If conversion fails, keep the original dtype
                 pass
        # Convert date-like columns to datetime objects
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                    print(f"Converted column '{col}' to datetime.", flush=True)
                except (ValueError, TypeError, OverflowError):
                    pass # Keep as object if conversion fails

        return df, html.Div([f'Load successfully: {filename}'], className="text-success")
    except Exception as e:
        print(f"Error parsing file: {e}", flush=True)
        traceback.print_exc()
        return None, html.Div([f'Error processing file: {str(e)}. Please check file format and content.'], className="text-danger")

# Callback: Update Map Column Options
@callback(
    Output('longitude-column', 'options'),\
    Output('latitude-column', 'options'),
    Output('province-column', 'options'),
    Input('data-store', 'data')
)
def update_map_column(data_store_data):
    if not data_store_data:
        return [], [], [] # Return empty options on initial load
    try:
        df = pd.read_json(io.StringIO(data_store_data), orient='split')
        columns = [{'label': col, 'value': col} for col in df.columns]
        return columns, columns, columns
    except Exception as e:
        print(f"Error loading data for map columns: {e}")
        return [], [], [] # Return empty options on error

# Callback: Update Charts background color
@callback(
    Output('custom-bg-color-col', 'style'), # 输出：控制自定义输入框列的样式
    Input('bg-color-select', 'value')      # 输入：监听背景色下拉菜单的值
)
def toggle_custom_bg_color_input(selected_value):
    if selected_value == 'custom':
        return {'display': 'block'} # 显示
    else:
        return {'display': 'none'}  # 隐藏

# Callback: Handle File Upload, Update Stores and Basic UI
@callback(
    [Output('data-store', 'data'), Output('data-info-store', 'data'),
     Output('upload-status', 'children'), Output('data-preview', 'children'),
     Output('data-summary-info', 'children'), Output('x-axis', 'options'),
     Output('y-axis', 'options'), Output('color-column', 'options'),
     Output('size-column', 'options'), Output('pie-values', 'options'),
     Output('pie-names', 'options'), Output('z-axis', 'options'),
     Output('x-axis', 'value'), Output('y-axis', 'value'),
     Output('color-column', 'value'), Output('size-column', 'value'),
     Output('pie-values', 'value'), Output('pie-names', 'value'),
     Output('z-axis', 'value'), Output('sampling-controls', 'style')],
    Input('upload-data', 'contents'),
    State('upload-data', 'filename'),
    prevent_initial_call=True
)
def update_on_upload(contents, filename):
    if contents is None:
        return no_update # Use no_update for efficiency

    df, status_msg = parse_contents(contents, filename)

    if df is None:
        empty_options = []
        no_val = None
        # Clear all outputs on error
        return (None, None, status_msg, None, None, empty_options, empty_options, empty_options, empty_options,
                empty_options, empty_options, empty_options, no_val, no_val, no_val, no_val, no_val, no_val, no_val,
                {'display': 'none'})

    row_count = len(df)
    col_count = len(df.columns)
    # Limit preview size for performance
    df_preview = df.head(50) # Reduced preview rows
    try:
        preview_table = dbc.Table.from_dataframe(df_preview, striped=True, bordered=True, hover=True, responsive=True, className="small table-sm")
    except Exception as table_err:
        preview_table = html.Div(f"Failed to generate table preview: {table_err}", className="text-warning")

    summary_info = html.Div([
        html.Strong(f"Filename: "), html.Span(f"{filename} "),
        html.Strong(f"Total Rows: "), html.Span(f"{row_count:,} "), # Add comma for thousands
        html.Strong(f"Columns: "), html.Span(f"{col_count} "),
        html.Small(f"(Preview shows first {len(df_preview)} rows)", className="text-muted ms-2")
    ])
    columns = [{'label': col, 'value': col} for col in df.columns]
    # Explicitly find numeric columns AFTER potential conversion in parse_contents
    numeric_columns = [{'label': col, 'value': col} for col in df.select_dtypes(include=np.number).columns]
    datetime_columns = [{'label': col, 'value': col} for col in df.select_dtypes(include='datetime').columns]
    categorical_columns = [{'label': col, 'value': col} for col in df.select_dtypes(include=['object', 'category']).columns]

    # Combine numeric and datetime for X-axis typically
    x_axis_options = columns # Allow any column for x generally
    y_axis_options = columns # Allow any column for y generally
    pie_name_options = categorical_columns + datetime_columns # Good candidates for names/labels
    value_options = numeric_columns # Values should be numeric

    # Use StringIO for future pandas compatibility when converting to JSON for store
    json_buffer = io.StringIO()
    df.to_json(json_buffer, date_format='iso', orient='split')
    data_store_content = json_buffer.getvalue()

    data_info = {
        'filename': filename, 
        'rows': row_count, 
        'cols': col_count, 
        'source': 'preprocess',
        'has_coords': 'converted_lat' in df.columns and 'converted_lng' in df.columns
    }

    # --- Smart Default Selection ---
    default_x = None
    default_y = None
    # Try to find a datetime column first for X
    if datetime_columns: default_x = datetime_columns[0]['value']
    elif categorical_columns: default_x = categorical_columns[0]['value'] # Fallback to first categorical
    elif columns: default_x = columns[0]['value'] # Fallback to first column

    # Try to find a numeric column for Y
    if numeric_columns: default_y = [numeric_columns[0]['value']]
    elif len(columns) > 1: # Fallback to second column if available and different from X
        potential_y = columns[1]['value']
        if potential_y != default_x: default_y = [potential_y]
        elif len(columns) > 2: # Fallback to third if second is same as X
             potential_y_2 = columns[2]['value']
             if potential_y_2 != default_x: default_y = [potential_y_2]

    #! Disable default selections for now
    default_x, default_y = None, None

    sampling_style = {'display': 'block'} if row_count > 10000 else {'display': 'none'} # Reduced threshold for visibility

    return (data_store_content, data_info, status_msg, preview_table, summary_info,
            x_axis_options, y_axis_options, columns, numeric_columns, # color, size
            value_options, pie_name_options, numeric_columns, # pie_values, pie_names, z_axis
            default_x, default_y, None, None, None, None, None, # Default selections
            sampling_style)

# Callback: Toggle chart-specific options based on chart type
@callback(
    [Output('pie-options', 'style'), Output('heatmap-options', 'style'),
     Output('color-column-div', 'style'), Output('size-column-div', 'style'),
     Output('line-bar-area-options', 'style'), # Changed Output ID
     Output('scatter-options', 'style'), Output('line-style-options', 'style'),
     Output('heatmap-value-select', 'style'), # 新增热力图数值列选择器
     Output('radar-options', 'style'), # 新增雷达图选项
     Output('sunburst-options', 'style'),  # 新增旭日图控件显示控制
     Output('x-axis', 'placeholder'), Output('y-axis', 'placeholder'),
     Output('pie-values', 'placeholder'), Output('pie-names', 'placeholder'),
     Output('x-axis', 'multi'), Output('y-axis', 'multi'), Output('Formap', 'style'), Output('heatmap-map-style', 'style'), Output('heatmap-type', 'value'), Output('x-axis-div', 'style'), Output('y-axis-div', 'style'), Output('x-y-grid-options', 'style')],
    [Input('chart-type', 'value'), Input('heatmap-type', 'value')]
)
def toggle_chart_options(chart_type, heatmap_type):
    # Default styles (hidden)
    pie_style = heatmap_style = size_style = line_bar_area_style = scatter_opt_style = heatmap_value_select_style = Formap = line_style_options_style = heatmap_map_style = x_axis_div_style = y_axis_div_style = radar_style = sunburst_style = {'display': 'none'}
    # Default visibility for general options
    color_style = {'display': 'block'}
    x_y_grid_options_style = {'display': 'block'}

    # Default placeholders and multi settings
    x_placeholder = "Select X axis column..."
    y_placeholder = "Select Y-axis column (multi)..."
    pie_val_placeholder = "Select value column"
    pie_name_placeholder = "Select name column"
    x_multi = False
    y_multi = True

    # Apply specific settings per chart type
    if chart_type in ['line', 'bar', 'area']:
        line_bar_area_style = {'display': 'block'} # Show mean/median options
        Formap = {'display': 'none'}
        x_axis_div_style = {'display': 'block'}
        y_axis_div_style = {'display': 'block'}
        y_placeholder = "Select Y-axis column (multi)..."
        
        # 显示/隐藏折线图样式选项
        line_style_options_style = {'display': 'block'} if chart_type == 'line' else {'display': 'none'}
    elif chart_type in ['scatter_map']:
        line_bar_area_style = {'display': 'none'} # Hide X/Y selectors for map
        scatter_opt_style = {'display': 'block'} # Hide size/color for map
        color_style = {'display': 'block'} # Show color for map
        size_style = {'display': 'block'} # Show dot size style
        pie_style = {'display': 'none'} # Hide pie options for map
        heatmap_style = {'display': 'none'} # Hide heatmap options for map
        Formap = {'display': 'block'}
        y_multi = False
    elif chart_type in ['heatmap_map']:
        heatmap_map_style = {'display': 'block'} # Show heatmap options
        line_bar_area_style = {'display': 'none'} # Hide X/Y selectors for map
        scatter_opt_style = {'display': 'block'} # Hide size/color for map
        color_style = {'display': 'block'} # Show color for map
        size_style = {'display': 'block'} # Show dot size style
        pie_style = {'display': 'none'} # Hide pie options for map
        heatmap_style = {'display': 'none'} # Hide heatmap options for map
        if heatmap_style == 'density':
            heatmap_value_select_style = {'display': 'none'}
        else:
            heatmap_value_select_style = {'display': 'block'}
        Formap = {'display': 'block'}
        y_multi = False
    elif chart_type == 'scatter':
        x_axis_div_style = {'display': 'block'}
        y_axis_div_style = {'display': 'block'}
        y_placeholder = "Select the Y-axis numerical column (single) .."
        scatter_opt_style = {'display': 'block'}
        size_style = {'display': 'block'} # Show size only for scatter
        Formap = {'display': 'none'}
        y_placeholder = "Select Y-axis column..."
        y_multi = False # Typically scatter has one Y per X
    elif chart_type == 'pie':
        Formap = {'display': 'none'}
        pie_style = {'display': 'block'}
        color_style = {'display': 'none'} # Pie color is usually handled by names/values
        x_y_grid_options_style = {'display': 'none'}
        x_placeholder, y_placeholder, y_multi = "(not used)", "(not used)", False
    elif chart_type == 'heatmap':
        x_axis_div_style = {'display': 'block'}
        y_axis_div_style = {'display': 'block'}
        y_placeholder = "Select Y-axis numerical column (single)..."
        Formap = {'display': 'none'}
        heatmap_style = {'display': 'block'}
        color_style = {'display': 'none'} # Heatmap color is based on Z
        y_placeholder, pie_val_placeholder, pie_name_placeholder, y_multi = "Select Y-axis column...", "(not used)", "(not used)", False
    elif chart_type == 'heatmap_map':
        Formap = {'display': 'block'}
        heatmap_style = {'display': 'block'}
        # 确保地图相关控件显示
        scatter_opt_style = {'display': 'block'}
        color_style = {'display': 'block'}
        size_style = {'display': 'block'}
    elif chart_type == 'treemap':
        Formap = {'display': 'none'}
        x_axis_div_style = {'display': 'block'}
        x_y_grid_options_style = {'display': 'none'}
        pie_style = {'display': 'block'} # Reuse pie options div for values/names
        pie_name_placeholder = "(Optional tags)" # Adjust placeholder for treemap
        x_placeholder, y_placeholder, pie_val_placeholder, x_multi, y_multi = \
            "Select Path Column (multiple)...", "Select label column (optional)...", "Select Value (Size) Column", True, False # Y is for optional labels, single
        color_style = {'display': 'block'} # Allow color grouping for treemap
    elif chart_type in ['box', 'violin']:
         x_axis_div_style = {'display': 'block'}
         y_axis_div_style = {'display': 'block'}
         y_placeholder = "Select the Y-axis numerical column (multiple) .."
         Formap = {'display': 'none'}
         color_style = {'display': 'block'}
    elif chart_type == 'radar':
        radar_style = {'display': 'block'}
        pie_style = heatmap_style = size_style = line_bar_area_style = color_style = {'display': 'none'}
    elif chart_type == 'sunburst':
        sunburst_style = {'display': 'block'}  # 显示旭日图控件
        # 隐藏其他无关控件
        pie_style = heatmap_style = radar_style = line_bar_area_style = {'display': 'none'}
        color_style = size_style = {'display': 'none'}
        x_y_grid_options_style = {'display': 'none'}

    return (pie_style, heatmap_style, color_style, size_style, line_bar_area_style, scatter_opt_style, line_style_options_style, heatmap_value_select_style, radar_style, sunburst_style, 
            x_placeholder, y_placeholder, pie_val_placeholder, pie_name_placeholder, x_multi, y_multi, Formap, heatmap_map_style, heatmap_type, x_axis_div_style, y_axis_div_style, x_y_grid_options_style)

# Callback: Toggle manual render button display
@callback(Output('start-render-button', 'style'), Input('real-time-render-switch', 'value'))
def toggle_render_button(real_time_render):
    return {'display': 'none'} if real_time_render else {'display': 'block', 'width': '100%'}

# Callback: Toggle custom color picker
@callback(Output('color-picker', 'style'), Input('color-theme', 'value'))
def toggle_color_picker(color_theme):
    return {'display': 'block'} if color_theme == 'custom' else {'display': 'none'}

# Callback: Toggle Sidebar
@callback(Output('sidebar', 'is_open'), Input('sidebar-toggle', 'n_clicks'), State('sidebar', 'is_open'), prevent_initial_call=True)
def toggle_sidebar(n_clicks, is_open):
    if n_clicks: return not is_open
    return is_open

# Callback: Toggle custom background color input
@callback(
    Output('custom-bg-color', 'style'),
    Input('bg-color-select', 'value')
)
def toggle_custom_bg_color(bg_color):
    return {'display': 'block'} if bg_color == 'custom' else {'display': 'none'}

# Callback: Update heatmap value column options
@callback(
    Output('heatmap-value-col', 'options'),
    Input('data-store', 'data')
)
def update_heatmap_value_options(data_store_data):
    if not data_store_data:
        return []
    try:
        df = pd.read_json(io.StringIO(data_store_data), orient='split')
        numeric_cols = [{'label': col, 'value': col} for col in df.select_dtypes(include=np.number).columns]
        return numeric_cols
    except Exception as e:
        print(f"Error loading data for heatmap value options: {e}")
        return []

# Callback: Toggle custom ratio inputs
@callback(
    [Output('custom-ratio-inputs', 'style'),
     Output('ratio-alert', 'style')],
    Input('aspect-ratio-select', 'value')
)
def toggle_custom_ratio_inputs(ratio):
    if ratio == 'custom':
        return {'display': 'block'}, {'display': 'block'}
    return {'display': 'none'}, {'display': 'none'}

# Callback: Handle custom ratio inputs
@callback(
    Output('aspect-ratio-select', 'value'),
    [Input('width-input', 'value'),
     Input('height-input', 'value')],
    State('aspect-ratio-select', 'value')
)
def handle_custom_ratio_inputs(width, height, current_ratio):
    if width is not None and height is not None and current_ratio == 'custom':
        return 'custom'  # 保持自定义比例状态
    return current_ratio

# --- Main Graph Update Callback ---
# --- Helper Function for Background Color
def get_background_colors(bg_color_select, custom_bg_color):
    """根据用户选择确定绘图区和画布背景颜色"""
    plot_bgcolor = None # Plotly 默认 (依赖于模板)
    paper_bgcolor = None # Plotly 默认

    if bg_color_select == 'custom':
        # 如果选择了自定义，并且输入框有内容，则使用它
        custom_color_val = custom_bg_color.strip() if custom_bg_color else None
        if custom_color_val:
            # 尝试验证颜色是否有效 (非常基础的检查)
            # Plotly 可以处理很多格式，这里只是防止完全无效的输入
            if custom_color_val.startswith('#') or custom_color_val.startswith('rgb') or custom_color_val.lower() in ['white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'grey', 'gray', 'lightgrey', 'lightgray', 'darkgrey', 'darkgray']:
                plot_bgcolor = custom_color_val
                paper_bgcolor = custom_color_val
            else:
                 print(f"warning: The format of the custom background color {custom_color_val} may be invalid, and the default background will be used instead.")
                 plot_bgcolor = None
                 paper_bgcolor = None
        else: # 选了自定义但没输入 -> 默认
            plot_bgcolor = None
            paper_bgcolor = None
    elif bg_color_select == 'rgba(0,0,0,0)':
        # 特殊处理透明色
        plot_bgcolor = 'rgba(0,0,0,0)'
        paper_bgcolor = 'rgba(0,0,0,0)' # 也让纸张透明
    elif bg_color_select != 'default':
        # 使用预设值
        plot_bgcolor = bg_color_select
        paper_bgcolor = bg_color_select

    return plot_bgcolor, paper_bgcolor

# Radar Chart Callbacks
@callback(
    [Output('radar-category', 'options'),
     Output('radar-values', 'options')],
    [Input('data-store', 'data')]
)
def update_radar_columns(data_store_data):
    if not data_store_data:
        return [], []
    
    df = pd.read_json(io.StringIO(data_store_data), orient='split')
    
    # 分类列选择：字符串/分类列
    category_cols = [col for col in df.columns ] 
    # if pd.api.types.is_string_dtype(df[col]) 
    #                 or pd.api.types.is_categorical_dtype(df[col])
    
    # 数值列选择：数值类型列
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    
    return (
        [{'label': col, 'value': col} for col in category_cols],
        [{'label': col, 'value': col} for col in numeric_cols]
    )

# Sunburst Chart Callbacks
@callback(
    [
        Output('sunburst-path', 'options'),
        Output('sunburst-value', 'options')
    ],
    [Input('data-store', 'data')]
)
def update_sunburst_columns(data_store_data):
    if not data_store_data:
        return [], []
    
    df = pd.read_json(io.StringIO(data_store_data), orient='split')
    df.columns = df.columns.str.encode('utf-8').str.decode('utf-8')
    
    # 层级路径列：允许字符串或分类列
    path_cols = [
        {'label': col, 'value': col} 
        for col in df.columns 
    ]
    
    # 数值列：仅选择数值类型
    value_cols = [
        {'label': col, 'value': col} 
        for col in df.select_dtypes(include=np.number).columns
    ]
    
    return path_cols, value_cols

# --- Main Graph Update Callback ---
@callback(
    [Output('visualization-graph', 'figure'), Output('visualization-graph', 'style')],
    [Input('chart-type', 'value'), Input('x-axis', 'value'), Input('y-axis', 'value'),
     Input('color-column', 'value'), Input('size-column', 'value'),
     Input('pie-values', 'value'), Input('pie-names', 'value'), Input('z-axis', 'value'),
     Input('chart-title', 'value'), Input('color-theme', 'value'), Input('custom-colors', 'value'),
     Input('x-axis-title', 'value'), Input('y-axis-title', 'value'), Input('legend-position', 'value'),
     Input('grid-lines', 'value'), Input('show-mean-line', 'value'), Input('show-median-line', 'value'),
     Input('scatter-opacity', 'value'), Input('data-store', 'data'), Input('sample-data-switch', 'value'),
     Input('real-time-render-switch', 'value'), Input('start-render-button', 'n_clicks'),
     Input('bg-color-select', 'value'), Input('custom-bg-color', 'value'),
     Input('aspect-ratio-select', 'value'),
     Input('width-input', 'value'), Input('height-input', 'value'),
     Input('province-column', 'value'), Input('longitude-column', 'value'), Input('latitude-column', 'value'), 
     Input('map-theme', 'value'), Input('map-zoom', 'value'), Input('mapbox-api-key', 'value'), Input('heatmap-radius', 'value'),
     Input('line-width', 'value'), Input('line-dash', 'value'), 
     Input('marker-size', 'value'), Input('marker-symbol', 'value'), Input('heatmap-value-col', 'value'), 
     Input('radar-category', 'value'), Input('radar-values', 'value'), Input('radar-normalize', 'value'), # 雷达图参数
     Input('sunburst-path', 'value'), Input('sunburst-value', 'value'), # 旭日图参数
     ],
    prevent_initial_call=True 
)
def update_graph(
    chart_type, x_axis, y_axis_list, color_column, size_column,
    pie_values, pie_names, z_axis, chart_title, color_theme, custom_colors,
    x_axis_title_input, y_axis_title_input, legend_pos_key, grid_lines,
    show_mean, show_median, scatter_opacity, data_store_data, use_sampling,
    real_time_render, n_clicks_render,
    bg_color_select, custom_bg_color,
    aspect_ratio, width_input, height_input,  # 输入框参数
    province_col, longitude_column, latitude_column, map_theme, map_zoom,mapbox_api_key, heatmap_radius, # 地图参数
    line_width, line_dash, marker_size, marker_symbol,  # 线/点样式参数
    heatmap_value_col,  # 热力图数值列选择器
    radar_category, radar_values, radar_normalize, # 雷达图参数
    sunburst_path, sunburst_value # 旭日图参数
    ):

    cleanup_fig = go.Figure(layout={'plot_bgcolor': '#FFFFFF', 'paper_bgcolor': '#FFFFFF'})
    cleanup_fig.update_layout(xaxis={'visible': False}, yaxis={'visible': False})
    
    # 处理图表比例
    if aspect_ratio == 'custom':
        # 使用默认值以防回调触发时输入框还未初始化
        width = 100
        height = 56.25
        # 从输入框获取实际值
        ctx = dash.callback_context
        if ctx.inputs:
            for input_id, input_value in ctx.inputs.items():
                if 'width-input' in input_id:
                    width = input_value if input_value else width
                elif 'height-input' in input_id:
                    height = input_value if input_value else height
        # 验证输入
        if width <= 0 or height <= 0:
            width = 100
            height = 56.25
        graph_style = {'height': f'{height}rem', 'width': f'{width}rem'}
    else:
        # 处理预设比例
        if aspect_ratio == '4:3':
            height = '75rem'  # 100 * 3/4
        elif aspect_ratio == '1:1':
            height = '100rem'
        else:  # 默认16:9
            height = '56.25rem'  # 100 * 9/16
        graph_style = {'height': height, 'width': '100%'}

    print("\n\n--- update_graph triggered ---", flush=True)
    ctx = dash.callback_context
    triggered_id = 'start-render-button' # 默认值，以防无上下文触发 (手动模式下的初始加载?)
    if ctx.triggered:
        triggered_id = ctx.triggered[0]['prop_id'].split('.')[0]
    else:
        print("Callback triggered without context (initial load?)", flush=True)
        # 即使在手动模式下，如果数据存在，也允许初始加载
        if not data_store_data: return no_update

    print(f"Trigger ID: {triggered_id}", flush=True)
    print(f"Real-time render: {real_time_render}", flush=True)

    # --- 获取背景颜色 ---
    # 提前获取颜色，以便应用于占位符和错误图表
    final_plot_bgcolor, final_paper_bgcolor = get_background_colors(bg_color_select, custom_bg_color)
    print(f"  Determined background - plot: {final_plot_bgcolor}, paper: {final_paper_bgcolor}", flush=True)

    # 手动渲染逻辑
    if not real_time_render and triggered_id != 'start-render-button' and ctx.triggered:
        print("Manual render mode, button not clicked - Returning placeholder", flush=True)
        fig_placeholder = go.Figure(layout={
            'title': "Please click on the 'Manually render chart' button in the sidebar",
            'xaxis': {'visible': False}, 'yaxis': {'visible': False},
            'annotations': [{
                'text': 'Wait for rendering...', 'xref': 'paper', 'yref': 'paper',
                'showarrow': False, 'font': {'size': 20}
            }]
        })
        # 应用背景色到占位符
        fig_placeholder.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor)
        return fig_placeholder, graph_style

    if not dash.callback_context.triggered:
        return cleanup_fig, graph_style

    # 检查数据是否存在
    if not data_store_data:
        print("No data in data-store - Returning placeholder", flush=True)
        fig_nodata = go.Figure(layout={
            'title': 'Please upload the data file first',
            'xaxis': {'visible': False}, 'yaxis': {'visible': False},
            'annotations': [{
                'text': 'No data available', 'xref': 'paper', 'yref': 'paper',
                'showarrow': False, 'font': {'size': 20}
            }]
        })
        # 应用背景色到占位符
        fig_nodata.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor)
        return fig_nodata, graph_style

    print("Data store found - Loading data", flush=True)
    try:
        # 使用 StringIO 从 store 读取 JSON
        df_original = pd.read_json(io.StringIO(data_store_data), orient='split')
        # 重新应用日期时间转换（JSON 存储为 ISO 字符串）
        for col in df_original.select_dtypes(include='object').columns:
            try:
                # 尝试转换，但仅在看起来像日期字符串时进行（更高效）
                # 这个正则表达式很基础，可能需要针对更多格式进行优化
                if df_original[col].astype(str).str.contains(r'\d{4}-\d{2}-\d{2}|^\d{1,2}/\d{1,2}/\d{2,4}', na=False).any(): # 检查 ISO 或 / 分隔格式
                    converted_col = pd.to_datetime(df_original[col], errors='coerce')
                    # 只有在转换成功且没有把所有值都变成 NaT 时才应用
                    if not converted_col.isna().all() and converted_col.isna().sum() < len(df_original[col]):
                       df_original[col] = converted_col
                       print(f"Re-converted column '{col}' to datetime after loading from store.")
            except Exception as e:
                 print(f"Note: Could not re-convert column '{col}' to datetime after loading: {e}")
                 pass # 如果重新转换失败，则保留为 object

        original_row_count = len(df_original)
        print(f"Data loaded. Original rows: {original_row_count}", flush=True)

        sampling_info = ""
        plot_df = df_original.copy() # 从副本开始
        if use_sampling and original_row_count > 10000:
            sample_size = min(10000, original_row_count) # 确保样本大小不超过原始行数
            plot_df = df_original.sample(n=sample_size, random_state=42) # 使用 random_state 保证一致性
            sampling_info = f"(Sampled {len(plot_df):,} rows)"
            print(f"Applied sampling. Sampled rows: {len(plot_df)}", flush=True)
        else:
            print("Sampling not applied or not needed", flush=True)
        # 保留 df_original 以用于计算（例如柱状图的均值/中位数）

    except Exception as e:
        print(f"CRITICAL ERROR: Loading data from store: {e}", flush=True)
        traceback.print_exc()
        error_fig = go.Figure(layout={'title': f'Error: Failed to load data from cache - {e}'})
        # 应用背景色到错误图表
        error_fig.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor)
        return error_fig, graph_style

    # --- 输入验证 ---
    print("Validating inputs...", flush=True)
    required_input_missing = False
    error_message = "Please select the necessary columns to draw the chart."

    # 确保 y_axis_list 始终是列表
    if y_axis_list and not isinstance(y_axis_list, list):
        y_axis_list = [y_axis_list]
    elif not y_axis_list:
        y_axis_list = [] # 如果是 None 或空，确保是空列表

    y_axis_selected = len(y_axis_list) > 0

    # 特定图表的要求
    if chart_type in ['line', 'bar', 'scatter', 'box', 'violin', 'area'] and (not x_axis or not y_axis_selected):
        required_input_missing = True
        error_message = f"{chart_type.capitalize()} needs to specify the X axis and at least one Y axis."
    elif chart_type == 'pie' and (not pie_values or not pie_names):
         required_input_missing = True
         error_message = "The pie chart requires selecting the 'value column' and 'name column''."
    elif chart_type == 'heatmap':
        # 热力图的 Y 轴在 UI 逻辑中是单选，这里需要检查是否至少选了一个
        y_heat_selected = y_axis_list[0] if y_axis_selected else None
        if not x_axis or not y_heat_selected or not z_axis:
             required_input_missing = True
             error_message = "The heatmap needs to specify the X-axis, Y-axis (single), and Z-axis (value) columns."
    elif chart_type == 'treemap' and (not x_axis or not pie_values): # x_axis 包含路径
        required_input_missing = True
        error_message = "The tree diagram requires specifying the 'Path' (X-axis) and 'Value' (Size) columns."

    # 检查选择的列是否在数据帧中实际存在（使用 plot_df，它可能是采样/复制后的）
    # 如果 x_axis 是列表（用于 treemap），则将其展平
    x_axis_flat = x_axis if isinstance(x_axis, list) else [x_axis]
    all_selected_cols = x_axis_flat + y_axis_list + [color_column, size_column, pie_values, pie_names, z_axis]
    # 在检查存在性之前过滤掉 None 值
    valid_cols_to_check = [col for col in all_selected_cols if col]
    missing_cols = [col for col in valid_cols_to_check if col not in plot_df.columns]

    if missing_cols:
        required_input_missing = True
        # 使用 set 避免错误消息中出现重复的列名
        error_message = f"The columns selected below do not exist in the data: {', '.join(set(missing_cols))}"

    if required_input_missing:
         print(f"Input validation failed: {error_message} - Returning placeholder", flush=True)
         fig_error = go.Figure(layout={'title': error_message, 'xaxis': {'visible': False}, 'yaxis': {'visible': False},
                                  'annotations': [{'text': 'Missing or invalid input', 'xref': 'paper', 'yref': 'paper', 'showarrow': False, 'font': {'size': 16, 'color': '#FD763F'}}]})
         # 应用背景色到验证错误图表
         fig_error.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor)
         return fig_error, graph_style
    print("Input validation passed", flush=True)

    fig = None # 初始化 fig 为 None
    print("Entering figure generation try block...", flush=True)
    try:
        rows_for_plot = len(plot_df)
        aggregation_info = "" # 添加注释说明数据是否被聚合
        print(f"Data prepared for plotting. Rows: {rows_for_plot}", flush=True)

        # --- 颜色标度逻辑 ---
        plotly_color_sequences = {
            'viridis': px.colors.sequential.Viridis, 'plasma': px.colors.sequential.Plasma, 'rainbow': px.colors.sequential.Rainbow,
            'turbo': px.colors.sequential.Turbo, 'blues': px.colors.sequential.Blues, 'cividis': px.colors.sequential.Cividis,
            'temps': px.colors.carto.Temps, 'plotly': px.colors.qualitative.Plotly # 默认定性
        }
        custom_color_scale = None
        if color_theme == 'custom' and custom_colors:
            try:
                colors = [color.strip() for color in custom_colors.split('\n') if color.strip()]
                if colors: custom_color_scale = colors
                else: color_theme = 'plotly' # 如果输入为空则回退
            except Exception as e:
                print(f"Error parsing custom colors: {e}", flush=True); color_theme = 'plotly'

        # 确定最终使用的颜色序列
        selected_color_sequence = custom_color_scale if color_theme == 'custom' and custom_color_scale else plotly_color_sequences.get(color_theme, px.colors.qualitative.Plotly)
        print(f"Using color theme: {color_theme}. Sequence length: {len(selected_color_sequence)}", flush=True)

        # --- 为 Plotly Express 准备颜色参数 ---
        color_args = {}
        effective_color_column = color_column # 使用一个新变量，可能在后面被设为 None

        if effective_color_column and effective_color_column in plot_df:
            print(f"Color column '{effective_color_column}' selected.", flush=True)
            color_col_data = plot_df[effective_color_column].dropna() # 删除 NaNs 进行分析

            if not color_col_data.empty: # 仅在删除 NaNs 后仍有数据时继续
                is_numeric_like = False
                if pd.api.types.is_numeric_dtype(color_col_data):
                    is_numeric_like = True
                elif pd.api.types.is_object_dtype(color_col_data) or pd.api.types.is_string_dtype(color_col_data):
                     num_col_temp = pd.to_numeric(color_col_data, errors='coerce')
                     if not num_col_temp.isna().all() and num_col_temp.isna().sum() / len(color_col_data) < 0.5: # 转换后 NaN 少于 50%?
                         is_numeric_like = True

                if is_numeric_like:
                    color_args['color'] = effective_color_column # 将列名传递给 px
                    if color_theme != 'plotly':
                         color_args['color_continuous_scale'] = selected_color_sequence
                    if color_theme == 'custom' and custom_color_scale:
                         color_args['color_continuous_scale'] = custom_color_scale
                    if 'color_continuous_scale' not in color_args:
                         color_args['color_continuous_scale'] = px.colors.sequential.Viridis
                    print(f"Using color_continuous_scale for numeric-like column '{effective_color_column}'", flush=True)
                else:
                    color_args['color'] = effective_color_column # 将列名传递给 px
                    unique_values = color_col_data.unique()
                    color_map = {val: selected_color_sequence[i % len(selected_color_sequence)] for i, val in enumerate(unique_values)}
                    color_args['color_discrete_map'] = color_map
                    print(f"Created color_discrete_map for column '{effective_color_column}' with {len(unique_values)} unique values.", flush=True)
            else:
                print(f"Color column '{effective_color_column}' contains only NaN values. Ignoring color column.", flush=True)
                effective_color_column = None # 有效地禁用颜色列的使用

        # 如果没有有效的颜色列，或者对于不使用 'color=' 的图表，如果需要，直接使用序列
        if not effective_color_column and chart_type not in ['pie', 'heatmap', 'treemap'] and y_axis_selected:
             color_args['color_discrete_sequence'] = selected_color_sequence
             print("Using color_discrete_sequence directly (no valid color column or not applicable chart type).", flush=True)

        # 对特定图表类型的特殊颜色处理（如果未选择颜色列）
        if chart_type == 'heatmap' and 'color_continuous_scale' not in color_args :
             color_args['color_continuous_scale'] = selected_color_sequence if color_theme != 'plotly' else px.colors.sequential.Viridis
             print(f"Setting default color_continuous_scale for heatmap.", flush=True)
        if chart_type == 'treemap':
             if 'color_continuous_scale' not in color_args and 'color_discrete_map' not in color_args:
                 color_args['color_discrete_sequence'] = selected_color_sequence
                 print(f"Setting color_discrete_sequence for treemap as fallback.", flush=True)
        if chart_type == 'pie' and pie_names and pie_names in plot_df:
             unique_names = plot_df[pie_names].dropna().unique()
             if len(unique_names) > 0 :
                 pie_color_map = {name: selected_color_sequence[i % len(selected_color_sequence)] for i, name in enumerate(unique_names)}
                 # 只有当没有通过 effective_color_column 设置颜色时，才使用基于名称的映射
                 if 'color' not in color_args:
                     color_args['color'] = pie_names # 告知 px 按名称列着色
                     color_args['color_discrete_map'] = pie_color_map
                     print(f"Setting color_discrete_map for pie chart based on '{pie_names}'.", flush=True)
                 elif 'color_discrete_map' not in color_args: # 如果颜色已设置但映射未设置（例如颜色列是分类的）
                     # 确保映射与颜色列匹配
                      if effective_color_column == pie_names:
                          color_args['color_discrete_map'] = pie_color_map
                      else: print("Warning: Pie chart color set by a different column, name-based map not applied directly.")

             else: print(f"Warning: No valid (non-NaN) names found in '{pie_names}' for pie chart color map.")

        print(f"Attempting to create chart type: {chart_type}", flush=True)
        # --- 创建绘图 ---
        # (注意：这里使用了 **color_args 解包，它包含了 'color', 'color_continuous_scale', 'color_discrete_map', 'color_discrete_sequence' 中相关的参数)
        if chart_type == 'line':
            fig = px.line(plot_df, x=x_axis, y=y_axis_list,
                          markers=(rows_for_plot < 200), # 点数较少时显示标记
                          **color_args)
            
            # 应用折线图样式参数
            fig.update_traces(
                line=dict(
                    width=line_width,
                    dash=line_dash
                ),
                marker=dict(
                    size=marker_size,
                    symbol=marker_symbol
                )
            )

        elif chart_type == 'bar':
             aggregated_df = plot_df
             aggregation_applied = False
             if x_axis and (pd.api.types.is_categorical_dtype(plot_df[x_axis]) or pd.api.types.is_object_dtype(plot_df[x_axis]) or pd.api.types.is_string_dtype(plot_df[x_axis])):
                  unique_x_count = plot_df[x_axis].nunique()
                  if unique_x_count > 100 and y_axis_list:
                     numeric_y_cols_for_agg = [yc for yc in y_axis_list if yc in plot_df and pd.api.types.is_numeric_dtype(plot_df[yc])]
                     if numeric_y_cols_for_agg:
                         try:
                             grouped_df_temp = plot_df.groupby(x_axis, observed=False)[numeric_y_cols_for_agg].mean().reset_index()
                             if len(grouped_df_temp) < unique_x_count * 0.9:
                                 aggregated_df = grouped_df_temp
                                 aggregation_info = f" (The Y value has been aggregated and averaged along the X-axis [{len(aggregated_df)} groups]"
                                 aggregation_applied = True
                                 print(f"Applied aggregation for bar chart. Result rows: {len(aggregated_df)}", flush=True)
                         except Exception as agg_err:
                             print(f"Aggregation for bar chart failed: {agg_err}", flush=True)
             barmode = 'group'
             if not aggregation_applied and len(y_axis_list) > 1 and plot_df[x_axis].nunique() > 30: barmode = 'relative'
             elif aggregation_applied and len(y_axis_list) == 1: barmode = 'relative'
             fig = px.bar(aggregated_df, x=x_axis, y=y_axis_list,
                          barmode=barmode,
                          **color_args)

        elif chart_type == 'scatter':
             y_scatter = y_axis_list[0] if y_axis_list else None
             if not y_scatter: raise ValueError("A scatter plot requires selecting a Y-axis.")
             fig = px.scatter(plot_df, x=x_axis, y=y_scatter,
                              size=size_column if size_column in plot_df else None,
                              opacity=scatter_opacity,
                              **color_args)

        elif chart_type == 'pie':
             # 先过滤 NaN
             pie_df_filtered = plot_df.dropna(subset=[pie_names, pie_values])
             if len(pie_df_filtered) < len(plot_df): print(f"Warning: Dropped rows with NaN in names/values for Pie chart.")
             if not pie_df_filtered.empty:
                  if not pd.api.types.is_numeric_dtype(pie_df_filtered[pie_values]): raise ValueError(f"The 'values' column ({pie_values}) for Pie chart must be numeric.")
                  # 聚合数据
                  pie_df_aggregated = pie_df_filtered.groupby(pie_names, observed=False)[pie_values].sum().reset_index()
                  print(f"Aggregated pie data: {len(pie_df_aggregated)} slices.")
                  # 准备参数，注意 color_args 可能包含 color=pie_names 和 color_discrete_map
                  pie_final_args = {'names': pie_names, 'values': pie_values}
                  pie_final_args.update(color_args) # 将颜色相关的参数合并进来
                  fig = px.pie(pie_df_aggregated, **pie_final_args)
                  fig.update_traces(textposition='inside', textinfo='percent+label', pull=0.02)
             else: raise ValueError("There is no valid data for drawing a pie chart (check NaN in the name and value columns).")

        elif chart_type == 'heatmap':
             heatmap_data = None
             pivot_success = False
             y_heat = y_axis_list[0] if y_axis_selected else None
             pivot_err_msg = "" # 用于存储透视表错误信息
             try:
                 if x_axis and y_heat and z_axis and x_axis in plot_df and y_heat in plot_df and z_axis in plot_df:
                     if not pd.api.types.is_numeric_dtype(plot_df[z_axis]): raise ValueError(f"The Z-axis ({z_axis}) must be of numerical type.")
                     pivot_ready_df = plot_df.dropna(subset=[x_axis, y_heat, z_axis])
                     if len(pivot_ready_df) < len(plot_df): print(f"Warning: Dropped rows with NaN in X/Y/Z for heatmap pivot.")
                     if not pivot_ready_df.empty:
                         aggfunc = 'mean' if pivot_ready_df.duplicated(subset=[x_axis, y_heat]).any() else 'first'
                         pivot_df = pd.pivot_table(pivot_ready_df, index=y_heat, columns=x_axis, values=z_axis, aggfunc=aggfunc)
                         heatmap_data = pivot_df
                         pivot_success = True
                         print(f"Created pivot table for heatmap ({len(pivot_df)}x{len(pivot_df.columns)}).", flush=True)
                     else: raise ValueError("After dropna, the data is empty.")
                 else: raise ValueError("Effective X, Y, and Z axes are required.")
             except Exception as pivot_err:
                 pivot_err_msg = str(pivot_err)
                 print(f"Pivoting failed ({pivot_err_msg}), attempting correlation matrix.", flush=True)
                 numeric_df = plot_df.select_dtypes(include=np.number)
                 numeric_df = numeric_df.loc[:, numeric_df.std(ddof=0) > 0] # 排除常量列
                 if not numeric_df.empty and len(numeric_df.columns) > 1:
                     corr_df = numeric_df.corr()
                     heatmap_data = corr_df
                     chart_title = chart_title or "Correlation coefficient heatmap"
                     x_axis_title_input = x_axis_title_input or "Variable"
                     y_axis_title_input = y_axis_title_input or "Variable"
                     aggregation_info = " (Numerical columns correlation)"
                     print(f"Created correlation matrix ({len(corr_df)}x{len(corr_df.columns)}) for heatmap.", flush=True)
                 else:
                     err_msg = "Fail to create heatmap: "
                     if pivot_err_msg: err_msg += f"Pivot table failed ({pivot_err_msg})"
                     if numeric_df.empty or len(numeric_df.columns) <=1: err_msg += " and not enough numerical columns for correlation."
                     raise ValueError(err_msg)

             if heatmap_data is not None and not heatmap_data.empty:
                 abs_max = heatmap_data.abs().max().max()
                 text_fmt = ".1f" if abs_max > 10 else ".2f" if abs_max > 0.1 else ".3f"
                 fig = px.imshow(heatmap_data, text_auto=text_fmt, aspect="auto", **color_args)
             else: raise ValueError("Fail to generate heatmap data.")

        elif chart_type == 'box':
             fig = px.box(plot_df, x=x_axis, y=y_axis_list, points='outliers', **color_args)
        elif chart_type == 'violin':
             fig = px.violin(plot_df, x=x_axis, y=y_axis_list, box=True, points='outliers', **color_args)
        elif chart_type == 'area':
            fig = px.area(plot_df, x=x_axis, y=y_axis_list, markers=(rows_for_plot < 200), **color_args)

        elif chart_type == 'treemap':
            path_cols = x_axis if isinstance(x_axis, list) else [x_axis]
            values_col = pie_values
            labels_col = y_axis_list[0] if y_axis_list else None

            # 验证
            if not path_cols or not values_col: raise ValueError("The tree diagram requires columns for 'path' (X-axis) and 'value' (size).")
            if values_col not in plot_df or not pd.api.types.is_numeric_dtype(plot_df[values_col]): raise ValueError(f"The 'value' column ({values_col}) must exist and be numeric.")
            for p_col in path_cols:
                 if p_col not in plot_df: raise ValueError(f"The 'path' column ({p_col}) does not exist.")
            if labels_col and labels_col not in plot_df: labels_col = None
            if effective_color_column and effective_color_column not in plot_df: effective_color_column = None

            hover_name_col = labels_col if labels_col else path_cols[-1]
            required_treemap_cols = [c for c in path_cols + [values_col] if c]
            treemap_df_filtered = plot_df.dropna(subset=required_treemap_cols)
            if len(treemap_df_filtered) < len(plot_df): print(f"Warning: Dropped rows with NaN in path/value for Treemap.")

            if not treemap_df_filtered.empty:
                treemap_args = { 'data_frame': treemap_df_filtered, 'path': path_cols, 'values': values_col, 'hover_name': hover_name_col }
                # 确定颜色列
                color_treemap_col = effective_color_column if effective_color_column else path_cols[-1]
                treemap_args['color'] = color_treemap_col

                # hover 数据
                hover_data_list = {values_col: ':.2f'}
                if labels_col and labels_col != hover_name_col: hover_data_list[labels_col] = True
                if color_treemap_col not in [values_col, labels_col, hover_name_col]: hover_data_list[color_treemap_col] = True
                treemap_args['hover_data'] = hover_data_list

                # 应用颜色标度/映射 (从 color_args 中提取)
                if color_treemap_col in treemap_df_filtered:
                     color_data = treemap_df_filtered[color_treemap_col].dropna()
                     if not color_data.empty:
                          is_numeric_color = pd.api.types.is_numeric_dtype(color_data)
                          if is_numeric_color:
                               if 'color_continuous_scale' in color_args: treemap_args['color_continuous_scale'] = color_args['color_continuous_scale']
                               # 计算中点
                               try:
                                    valid_value_data = treemap_df_filtered.loc[color_data.index, values_col].astype(float)
                                    valid_color_data_num = color_data.astype(float)
                                    positive_weights_mask = valid_value_data > 0
                                    if positive_weights_mask.any():
                                        treemap_args['color_continuous_midpoint'] = np.average(valid_color_data_num[positive_weights_mask], weights=valid_value_data[positive_weights_mask])
                                    else: treemap_args['color_continuous_midpoint'] = np.mean(valid_color_data_num)
                               except Exception as avg_err:
                                    print(f"Could not calculate midpoint: {avg_err}", flush=True)
                                    treemap_args['color_continuous_midpoint'] = np.median(color_data.astype(float))
                          else: # 分类颜色
                               if 'color_discrete_map' in color_args and color_args.get('color') == color_treemap_col :
                                    # 仅当 color_args 中的映射是针对当前颜色列时才应用
                                    treemap_args['color_discrete_map'] = color_args['color_discrete_map']
                                    print(f"Applied discrete map from color_args for treemap color '{color_treemap_col}'.")
                               elif 'color_discrete_sequence' in color_args: # 备用方案
                                    treemap_args['color_discrete_sequence'] = color_args['color_discrete_sequence']
                     else: print(f"Color column '{color_treemap_col}' has no valid data for treemap.")
                elif 'color_discrete_sequence' in color_args: # 无颜色列或无效，使用序列进行路径着色
                    treemap_args['color_discrete_sequence'] = color_args['color_discrete_sequence']

                fig = px.treemap(**treemap_args)
                fig.update_traces(textinfo='label+value+percent parent', textfont_size=10)
                fig.update_layout(margin=dict(t=50, l=25, r=25, b=25))
            else: raise ValueError("There is no valid data for drawing the tree diagram (check NaN in the path and value columns).")

        elif chart_type == 'radar':
            # 验证必要输入
            required_cols = [radar_category] + (radar_values if radar_values else [])
            missing_cols = [col for col in required_cols if col not in plot_df.columns]
            
            if not radar_category or not radar_values or len(missing_cols) > 0:
                raise ValueError(f"Missing necessary columns: {', '.join(missing_cols)}")
            
            # 数据预处理
            radar_df = plot_df[required_cols].dropna()
            categories = radar_df[radar_category].unique()

            if radar_normalize:
                scaler = MinMaxScaler(feature_range=(0, 1))
                radar_df[radar_values] = scaler.fit_transform(radar_df[radar_values])
            
            # 创建雷达图
            fig = go.Figure()
            
            for cat in categories:
                subset = radar_df[radar_df[radar_category] == cat]
                values = subset[radar_values].mean().tolist()
                values += values[:1]  # 闭合图形
                
                fig.add_trace(go.Scatterpolar(
                    r=values,
                    theta=radar_values + [radar_values[0]],  # 闭合标签
                    name=str(cat),
                    fill='toself',
                    line_color=selected_color_sequence[len(fig.data) % len(selected_color_sequence)]
                ))
            
            # 设置布局
            fig.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        # gridcolor=grid_color,
                        # color=grid_color
                    ),
                    angularaxis=dict(
                        # color=grid_color,
                        rotation=90  # 调整起始角度
                    )
                ),
                showlegend=True
            )

        elif chart_type == 'sunburst':
            # 输入验证
            if not sunburst_path or len(sunburst_path) < 1:
                raise ValueError("Select at least one hierarchical path column")
            if not sunburst_value:
                raise ValueError("Select value column")

            print(f"Creating sunburst chart with path columns:\n {plot_df[sunburst_path]}\nValue column:\n {plot_df[sunburst_value]}", flush=True)

            sunburst_dict = convert_to_sunburst_data(
                df=plot_df,
                hierarchy_columns=sunburst_path,
                value_column=sunburst_value,
            )

            fig = px.sunburst(
                sunburst_dict,
                names='character',
                parents='parent',
                values='value',
                branchvalues='total',
                color_discrete_sequence=selected_color_sequence,
            )

            fig.update_layout(
                margin=dict(t=30, l=0, r=0, b=0),
                uniformtext=dict(minsize=12, mode='hide')
            )

        elif chart_type in ['scatter_map', 'heatmap_map', 'line_map']:
            # 严格模式验证
            has_coords = longitude_column and latitude_column and longitude_column in plot_df.columns and latitude_column in plot_df.columns
            has_admin = province_col and province_col in plot_df.columns
            
            if not has_coords and not has_admin:
                error_fig = go.Figure(
                    layout={
                        'title':'Lack of map data',
                        'xaxis': {'visible': False}, 'yaxis': {'visible': False},
                        'annotations': [{
                            'text': 'Please select Lat&Lon column or Region column', 
                            'xref': 'paper', 'yref': 'paper',
                            'showarrow': False,
                            'font': {'size': 16},
                        }]
                    })
                return error_fig, {'height': '600px', 'margin': 'auto'}
            
            if has_coords and has_admin:
                error_fig = go.Figure(
                    layout={
                        'title':'Data schema conflict',
                        'xaxis': {'visible': False}, 'yaxis': {'visible': False},
                        'annotations': [{
                            'text': 'Cannot use latitude and longitude columns and provincial/city columns simultaneously', 
                            'xref': 'paper', 'yref': 'paper',
                            'showarrow': False,
                            'font': {'size': 16},
                        }]
                    })
                return error_fig, {'height': '600px', 'margin': 'auto'}
            
            if has_admin:
                # 行政区划模式
                print(f"Using administrative division mode, column: {province_col}", flush=True)
                try:
                    print("Starting province coordinate conversion...", flush=True)
                    # 多级行政区划坐标映射
                    #! 考虑外部导入坐标映射文件
                    admin_divisions = {
                        '北京': {'lat': 39.9042, 'lng': 116.4074},
                        '上海': {'lat': 31.2304, 'lng': 121.4737},
                        '广州': {'lat': 23.1291, 'lng': 113.2644},
                        '深圳': {'lat': 22.5431, 'lng': 114.0579},
                        '杭州': {'lat': 30.2741, 'lng': 120.1551},
                        '南京': {'lat': 32.0603, 'lng': 118.7969},
                        '成都': {'lat': 30.5728, 'lng': 104.0668},
                        '武汉': {'lat': 30.5928, 'lng': 114.3052},
                        '西安': {'lat': 34.3416, 'lng': 108.9398},
                        '天津': {'lat': 39.0842, 'lng': 117.2010},
                        '重庆': {'lat': 29.5630, 'lng': 106.5516},
                        '哈尔滨': {'lat': 45.8038, 'lng': 126.5350},
                        '长春': {'lat': 43.8171, 'lng': 125.3235},
                        '沈阳': {'lat': 41.8057, 'lng': 123.4315},
                        '石家庄': {'lat': 38.0423, 'lng': 114.5149},
                        '太原': {'lat': 37.8706, 'lng': 112.5489},
                        '郑州': {'lat': 34.7473, 'lng': 113.6249},
                        '济南': {'lat': 36.6512, 'lng': 117.1201},
                        '合肥': {'lat': 31.8206, 'lng': 117.2272},
                        '长沙': {'lat': 28.2282, 'lng': 112.9388},
                        '南昌': {'lat': 28.6820, 'lng': 115.8579},
                        '福州': {'lat': 26.0745, 'lng': 119.2965},
                        '南宁': {'lat': 22.8167, 'lng': 108.3667},
                        '海口': {'lat': 20.0444, 'lng': 110.1990},
                        '贵阳': {'lat': 26.6470, 'lng': 106.6302},
                        '昆明': {'lat': 25.0433, 'lng': 102.7062},
                        '拉萨': {'lat': 29.6456, 'lng': 91.1409},
                        '兰州': {'lat': 36.0614, 'lng': 103.8343},
                        '西宁': {'lat': 36.6232, 'lng': 101.7843},
                        '银川': {'lat': 38.4872, 'lng': 106.2309},
                        '乌鲁木齐': {'lat': 43.8256, 'lng': 87.6168},
                        '呼和浩特': {'lat': 40.8426, 'lng': 111.7490},
                        '广东省': {'lat': 23.3790, 'lng': 113.7633},
                        '浙江省': {'lat': 30.2741, 'lng': 120.1551},
                        '江苏省': {'lat': 32.0603, 'lng': 118.7969},
                        '四川省': {'lat': 30.5728, 'lng': 104.0668},
                        '湖北省': {'lat': 30.5928, 'lng': 114.3052},
                        '陕西省': {'lat': 34.3416, 'lng': 108.9398},
                        '黑龙江省': {'lat': 45.8038, 'lng': 126.5350},
                        '吉林省': {'lat': 43.8171, 'lng': 125.3235},
                        '辽宁省': {'lat': 41.8057, 'lng': 123.4315},
                        '河北省': {'lat': 38.0423, 'lng': 114.5149},
                        '山西省': {'lat': 37.8706, 'lng': 112.5489},
                        '河南省': {'lat': 34.7473, 'lng': 113.6249},
                        '山东省': {'lat': 36.6512, 'lng': 117.1201},
                        '安徽省': {'lat': 31.8206, 'lng': 117.2272},
                        '湖南省': {'lat': 28.2282, 'lng': 112.9388},
                        '江西省': {'lat': 28.6820, 'lng': 115.8579},
                        '福建省': {'lat': 26.0745, 'lng': 119.2965},
                        '广西壮族自治区': {'lat': 22.8167, 'lng': 108.3667},
                        '海南省': {'lat': 20.0444, 'lng': 110.1990},
                        '贵州省': {'lat': 26.6470, 'lng': 106.6302},
                        '云南省': {'lat': 25.0433, 'lng': 102.7062},
                        '西藏自治区': {'lat': 29.6456, 'lng': 91.1409},
                        '甘肃省': {'lat': 36.0614, 'lng': 103.8343},
                        '青海省': {'lat': 36.6232, 'lng': 101.7843},
                        '宁夏回族自治区': {'lat': 38.4872, 'lng': 106.2309},
                        '新疆维吾尔自治区': {'lat': 43.8256, 'lng': 87.6168},
                        '内蒙古自治区': {'lat': 40.8426, 'lng': 111.7490}
                    }

                    def normalize_admin_name(name):
                        """标准化行政区划名称"""
                        # 去除常见后缀和空格
                        name = str(name).strip()
                        for suffix in ['省', '市', '区', '县', '自治州']:
                            if name.endswith(suffix):
                                name = name[:-len(suffix)]
                        return name

                    def find_coordinates(admin_name):
                        """智能查找行政区划坐标"""
                        normalized = normalize_admin_name(admin_name)
                        
                        # 多级尝试匹配
                        for level in [3, 2, 1]:  # 3级(省市区)、2级(省市)、1级(省)
                            parts = normalized.split('/')[:level]
                            key = '/'.join(parts)
                            if key in admin_divisions:
                                print(f"Matched '{admin_name}' as '{key}'", flush=True)
                                return admin_divisions[key]
                        
                        print(f"No match found for '{admin_name}'", flush=True)
                        return None

                    # 批量转换行政区划名称到坐标
                    admin_series = plot_df[province_col].astype(str)
                    coordinates = admin_series.apply(find_coordinates)
                    
                    plot_df['converted_lat'] = coordinates.apply(lambda x: x['lat'] if x else None)
                    plot_df['converted_lng'] = coordinates.apply(lambda x: x['lng'] if x else None)
                    
                    # 统计匹配成功率
                    matched = coordinates.notna()
                    print(f"Admin division match rate: {matched.mean():.1%} ({matched.sum()}/{len(matched)})", flush=True)
                    
                    # 优化：批量转换数值类型
                    plot_df['converted_lat'] = pd.to_numeric(plot_df['converted_lat'], errors='coerce')
                    plot_df['converted_lng'] = pd.to_numeric(plot_df['converted_lng'], errors='coerce')
                    
                    # 提前过滤无效坐标
                    valid_coords = plot_df['converted_lat'].notna() & plot_df['converted_lng'].notna()
                    if not valid_coords.all():
                        print(f"Filtered {len(plot_df) - valid_coords.sum()} rows with invalid coordinates", flush=True)
                        plot_df = plot_df[valid_coords].copy()
                    
                    latitude_col = 'converted_lat'
                    longitude_col = 'converted_lng'
                    print("Province coordinate conversion completed", flush=True)
                    
                    # Validate coordinates
                    if plot_df['converted_lat'].isnull().all() or plot_df['converted_lng'].isnull().all():
                        raise ValueError("Unable to obtain valid coordinates from the province column, please check if the province name is correct")
                    elif not pd.api.types.is_numeric_dtype(plot_df['converted_lat']) or not pd.api.types.is_numeric_dtype(plot_df['converted_lng']):
                        raise ValueError("Coordinate values must be of numerical type")
                        
                except Exception as e:
                    print(f'Coordinate conversion error: {str(e)}')
                    traceback.print_exc()
                    return go.Figure(
                        layout={
                            'title': 'Coordinate conversion error',
                            'xaxis': {'visible': False}, 'yaxis': {'visible': False},
                            'annotations': [{
                                'text': f'Coordinate conversion failed: {str(e)}', 
                                'xref': 'paper', 'yref': 'paper',
                                'showarrow': False,
                                'font': {'size': 16},
                            }]
                        })
            else:
                # When province_col is not provided, use directly specified columns
                try:
                    # Ensure specified columns contain numeric data
                    if latitude_column not in plot_df.columns or longitude_column not in plot_df.columns:
                        raise ValueError("The specified latitude and longitude columns do not exist")
                        
                    plot_df[latitude_column] = pd.to_numeric(plot_df[latitude_column], errors='coerce')
                    plot_df[longitude_column] = pd.to_numeric(plot_df[longitude_column], errors='coerce')
                    
                    latitude_col = latitude_column
                    longitude_col = longitude_column
                    
                    # Validate coordinates
                    if plot_df[latitude_col].isnull().all() or plot_df[longitude_col].isnull().all():
                        raise ValueError("The specified latitude and longitude column contains invalid numerical data")
                    elif not pd.api.types.is_numeric_dtype(plot_df[latitude_col]) or not pd.api.types.is_numeric_dtype(plot_df[longitude_col]):
                        raise ValueError("Lat&Lon columns must be of numerical type")
                except Exception as e:
                    print(f'Lat&Lon data processing error: {str(e)}')
                    traceback.print_exc()
                    return go.Figure(
                        layout={
                            'title': 'Lat&Lon data error',
                            'xaxis': {'visible': False}, 'yaxis': {'visible': False},
                            'annotations': [{
                                'text': f'Fail to process Lat&Lon data: {str(e)}', 
                                'xref': 'paper', 'yref': 'paper',
                                'showarrow': False,
                                'font': {'size': 16},
                            }]
                        })
            
            # 设置默认地图样式和缩放级别
            default_style = "carto-positron"  # 使用轻量级默认样式
            default_zoom = 4
            
            # 优化：根据数据范围自动计算合适的缩放级别
            if map_zoom is None and len(plot_df) > 0:
                try:
                    lat_range = plot_df[latitude_col].max() - plot_df[latitude_col].min()
                    lon_range = plot_df[longitude_col].max() - plot_df[longitude_col].min()
                    max_range = max(lat_range, lon_range)
                    if max_range > 20: default_zoom = 3
                    elif max_range > 10: default_zoom = 4
                    elif max_range > 5: default_zoom = 5
                    elif max_range > 2: default_zoom = 6
                    else: default_zoom = 7
                    print(f"Auto-calculated zoom level: {default_zoom}", flush=True)
                except Exception as zoom_err:
                    print(f"Could not calculate zoom level: {zoom_err}", flush=True)
            
            # 地图模式选择
            print(f"Using Mapbox API key: {mapbox_api_key}", flush=True)
            if mapbox_api_key and chart_type in ['scatter_map', 'heatmap_map', 'line_map']:
                # 在线Mapbox模式
                if chart_type == 'scatter_map':
                    # 准备颜色参数
                    print(f"Applying color theme to scatter map: {color_theme}", flush=True)
                    print(f"Color sequence: {selected_color_sequence}", flush=True)
                    
                    map_color_args = {}
                    color_col = color_column if color_column else y_axis_list[0] if y_axis_list else None
                    if color_col:
                        print(f"Using color column: {color_col}", flush=True)
                        map_color_args['color'] = color_col
                        
                        # 强制更新颜色映射
                        if pd.api.types.is_numeric_dtype(plot_df[color_col]):
                            print("Applying continuous color scale", flush=True)
                            map_color_args['color_continuous_scale'] = selected_color_sequence
                            map_color_args['color_continuous_midpoint'] = plot_df[color_col].median()
                        else:
                            print("Applying discrete color sequence", flush=True)
                            map_color_args['color_discrete_sequence'] = selected_color_sequence
                            # 为分类变量创建明确的颜色映射
                            unique_values = plot_df[color_col].dropna().unique()
                            color_map = {val: selected_color_sequence[i % len(selected_color_sequence)] 
                                        for i, val in enumerate(unique_values)}
                            map_color_args['color_discrete_map'] = color_map
                    
                    fig = px.scatter_mapbox(
                        plot_df,
                        lat=latitude_col,
                        lon=longitude_col,
                        size=size_column if size_column else None,
                        opacity=scatter_opacity,
                        zoom=map_zoom if map_zoom else default_zoom,
                        mapbox_style=map_theme if map_theme else default_style,
                        height=600,
                        **map_color_args
                    )
                    
                    # 强制应用颜色主题
                    if color_col:
                        print("Verifying color application...", flush=True)
                        for trace in fig.data:
                            if hasattr(trace, 'marker'):
                                if 'color' in map_color_args:
                                    if pd.api.types.is_numeric_dtype(plot_df[color_col]):
                                        print("Enforcing continuous color scale", flush=True)
                                        trace.marker.colorscale = selected_color_sequence
                                    else:
                                        print("Enforcing discrete color mapping", flush=True)
                                        # 对于大量唯一值，使用哈希算法分配颜色确保分布均匀
                                        unique_values = plot_df[color_col].unique()
                                        if len(unique_values) > 50:  # 大量唯一值时使用哈希分配
                                            print(f"Using hash-based color mapping for {len(unique_values)} unique values", flush=True)
                                            color_map = {
                                                val: selected_color_sequence[hash(str(val)) % len(selected_color_sequence)]
                                                for val in unique_values
                                            }
                                        else:  # 少量唯一值时顺序分配
                                            color_map = {
                                                val: selected_color_sequence[i % len(selected_color_sequence)]
                                                for i, val in enumerate(unique_values)
                                            }
                                        trace.marker.color = plot_df[color_col].map(color_map)
                        print("Color theme enforcement complete", flush=True)
                elif chart_type == 'heatmap_map':
                    if province_col and province_col in plot_df.columns:
                        # 点密度热力图模式 -- 省市区数据模式
                        # 准备热力图颜色参数
                        density_colorscale = []
                        if color_theme == 'custom' and custom_color_scale:
                            density_colorscale = custom_color_scale
                        else:
                            density_colorscale = selected_color_sequence
                        
                        fig = go.Figure(go.Densitymapbox(
                            lat=plot_df[latitude_col],
                            lon=plot_df[longitude_col],
                            radius=heatmap_radius + plot_df[size_column] * 0.01 if size_column else heatmap_radius,
                            opacity=scatter_opacity,
                            z=[1]*len(plot_df),  # 使用统一权重
                            hovertext=plot_df[province_col] if province_col else None,
                            colorscale=density_colorscale
                        ))
                        fig.update_layout(
                            mapbox_style=map_theme if map_theme else "carto-positron",
                            mapbox_zoom=map_zoom if map_zoom else 5,
                            height=800
                        )
                    else:
                        # 点密度热力图模式 -- 经纬度数据模式
                        # 准备热力图颜色参数
                        density_colorscale = []
                        if color_theme == 'custom' and custom_color_scale:
                            density_colorscale = custom_color_scale
                        else:
                            density_colorscale = selected_color_sequence
                        
                        fig = go.Figure(go.Densitymapbox(
                            lat=plot_df[latitude_col],
                            lon=plot_df[longitude_col],
                            radius=heatmap_radius + plot_df[size_column] * 0.01 if size_column else heatmap_radius,
                            opacity=scatter_opacity,
                            z=[1]*len(plot_df),  # 使用统一权重
                            hovertext=plot_df[province_col] if province_col else None,
                            colorscale=density_colorscale
                        ))
                        fig.update_layout(
                            mapbox_style=map_theme if map_theme else "carto-positron",
                            mapbox_zoom=map_zoom if map_zoom else 5,
                            height=800
                        )
                elif chart_type == 'line_map':
                    fig = px.line_mapbox(
                        plot_df,
                        lat=latitude_col,
                        lon=longitude_col,
                        color=color_column if color_column else None,
                        zoom=map_zoom if map_zoom else default_zoom,
                        mapbox_style=map_theme if map_theme else default_style,
                        height=600
                    )
                fig.update_layout(mapbox_accesstoken=mapbox_api_key)
                fig.update_layout(mapbox_center={'lat': plot_df[latitude_col].mean(), 'lon': plot_df[longitude_col].mean()})
                fig.update_layout(margin={'r': 0, 't': 0, 'l': 0, 'b': 0})
            else:
                # 离线模式
                if chart_type == 'scatter_map':
                    fig = px.scatter_geo(
                        plot_df,
                        lat=latitude_col,
                        lon=longitude_col,
                        color=color_column if color_column else y_axis_list[0] if y_axis_list else None,
                        size=size_column if size_column else None,
                        opacity=scatter_opacity,
                        projection="natural earth",
                        scope="asia"
                    )
                elif chart_type == 'heatmap_map':
                    fig = go.Figure(go.Densitymapbox(
                        lat=plot_df[latitude_col],
                        lon=plot_df[longitude_col],
                        z=plot_df[y_axis_list[0]] if y_axis_list else None,
                        radius=20
                    ))
                    fig.update_geos(
                        projection_type="natural earth",
                        scope="asia"
                    )
                elif chart_type == 'line_map':
                    fig = px.line_geo(
                        plot_df,
                        lat=latitude_col,
                        lon=longitude_col,
                        color=color_column if color_column else None,
                        projection="natural earth",
                        scope="asia"
                    )

                fig.update_geos(
                    center={'lat': plot_df[latitude_col].mean(), 'lon': plot_df[longitude_col].mean()},
                    showcountries=True,
                    countrycolor="Black",
                    showsubunits=True,
                    subunitcolor="Blue"
                )
                fig.update_layout(margin={'r': 0, 't': 0, 'l': 0, 'b': 0})

        print(f"Figure object created: Type={type(fig)}", flush=True)

        # --- 添加均值/中位数线 ---
        if chart_type in ['line', 'bar', 'area'] and fig and (show_mean or show_median) and y_axis_list:
             print(f"Attempting to add mean/median lines for {chart_type}...", flush=True)
             data_for_stats = df_original if 'df_original' in locals() else df
             print(f"  Using data source for stats: {'df_original' if data_for_stats is df_original else 'plot_df'} (rows: {len(data_for_stats)})")

             for idx, y_col in enumerate(y_axis_list):
                 if y_col in data_for_stats and pd.api.types.is_numeric_dtype(data_for_stats[y_col]):
                     numeric_col_data = data_for_stats[y_col].dropna()
                     if not numeric_col_data.empty:
                         mean_val = numeric_col_data.mean()
                         median_val = numeric_col_data.median()
                         line_color = selected_color_sequence[idx % len(selected_color_sequence)] # 从序列获取颜色
                         if show_mean and pd.notna(mean_val):
                             fig.add_hline(y=mean_val, line_dash="dash", line_color=line_color,
                                           annotation_text=f"{y_col} Mean value: {mean_val:.2f}", annotation_position="bottom right", annotation_font_color=line_color)
                         if show_median and pd.notna(median_val):
                             fig.add_hline(y=median_val, line_dash="dot", line_color=line_color,
                                           annotation_text=f"{y_col} Median value: {median_val:.2f}", annotation_position="top right", annotation_font_color=line_color)
                     else: print(f"    Column '{y_col}' has only NaNs. Skipping lines.")
                 else: print(f"    Column '{y_col}' not found or not numeric. Skipping lines.")

        #todo --- 更新布局（公共部分）---
        if fig:
            print("Figure exists, updating layout...", flush=True)

            # 确定标题
            default_title_base = f"{chart_type.capitalize()} Chart"
            final_chart_title = chart_title if chart_title else f"{default_title_base}{aggregation_info}{sampling_info}"

            # 处理 X 轴标题
            final_x_title = x_axis_title_input
            if not final_x_title:
                if chart_type == 'treemap' and isinstance(x_axis, list): final_x_title = ' / '.join(map(str, x_axis))
                elif x_axis: final_x_title = str(x_axis)
                elif chart_type == 'heatmap' and not pivot_success: final_x_title = 'variable'
                else: final_x_title = ''

            # 处理 Y 轴标题
            final_y_title = y_axis_title_input
            if not final_y_title:
                if chart_type == 'pie': final_y_title = ''
                elif chart_type == 'heatmap': final_y_title = (str(y_axis_list[0]) if y_axis_list else 'Y') if pivot_success else 'variable'
                elif chart_type == 'treemap': final_y_title = ''
                elif not y_axis_list: final_y_title = ''
                elif len(y_axis_list) > 1: final_y_title = "value"
                elif y_axis_list: final_y_title = str(y_axis_list[0])
                else: final_y_title = ''

            # 图例配置
            legend_config = {'orientation': 'v', 'traceorder': 'normal'}
            show_legend_flag = True
            # 根据纸张背景设置图例背景以保证可见性
            if final_paper_bgcolor and final_paper_bgcolor != 'rgba(0,0,0,0)':
                 is_dark_bg = final_paper_bgcolor.startswith('#') and int(final_paper_bgcolor[1:3], 16) < 128 # 简单判断是否深色
                 legend_config['bgcolor'] = 'rgba(255,255,255,0.6)' if not is_dark_bg else 'rgba(50,50,50,0.6)' # 深色背景用浅色图例背景，反之亦然
            else: legend_config['bgcolor'] = 'rgba(255,255,255,0.6)' # 透明或默认背景用浅色

            if legend_pos_key == 'hidden' or chart_type in ['pie', 'heatmap']:
                show_legend_flag = False
            # 不再根据 Y 轴数量自动隐藏图例，让用户通过 'hidden' 决定
            else:
                positions = {
                    'top-right': {'x': 1.02, 'y': 1, 'xanchor': 'left', 'yanchor': 'top'}, 'middle-right': {'x': 1.02, 'y': 0.5, 'xanchor': 'left', 'yanchor': 'middle'},
                    'bottom-right': {'x': 1.02, 'y': 0, 'xanchor': 'left', 'yanchor': 'bottom'}, 'top-left': {'x': -0.05, 'y': 1, 'xanchor': 'right', 'yanchor': 'top'},
                    'middle-left': {'x': -0.05, 'y': 0.5, 'xanchor': 'right', 'yanchor': 'middle'}, 'bottom-left': {'x': -0.05, 'y': 0, 'xanchor': 'right', 'yanchor': 'bottom'},
                    'top-center': {'x': 0.5, 'y': 1.05, 'xanchor': 'center', 'yanchor': 'bottom', 'orientation': 'h'}, 'bottom-center': {'x': 0.5, 'y': -0.15, 'xanchor': 'center', 'yanchor': 'top', 'orientation': 'h'}
                }
                selected_pos = positions.get(legend_pos_key, positions['top-right'])
                legend_config.update(selected_pos)

            print(f"Updating layout. Show legend: {show_legend_flag}, Config: {legend_config}", flush=True)

            # --- 计算自适应网格线颜色 ---
            def calculate_gridline_color(bg_color):
                """根据背景颜色计算合适的网格线颜色"""
                if not bg_color or bg_color == 'rgba(0,0,0,0)':
                    return 'rgba(128,128,128,0.3)'  # 透明背景使用中性灰色
                
                try:
                    if bg_color.startswith('rgba'):
                        # 解析rgba颜色
                        rgba = bg_color[5:-1].split(',')
                        r, g, b = map(float, rgba[:3])
                    elif bg_color.startswith('rgb'):
                        # 解析rgb颜色
                        rgb = bg_color[4:-1].split(',')
                        r, g, b = map(float, rgb[:3])
                    elif bg_color.startswith('#'):
                        # 解析hex颜色
                        hex_color = bg_color.lstrip('#')
                        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
                    else:
                        return 'rgba(128,128,128,0.3)'  # 未知格式使用中性灰色
                    
                    # 计算亮度 (0-1)
                    brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                    
                    # 根据亮度返回对比色
                    return 'rgba(255,255,255,0.3)' if brightness < 0.5 else 'rgba(0,0,0,0.3)'
                except:
                    return 'rgba(128,128,128,0.3)'  # 解析失败使用中性灰色

            grid_color = calculate_gridline_color(final_plot_bgcolor) if grid_lines else None
            
            # --- 应用最终布局 ---
            fig.update_layout(
                title={'text': final_chart_title, 'x': 0.5, 'xanchor': 'center'},
                xaxis_title_text=final_x_title,
                yaxis_title_text=final_y_title,
                xaxis_showgrid=grid_lines,
                yaxis_showgrid=grid_lines,
                xaxis_gridcolor=grid_color,
                yaxis_gridcolor=grid_color,
                legend=legend_config,
                showlegend=show_legend_flag,
                # 根据背景色选择基础模板，但颜色会被覆盖
                template='plotly_white' if not final_plot_bgcolor or not (final_plot_bgcolor.startswith('#') and int(final_plot_bgcolor[1:3], 16) < 128) else 'plotly_dark',
                transition_duration=300,
                hovermode='closest',
                # *** 应用背景颜色 ***
                plot_bgcolor=final_plot_bgcolor,
                paper_bgcolor=final_paper_bgcolor,
                margin=dict(l=70, r=70, t=80, b=70) # 增加边距
            )

            # 特定图表的布局调整
            if chart_type == 'heatmap':
                fig.update_layout(xaxis={'side': 'bottom'})
                fig.update_traces(xgap=1, ygap=1) # 热力图单元格间隙

            if chart_type == 'bar':
                 # 检查 X 轴类别数量决定是否旋转标签
                 df_to_check_ticks = aggregated_df if aggregation_applied else plot_df
                 if x_axis in df_to_check_ticks and df_to_check_ticks[x_axis].nunique() > 20:
                     fig.update_layout(xaxis_tickangle=-45)

            # Treemap 边距已在创建时调整过，这里无需重复

            print("Layout updated successfully. Returning figure.", flush=True)
            return fig, graph_style
        else:
             # 如果 fig 仍然是 None，抛出错误
             print("Figure object is None after chart creation block - Raising ValueError", flush=True)
             error_fig_internal = go.Figure(layout={'title': 'Internal error: Chart object missing'})
             final_plot_bgcolor, final_paper_bgcolor = get_background_colors(bg_color_select, custom_bg_color) # 获取颜色
             error_fig_internal.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor) # 应用背景
             return error_fig_internal, graph_style

    # --- 图表生成过程中的异常处理 ---
    except Exception as e:
        print(f"\n\n!!! EXCEPTION CAUGHT during chart generation: Type={type(e)} !!!", flush=True)
        print(f"!!! Error: {e} !!!", flush=True)
        print("!!! Traceback: !!!", flush=True)
        traceback.print_exc()
        print("!!! END TRACEBACK !!!\n\n", flush=True)
        # 返回显示错误信息的图表
        error_fig = cleanup_fig
        error_fig.add_annotation(
            text=f'Error: {str(e)[:200]}...',
            showarrow=False,
            font={'size': 14, 'color': '#FD763F'},
            xref='paper', yref='paper', x=0.5, y=0.5
        )
        # 应用背景色到主错误图表
        error_fig.update_layout(plot_bgcolor=final_plot_bgcolor, paper_bgcolor=final_paper_bgcolor)
        return error_fig, graph_style
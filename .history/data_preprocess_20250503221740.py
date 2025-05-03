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
import traceback
from scipy import stats

def parse_contents(contents, filename):
    """Parse uploaded file contents into DataFrame"""
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'csv' in filename:
            # Assume that the user uploaded a CSV file
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
        elif 'xls' in filename:
            # Assume that the user uploaded an excel file
            df = pd.read_excel(io.BytesIO(decoded))
        elif 'json' in filename:
            # Assume that the user uploaded a JSON file
            df = pd.read_json(io.StringIO(decoded.decode('utf-8')))
        else:
            return None, f"Unsupported file types: {filename}"
            
        # Basic data cleaning
        df = df.dropna(how='all')  # Drop empty rows
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]  # Drop unnamed columns
        
        return df, f"Successfully uploaded file: {filename}"
        
    except Exception as e:
        print(traceback.format_exc())
        return None, f"Error processing file: {str(e)}"

# --- Layout Definition ---
data_preprocessing_layout = html.Div([
    # Floating Home button
    html.Div(children=[
        # Home button
        dbc.Button(
            "Home",
            href="/",
            id="home-btn",
            className="me-1 btn-animated",
        ),

        # To the top button
        dbc.Button(
            "To top",
            href="#top",
            className="me-1  btn-animated",
            id='back-to-top-btn',
            style={
                'position': 'fixed',
                'zIndex': '1000',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.2)',
                'border-radius': '16px',
                'cursor': 'pointer',
                'transition': '0.3s',
            }
        ),

        dbc.Container([
            # --- Top Header Row ---
            dbc.Row([
                dbc.Col([
                    html.H1("Fuck-Charts", className="text-center mb-2 d-inline-block dynamic-gradient-text"),
                    html.H6([
                        "---------- ",  # 左侧破折号保持原样
                        "",
                        html.Span("TiiJeiJ8", className="dynamic-gradient-text"),  # 渐变部分
                        " ----------"   # 右侧破折号
                    ], className="text-center mb-2 text-light d-inline", style={'margin-top': 'auto'})
                ], id='top-header-title', width=4, style={'flex-direction': 'column', 'justify-content': 'flex-end'}),
                dbc.Col([
                    html.Button(
                        'Data Visualizing', id='data-visualization-button', className="btn btn-primary btn-animated", disabled=False,
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
                            dbc.DropdownMenuItem("Data Preprocessing", id="data-preprocess-btn", href='/data-preprocessing', disabled=True),
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
        ])
    ]),
    
    # Data stores
    dcc.Store(id='preprocess-data-store'),
    dcc.Store(id='preprocess-data-info-store'),
    dcc.Store(id='preprocess-analysis-results'),  # New store for analysis results

    dbc.Container([
        # Header and controls...
        
        # Main content
        dbc.Row([
            # Sidebar with new analysis options
            dbc.Col([
                # Existing sidebar cards...
                
                # New Analysis Card
                dbc.Card([
                    dbc.CardHeader(html.H4("Data Upload", className="text-info")),
                    dbc.CardBody([
                        dcc.Upload(
                            id='upload-data',
                            children=html.Div(['Drag or  ', html.A('Select', className="text-primary")]),
                            style={
                                'width': '100%', 
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
                            multiple=False,
                            accept='.csv, .xlsx, .json'
                        ),
                                html.Div(id='upload-status', style={
                                    'marginTop': '10px',
                                    'color': '#666', 
                                    'fontSize': '14px'
                                }),
                                html.Div(id='data-summary-info', className="mb-2"),
                        # dbc.Button("缺失值分析", id="missing-analysis-btn", color="secondary", className="w-100 mb-2"),
                        # dbc.Button("异常值检测", id="outlier-detection-btn", color="secondary", className="w-100")
                    ]),
                    dbc.Tooltip('Upload your data file in CSV, Excel or JSON format', target='upload-data'),
                ], className="mb-4 shadow"),
                
                # New Preprocessing Card
                # dbc.Card([
                #     dbc.CardHeader(html.H4("数据预处理", className="text-info")),
                #     dbc.CardBody([
                #         dbc.Button("数据清洗", id="data-cleaning-btn", color="warning", className="w-100 mb-2", 
                #             disabled=True, title="功能开发中"),
                #         dbc.Button("数据转换", id="data-transform-btn", color="warning", className="w-100 mb-2"),
                #         dbc.Button("数据合并", id="data-merge-btn", color="warning", className="w-100 mb-2"),
                #     ])
                # ], className="mb-4 shadow")
            ], width="auto", style={'position': 'sticky', 'top': '150px', 'alignSelf': 'flex-start'}),
            
            # Main content area with new analysis tabs
            dbc.Col([
                dbc.Tabs([
                    dbc.Tab(label="Analysis report", tab_id="analysis"),
                    dbc.Tab(label="Data cleaning", tab_id="visualization"),
                ], id="analysis-tabs", active_tab="visualization"),
                
                html.Div(id="analysis-tab-content")
            ], style={"height": "50rem"})
        ]),
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

@callback(
    Output('url', 'pathname'),
    [Input('data-visualization-button', 'n_clicks')],
    [dash.dependencies.State('url', 'pathname')]
)
def update_url(n_clicks, current_pathname):
    if n_clicks is not None:
        return '/chart-visualizations'
    return current_pathname

# Callback for missing value handling
@callback(
    Output('preprocess-data-store', 'data'),
    Input('apply-cleaning-btn', 'n_clicks'),
    State('missing-values-strategy', 'value'),
    State('preprocess-data-store', 'data'),
    prevent_initial_call=True
)
def handle_missing_values(n_clicks, strategy, stored_data):
    if n_clicks is None or stored_data is None:
        return no_update
    
    df = pd.read_json(io.StringIO(stored_data), orient='split')
    df = preprocess_handle_missing_values(df, strategy)
    
    json_buffer = io.StringIO()
    df.to_json(json_buffer, date_format='iso', orient='split')
    return json_buffer.getvalue()

# New callback for handling data upload
@callback(
    [Output('shared-data-store', 'data'),
     Output('shared-data-info-store', 'data'),
     Output('upload-status', 'children', allow_duplicate=True)],
    Input('upload-data', 'contents'),
    State('upload-data', 'filename'),
    prevent_initial_call=True
)
def preprocess_handle_upload(contents, filename):
    if contents is None:
        return no_update, no_update, no_update
        
    df, status_msg = parse_contents(contents, filename)
    
    if df is None:
        return no_update, no_update, html.Div(status_msg, className="text-danger")
        
    # Store data and info
    json_buffer = io.StringIO()
    df.to_json(json_buffer, date_format='iso', orient='split')
    data_store_content = json_buffer.getvalue()
    data_info = {'filename': filename, 'rows': len(df), 'cols': len(df.columns), 'source': 'preprocess'}
    
    return data_store_content, data_info, html.Div(status_msg, className="text-success")

# Modified main callback with independent data flow
@callback(
    Output('analysis-tab-content', 'children'),
    Input('analysis-tabs', 'active_tab'),
    Input('shared-data-store', 'data'),
    State('shared-data-info-store', 'data'),
    prevent_initial_call=True
)
def preprocess_handle_data_operations(active_tab, data_store_data, data_info):
    if not data_store_data or data_info.get('source') != 'preprocess':
        return no_update
        
    df = pd.read_json(io.StringIO(data_store_data), orient='split')
    
    if active_tab == "visualization":
        return preprocess_create_dashboard(df)
    elif active_tab == "analysis":
        report = {
            'overview': {
                'rows': len(df),
                'columns': len(df.columns),
                'numeric_cols': df.select_dtypes(include=np.number).columns.tolist(),
                'categorical_cols': df.select_dtypes(include=['object', 'category']).columns.tolist(),
                'date_cols': df.select_dtypes(include='datetime').columns.tolist()
            },
            'missing_values': df.isnull().sum().to_dict(),
            'descriptive_stats': df.describe().to_dict() if not df.select_dtypes(include=np.number).empty else {}
        }
        return render_analysis_report(report)
    
    return no_update

def render_analysis_report(report):
    """生成数据分析报告，结合文本和图表展示"""
    
    # 数据集概览部分 - 使用卡片布局
    overview_card = dbc.Card([
        dbc.CardHeader("数据集概览", className="bg-primary text-white"),
        dbc.CardBody([
            dbc.Row([
                dbc.Col([
                    html.Div([
                        html.H5("Dataset Overview", className="card-title mb-4 text-primary"),
                        html.Div([
                            html.P("Total Rows:", className="font-weight-bold"),
                            html.P(f"{report['overview']['rows']}", className="text-muted"),
                            html.P("Total Columns:", className="font-weight-bold mt-2"),
                            html.P(f"{report['overview']['columns']}", className="text-muted"),
                            html.P("Number of Numeric Columns:", className="font-weight-bold mt-2"),
                            html.P(f"{len(report['overview']['numeric_cols'])}", className="text-muted"),
                            html.P("Number of Categorical Columns:", className="font-weight-bold mt-2"),
                            html.P(f"{len(report['overview']['categorical_cols'])}", className="text-muted"),
                            html.P("Number of Date Columns:", className="font-weight-bold mt-2"),
                            html.P(f"{len(report['overview']['date_cols'])}", className="text-muted"),
                        ], style={'lineHeight': '1.8', 'color': '#333'})
                    ], className="mb-4", style={'padding': '20px', 'border': '1px solid #ddd', 'borderRadius': '5px'})
                ], width=6),
                dbc.Col([
                    html.H5("Column Type Explanation", className="card-title mb-4 text-primary"),
                    html.Div([
                        html.P("Numeric Columns (Supports Mathematical Operations):", className="font-weight-bold mb-1"),
                        html.P(", ".join(report['overview']['numeric_cols'] or ['None']), className="mb-3"),
                        html.P("Categorical Columns (Text or Categorical Data):", className="font-weight-bold mb-1"),
                        html.P(", ".join(report['overview']['categorical_cols'] or ['None']), className="mb-3"),
                        html.P("Date Columns (Time Data):", className="font-weight-bold mb-1"),
                        html.P(", ".join(report['overview']['date_cols'] or ['None']), className="mb-3")
                    ], style={'lineHeight': '3.5', 'color': '#333'})
                ], width=6, style={'padding': '20px', 'border': '1px solid #ddd', 'borderRadius': '5px'})
            ])
        ])
    ], className="mb-4")

    # 缺失值统计 - 使用柱状图展示
    missing_fig = px.bar(
    x=list(report['missing_values'].keys()),
    y=list(report['missing_values'].values()),
    labels={'x': 'Column Name', 'y': 'Number of Missing Values'},
    title="Missing Values Count by Column",
    color=list(report['missing_values'].values()),
    color_continuous_scale='Blues'
    )
    missing_fig.update_layout(showlegend=False)

    missing_card = dbc.Card([
        dbc.CardHeader("Missing Values Statistics", className="bg-info text-white"),
        dbc.CardBody([
            dcc.Graph(figure=missing_fig),
            html.Div([
                html.P("Column with the Most Missing Values:", className="font-weight-bold"),
                html.P(max(report['missing_values'].items(), key=lambda x: x[1])[0] if report['missing_values'] else "None")
            ], className="mt-3")
        ])
    ], className="mb-4")

    # 描述性统计 - 使用表格和图表结合
    stats_content = []
    if report['descriptive_stats']:
        for col, stats in report['descriptive_stats'].items():
            # 为每个数值列创建箱线图
            fig = px.box(
                x=[stats.get('min', 0), stats.get('25%', 0), stats.get('50%', 0), 
                   stats.get('75%', 0), stats.get('max', 0)],
                points=False,
                title=f"{col} Data Distribution"
            )
            fig.update_layout(showlegend=False, height=300)
            
            stats_content.append(dbc.Card([
                dbc.CardHeader(col, className="bg-success text-white"),
                dbc.CardBody([
                    dbc.Row([
                        dbc.Col([
                            html.Div([
                                html.P(f"Non-null Count: {stats.get('count', 'N/A')}"),
                                html.P(f"Mean: {stats.get('mean', 'N/A'):.2f}"),
                                html.P(f"Standard Deviation: {stats.get('std', 'N/A'):.2f}"),
                                html.P(f"Min: {stats.get('min', 'N/A')}"),
                                html.P(f"25th Percentile: {stats.get('25%', 'N/A')}"),
                                html.P(f"Median: {stats.get('50%', 'N/A')}"),
                                html.P(f"75th Percentile: {stats.get('75%', 'N/A')}"),
                                html.P(f"Max: {stats.get('max', 'N/A')}")
                            ])
                        ], width=4),
                        dbc.Col([
                            dcc.Graph(figure=fig)
                        ], width=8)
                    ])
                ])
            ], className="mb-3"))
    else:
        stats_content.append(html.P("No numerical column data"))

    stats_card = dbc.Card([
        dbc.CardHeader("Descriptive statistics (numerical column)", className="bg-warning text-dark"),
        dbc.CardBody(stats_content)
    ])

    return dbc.Container([
        overview_card,
        missing_card,
        stats_card
    ], fluid=True)

def preprocess_handle_missing_values(df, strategy='mean'):
    """Handle missing values with specified strategy for different column types"""
    df = df.copy()
    
    for col in df.columns:
        if df[col].isnull().sum() > 0:  # Only process columns with missing values
            if pd.api.types.is_numeric_dtype(df[col]):
                if strategy == 'mean':
                    df[col] = df[col].fillna(df[col].mean())
                elif strategy == 'median':
                    df[col] = df[col].fillna(df[col].median())
                elif strategy == 'drop':
                    df = df.dropna(subset=[col])
                else:  # custom value
                    df[col] = df[col].fillna(strategy)
            else:  # For non-numeric columns
                if strategy == 'drop':
                    df = df.dropna(subset=[col])
                else:  # Use mode (most frequent value) for categorical data
                    df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else '')
    
    return df

def preprocess_detect_outliers(df, threshold=3):
    """Detect outliers using z-score"""
    z_scores = stats.zscore(df.select_dtypes(include=np.number))
    return (np.abs(z_scores) > threshold)

def preprocess_clean_data(df):
    """Perform comprehensive data cleaning"""
    # Handle missing values
    df = preprocess_handle_missing_values(df)
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Convert date columns with more robust detection
    for col in df.columns:
        if df[col].dtype == 'object':
            # Try to parse as datetime with multiple common formats
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True, errors='ignore')
                if df[col].dtype == 'datetime64[ns]':
                    continue  # Successfully converted to datetime
                
                # Try with specific common formats
                for fmt in ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y%m%d']:
                    try:
                        df[col] = pd.to_datetime(df[col], format=fmt, errors='raise')
                        break
                    except:
                        continue
            except:
                pass
            try:
                df[col] = pd.to_datetime(df[col])
            except:
                pass
    return df

# Preprocessing Dashboard Components
def preprocess_create_dashboard(df):
    """Create interactive preprocessing dashboard"""
    cleaned_df = preprocess_clean_data(df)
    
    return dbc.Container([
        dbc.Row([
            dbc.Col([
                dbc.Card([
                    dbc.CardHeader("Data Summary"),
                    dbc.CardBody([
                        html.P(f"Rows: {len(df)}"),
                        html.P(f"Columns: {len(df.columns)}"),
                        html.P(f"Missing Values: {df.isnull().sum().sum()}"),
                    ])
                ])
            ], width=4),
            
            dbc.Col([
                dbc.Card([
                    dbc.CardHeader("Missing Values Analysis"),
                    dbc.CardBody(
                        dcc.Graph(
                            figure=px.bar(
                                x=df.isnull().sum().index,
                                y=df.isnull().sum().values,
                                labels={'x': 'Columns', 'y': 'Missing Values'}
                            )
                        )
                    )
                ])
            ], width=8)
        ]),
        
        # dbc.Row([
        #     dbc.Col([
        #         dbc.Card([
        #             dbc.CardHeader("Data Cleaning Controls"),
        #             dbc.CardBody([
        #                 dbc.Label("缺失值处理策略:"),
        #                 dcc.Dropdown(
        #                     id='missing-values-strategy', 
        #                     options=[
        #                         {'label': '均值填充', 'value': 'mean'},
        #                         {'label': '中位数填充', 'value': 'median'}, 
        #                         {'label': '删除缺失行', 'value': 'drop'}
        #                     ],
        #                     value='mean'
        #                 ),
        #                 dbc.Button("Apply Cleaning", 
        #                           id="apply-cleaning-btn",
        #                           color="primary",
        #                           className="mt-3")
        #             ])
        #         ])
        #     ], width=12)
        # ])
    ])
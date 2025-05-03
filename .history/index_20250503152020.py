from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

index_layout = dbc.Container(fluid=True, className='quantum-interface', children=[
        # app.py 主结构
    import dash
    from dash import html, dcc, callback, Input, Output
    import dash_bootstrap_components as dbc

    app = dash.Dash(__name__, external_stylesheets=[dbc.themes.DARKLY])
    app.title = "Fuck-Charts // Data Terminal"

    app.layout = dbc.Container(fluid=True, className="quantum-interface", children=[
        # 控制中枢
    html.Div(className="control-hub", children=[
        dbc.ButtonGroup([
            dbc.Button("⟳ 重置矩阵", id="reset-btn", className="hud-button"),
            dbc.Button("⚡ 能量注入", id="energy-btn", className="hud-button"),
            dbc.Button("⊞ 维度展开", id="dimension-btn", className="hud-button")
        ])
    ]),
    
    # 数据平面
    dcc.Graph(
        id='main-canvas',
        config={'displayModeBar': False},
        className="holo-display",
        style={'height': '75vh'}
    ),
    
    # 隐形组件
    dcc.Store(id='session-memory'),
    dcc.Interval(id='pulse-trigger', interval=1500)
])

    # html.Title("Fuck-Charts"),

    # html.H1(children='Welcome to Home page'),
    # html.Div(children='''
    #     Choose one of the following options to proceed:
    # '''),
    # dbc.Button('Go to Chart Visualizations', href='/chart-visualizations'),
    # html.Br(),
    # dbc.Button('Go to Data Reprocessing', href='/data-preprocessing'),
    # html.Br(),
    # dbc.Button('Go to Data Clustering', href='/data-clustering'),
    # html.Br(),
    # dbc.Button('Go to Data Modeling', href='/data-modeling'),
    # html.Br(),
    # dbc.Button('Go to About ME', href='https://tiijeij8.github.io/'),
])
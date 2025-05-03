from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

# 创建主题切换组件，支持浅色（SPACELAB）和深色（DARKLY）主题
theme_switch = ThemeSwitchAIO(
    aio_id="theme",
    themes=[dbc.themes.SPACELAB, dbc.themes.DARKLY],
    switch_props={
        "persistence": True,          # 启用状态持久化
        "persistence_type": "local"    # 使用 localStorage 保存用户选择
    }
)

index_layout = html.Div(children=[
    html.Title("Fuck-Charts"),

    html.Div(theme_switch, style={'position': 'absolute', 'right': '20px', 'top': '10px'}),
    html.H1(children='Welcome to Home page'),
    html.Div(children='''
        Choose one of the following options to proceed:
    '''),
    dbc.Button('Go to Chart Visualizations', href='/chart-visualizations'),
    html.Br(),
    dbc.Button('Go to Data Reprocessing', href='/data-preprocessing'),
    html.Br(),
    dbc.Button('Go to About ME', href='https://tiijeij8.github.io/'),
])
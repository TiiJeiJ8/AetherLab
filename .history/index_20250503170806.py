from dash import html
from dash import dcc
import dash_bootstrap_components as dbc
from dash_bootstrap_components import ThemeSwitchAIO

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
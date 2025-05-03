from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

index_layout = html.Div(children=[
    # html.Title("Fuck-Charts"),

    # html.H1(children='Welcome to Home page'),
    # html.Div(children='''
    #     Choose one of the following options to proceed:
    # '''),
    # dbc.Button('Go to Chart Visualizations', href='/chart-visualizations'),
    # html.Br(),
    # dbc.Button('Go to Data Reprocessing', href='/data-preprocessing'),
    # html.Br(),
    # dbc.Button('Go to About ME', href='https://tiijeij8.github.io/'),
    html.Div(className="cyber-container", children=[
      html.Div(className="hud-overlay"),  # HUD效果层
      dbc.Row([
          dbc.Col(className="control-panel", md=3, children=[
              html.Div(className="terminal-box", children=[
                  html.P("> SYSTEM READY", className="prompt"),
                  dcc.Slider(id='energy', min=0, max=100, 
                           className="quantum-slider")
              ])
          ]),
          dbc.Col(className="visualization-area", md=9, children=[
              dcc.Graph(id='main-canvas', 
                      config={'displayModeBar': False},
                      className="holo-display")
          ])
      ])
])
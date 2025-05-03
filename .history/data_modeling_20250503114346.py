from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

data_modeling_layout = html.Div(children=[
    html.H1(children='Data Modeling'),
    dcc.Markdown(children='''
        Data modeling is the process of creating a model that describes the relationship between variables in a dataset. It is used to make predictions, identify patterns, and make informed decisions.
                 
        The fuction is developing and will be updated soon.
    '''),
])
from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

data_cluster_layout = html.Div(children=[
    html.H1(children='Data Clustering'),
    dcc.Markdown(children='''
        Data clustering is a technique used to group similar data points together. It is often used in data analysis to identify patterns and relationships in the data. In this project, we will use the K-means clustering algorithm to group the data points into clusters.
                 
        The fuction is 
    '''),
])
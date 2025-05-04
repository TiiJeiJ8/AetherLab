import dash
import dash_bootstrap_components as dbc
from dash import html, Input, Output, dcc, callback

from index import index_layout
from chart_visualizations import chart_visualizations_layout
from data_preprocess import data_preprocessing_layout
from data_cluster import data_cluster_layout
from data_modeling import data_modeling_layout
from under_constraction import construction_layout, register_construction_callbacks

app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP, 'assets/CSS/topBar_style.css', 'assets/CSS/btn.css', 'assets/CSS/index_style.css', 'assets/CSS/construction_style.css'],
    external_scripts=['assets/JS/topBar_custom.js', ],
    suppress_callback_exceptions=True,
    title="Fuck-Charts",
    update_title="Updating..."
)

register_construction_callbacks(app)

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])

@app.callback(
    [Output('page-content', 'children'),
     Output('document-title', 'children')],
    [Input('url', 'pathname')]
)
def display_page(pathname):
    if pathname == '/chart-visualizations':
        return chart_visualizations_layout, "Fuck-Charts · Chart Visualizations"
    elif pathname == '/data-preprocessing':
        return data_preprocessing_layout, "Fuck-Charts · Data Preprocessing"
    elif pathname == '/data-clustering':
        return data_cluster_layout, "Fuck-Charts · Data Clustering"
    elif pathname == '/data-modeling':
        return data_modeling_layout, "Fuck-Charts · Data Modeling"
    elif pathname == '/under-constraction':
        return construction_layout, "Fuck-Charts · Under Construction"
    else:
        return index_layout, "Fuck-Charts · Home"

# 添加文档标题组件到主布局
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='document-title', style={'display': 'none'}),
    # Consolidated data stores for all pages
    dcc.Store(id='shared-data-store'),
    dcc.Store(id='shared-data-info-store'),
    html.Div(id='page-content')
])
    
if __name__ == '__main__':
    app.run(debug=True)
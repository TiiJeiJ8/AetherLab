import dash
import dash_bootstrap_components as dbc
from dash import html, Input, Output, dcc, callback

from index import index_layout
from chart_visualizations import chart_visualizations_layout
from data_preprocess import data_preprocessing_layout
from data_cluster import data_cluster_layout
from data_modeling import data_modeling_layout

app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.FONT_AWESOME, 'assets/CSS/topBar_style.css', 'assets/CSS/btn.css'],
    external_scripts=['assets/JS/topBar_custom.js'],
    suppress_callback_exceptions=True,
    title="Fuck-Charts",
    update_title="Updating..."
)

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
    else:
        return index_layout, "Fuck-Charts · Home"

LandDbtn_layout = html.Span(
        [
            dbc.Label('🌙', className='fa', html_for='switch'),
            dbc.Switch(id='switch', value=True, className='d-inline-block ms-1', persistence=True),
            dbc.Label('☀️', className='fa', html_for='switch')
        ]
    ),

app.clientside_callback(
    " " "
    (switchOn) => {
       document.documentElement.setAttribute("data-bs-theme", switchOn ? "light" : "dark");
       return window.dash_clientside.no_update
    }
    " " ",
    Output("switch", "id"),
    Input("switch", "value"),
),

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
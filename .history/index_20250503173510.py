from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

index_layout = html.Div([
    # 动态背景
    html.Div(className="cyber-bg", style={
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'zIndex': -1,
        'background': 'radial-gradient(circle, #0a0a12 0%, #000000 100%)'
    }),
    
    html.Div(className="container py-5", children=[
        html.Title("CyberViz"),
        
        # 动态标题
        html.Div(className="text-center mb-5", children=[
            html.H1("CYBER TERMINAL", className="neon-title", style={'fontSize': '3rem'}),
            html.Div("// DATA VISUALIZATION PLATFORM v2.3.1", 
                    className="text-muted mb-4"),
            html.Div(className="scanline")
        ]),

        # 功能矩阵
        dbc.Row(className="g-4 justify-content-center", children=[
            dbc.Col(lg=4, className="cyber-card", children=[
                html.Div(className="h2 text-center mb-3", children=[
                    html.Span("📊", className="me-2"),
                    "ANALYTICS"
                ]),
                html.P("Advanced visualization toolkit", className="text-muted"),
                dbc.Button("ACCESS →", 
                          href="/chart-visualizations",
                          className="neon-btn mt-3")
            ]),
            
            # 其他卡片...
        ])
    ]),
)
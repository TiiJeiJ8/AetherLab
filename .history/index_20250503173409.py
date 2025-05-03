from dash import html, dcc
import dash_bootstrap_components as dbc

external_stylesheets = [
    dbc.themes.DARKLY,
    'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap'
]

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

    # 内联CSS
    html.Style('''
        .neon-title {
            color: #0ff;
            text-shadow: 0 0 10px #0ff;
            position: relative;
            animation: neonPulse 1.5s infinite;
        }
        
        .cyber-card {
            background: rgba(10, 10, 18, 0.9) !important;
            border: 1px solid #0ff;
            border-radius: 5px;
            padding: 2rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }
        
        .cyber-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
        }
        
        .neon-btn {
            background: none !important;
            border: 2px solid #0ff !important;
            color: #0ff !important;
            position: relative;
            overflow: hidden;
        }
        
        .scanline {
            height: 2px;
            background: linear-gradient(90deg, 
                transparent, #0ff, transparent);
            animation: scan 3s linear infinite;
        }
        
        @keyframes neonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    '''),
    
    # 纯CSS动画脚本
    html.Script('''
        // 卡片入场动画
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.cyber-card');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 200);
            });
            
            // 按钮光效
            document.querySelectorAll('.neon-btn').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    btn.style.background = `
                        radial-gradient(
                            circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px,
                            rgba(0, 255, 255, 0.3),
                            transparent 80%
                        )`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'none';
                });
            });
        });
    ''')
])
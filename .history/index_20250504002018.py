from dash import html
from dash import dcc
import dash_bootstrap_components as dbc
from datetime import datetime 

index_layout = html.Div(
    className="min-vh-100 bg-light",
    children=[
        html.Title("DataViz Suite"),
        
        # 背景小球容器
        html.Div(className="ball",id="animated-balls", style={
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'zIndex': 1,
            'overflow': 'hidden',
            'pointerEvents': 'none'
        }),
        
        # 主容器
        dbc.Container(
            className="py-5",
            style={'position': 'relative', 'zIndex': 0},
            children=[
                #todo 标题区
                html.Div(
                    className="text-center mb-5 animate__animated animate__fadeIn",
                    children=[
                        dbc.Row(
                            children=[
                                html.H1("Fuck-Charts", className="text-center mb-2 d-inline-block dynamic-gradient-text-home"),
                                html.P(
                                    "---- Present by TiiJeiJ8 ----",
                                    className="lead text-muted dynamic-gradient-text-sub",
                                ),
                            ],
                        ),
                    ],
                ),

                #todo 功能卡片
                dbc.Row(
                    className="g-4",
                    children=[
                        #? 数据可视化卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__SlideIn",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="📈",
                                                ),
                                                html.H4(
                                                    "Data Visualization",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Interactive charts",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/chart-visualizations",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),

                        #? 数据预处理卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__FadeIn_sI",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="🔍",
                                                ),
                                                html.H4(
                                                    "Data Preprocessing 🚧",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Explore, analyze and preprocess data",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/data-preprocessing",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),
                        
                        #? 数据聚类卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__SlideIn_r",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="🥜",
                                                ),
                                                html.H4(
                                                    "Data Clustering 🚧",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Data clustering and visualization",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Developing",
                                                    href="/data-clustering",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),

                        #? 数学建模卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__SlideIn",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="✏️",
                                                ),
                                                html.H4(
                                                    "Math Modeling 🚧",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Data modeling and analysis",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Developing",
                                                    href="/data-modeling",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),

                        #? 配色网站卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__FadeIn_sI",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="🎨",
                                                ),
                                                html.H4(
                                                    "Color Palette",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Trend color palette",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="https://coolors.co/palettes/trending",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                    external_link=True,
                                                    target="_blank",
                                                    rel="noopener noreferrer"
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),

                        #? AboutME卡片
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card animate__SlideIn_r",
                                    children=[
                                        dbc.CardBody(
                                            className="text-center",
                                            children=[
                                                html.Div(
                                                    className="text-primary mb-3",
                                                    style={"fontSize": "2.5rem"},
                                                    children="🫣",
                                                ),
                                                html.H4(
                                                    "About Me",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Learn more about me ¯\_(ツ)_/¯",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="https://tiijeij8.github.io",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2 btn-animated hover-button",
                                                    external_link=True,
                                                    target="_blank",
                                                    rel="noopener noreferrer"
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),
                    ],
                ),

                # 空白区
                html.Div(className="my-5", style={"height": "10vh"}),

                # 页脚
                html.Footer(
                    className="text-center text-muted p-3 mt-4 border-top",
                    children=f"Fuck Charts © {datetime.now().year} - TiiJeiJ8"
                )
            ],
        ),
])
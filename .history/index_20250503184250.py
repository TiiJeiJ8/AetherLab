from dash import html
from dash import dcc
import dash_bootstrap_components as dbc
from datetime import datetime 

index_layout = html.Div(
    className="min-vh-100 bg-light",
    children=[
        html.Title("DataViz Suite"),
        
        # 主容器
        dbc.Container(
            className="py-5",
            children=[
                #todo 标题区
                html.Div(
                    className="text-center mb-5 animate__animated animate__fadeIn",
                    children=[
                        html.H1(
                            "Fuck Charts",
                            className="display-4 mb-3 text-primary fw-bold",
                        ),
                        html.P(
                            "----Present by TiiJeiJ8----",
                            className="lead text-muted",
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
                                                    "Visual Analytics",
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
                                                    className="mt-3 px-4 py-2",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),

                        #? 数据分析卡片
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
                                                    "Data Analysis",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Explore and analyze data",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/data-preprocessing",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2",
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
                                                    "Data Clustering (🚧)",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Data clustering and visualization",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/chart-visualizations",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2",
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
                                                    "Math Modeling (🚧)",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Interactive charts and dashboards",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/data-modeling",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),
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
                                                    children="📊",
                                                ),
                                                html.H4(
                                                    "Visual Analytics",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Interactive charts and dashboards",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/chart-visualizations",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),
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
                                                    children="📊",
                                                ),
                                                html.H4(
                                                    "Visual Analytics",
                                                    className="card-title mb-3",
                                                ),
                                                html.P(
                                                    "Interactive charts and dashboards",
                                                    className="text-muted",
                                                ),
                                                dbc.Button(
                                                    "Explore",
                                                    href="/chart-visualizations",
                                                    color="primary",
                                                    className="mt-3 px-4 py-2",
                                                ),
                                            ],
                                        )
                                    ],
                                )
                            ],
                        ),
                    ],
                ),

                # 页脚
                html.Footer(
                    html.Footer(f"Fuck Charts © {datetime.now().year} - TiiJeiJ8", className="text-center text-muted p-3 mt-4 border-top"),
                ),
            ],
        ),
])
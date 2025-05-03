from dash import html
from dash import dcc
import dash_bootstrap_components as dbc

index_layout = html.Div(
    className="min-vh-100 bg-light",
    children=[
        html.Title("DataViz Suite"),
        
        # 主容器
        dbc.Container(
            className="py-5",
            children=[
                # 标题区
                html.Div(
                    className="text-center mb-5 animate__animated animate__fadeIn",
                    children=[
                        html.H1(
                            "Data Visualization Platform",
                            className="display-4 mb-3 text-primary fw-bold",
                        ),
                        html.P(
                            "Transform raw data into meaningful insights",
                            className="lead text-muted",
                        ),
                    ],
                ),

                # 功能卡片
                dbc.Row(
                    className="g-4",
                    children=[
                        dbc.Col(
                            lg=4,
                            children=[
                                dbc.Card(
                                    className="h-100 border-0 shadow-sm hover-card",
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
                                    className="h-100 border-0 shadow-sm hover-card",
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
                    className="mt-5 pt-4 text-muted text-center",
                    children=[
                        html.Hr(className="my-4"),
                        html.P(
                            "© 2023 DataViz Suite. All rights reserved.",
                            className="small",
                        ),
                    ],
                ),
            ],
        ),
])
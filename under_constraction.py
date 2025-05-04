# construction.py
from dash import html, dcc, callback
import dash_bootstrap_components as dbc
from datetime import datetime
from dash import Input, Output

construction_layout = html.Div(
    className="min-vh-100 bg-light d-flex align-items-center",
    children=[
        dbc.Container(
            className="py-5 text-center animate__animated animate__fadeIn",
            style={'position': 'relative', 'zIndex': 1},
            children=[
                dbc.Row(
                    className="justify-content-center mb-4",
                    children=[
                        dbc.Col(
                            lg=8,
                            children=[
                                html.Div(
                                    className="construction-icon mb-4",
                                    children=[
                                        html.Span(
                                            "🚧",
                                            className="display-1 animate__animated animate__pulse animate__infinite",
                                            style={"fontSize": "8rem", 'userSelect': 'none'}
                                        )
                                    ]
                                ),
                                html.H1(
                                    "Under Construction",
                                    className="dynamic-gradient-text-construction mb-4",
                                    style={"fontSize": "3.5rem", 'userSelect': 'none'}
                                ),
                                html.P(
                                    className="lead text-muted mb-5",
                                    style={"fontSize": "1.5rem"},
                                    children=[
                                        html.Span("TiiJeiJ8", className="d-inline-block dynamic-gradient-text-construc-sub", style={'fontSzie': '1rem'}),
                                        html.Span(" is exerting to his utmost!!!  💪"),
                                    ]
                                ),
                                dbc.Button(
                                    "Home",
                                    href="/",
                                    color="primary",
                                    className="px-5 py-3 btn-animated hover-button",
                                    style={"borderRadius": "2rem"}
                                ),
                                html.Div(
                                    className="mt-5",
                                    children=[
                                        html.P(
                                            "Estimated Launch Date",
                                            className="text-uppercase text-muted mb-2",
                                            style={"letterSpacing": "2px"}
                                        ),
                                        html.Div(
                                            id="countdown",
                                            className="text-muted mb-2",
                                            style={
                                                "fontFamily": "monospace",
                                                "letter-spacing": "2px",
                                            }
                                        ),
                                    ]
                                )
                            ]
                        )
                    ]
                ),
                
                html.Footer(
                    className="text-center text-muted p-3 mt-4 border-top position-absolute bottom-0 start-50 translate-middle-x",
                    children=f"Fuck Charts © {datetime.now().year} - TiiJeiJ8"
                )
            ]
        ),
        dcc.Interval(id='construction-interval', interval=1000, n_intervals=0)
    ]
)

def register_construction_callbacks(app):
    @app.callback(
        Output('countdown', 'children'),
        Input('construction-interval', 'n_intervals')
    )
    def update_countdown(n):
        target_date = datetime(2099, 12, 29)
        remaining = target_date - datetime.now()

        if remaining.total_seconds() <= 0:
            return html.Span("Go go go !!🎉", style={'color': 'green'})

        years = remaining.days // 365
        days = remaining.days % 365
        hours, remainder = divmod(remaining.seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return html.Div([
                f"{target_date.strftime('%B %d, %Y')}",
                html.Br(),
                f"{years} Years {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds",
            ])
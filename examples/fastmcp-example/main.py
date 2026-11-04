import json

from fastmcp import FastMCP
from fastmcp.apps import AppConfig, ResourceCSP

mcp = FastMCP("My MCP Server")

# Points at the local dev server (`npm start`)
TERRA_COMPONENTS_BASE_URL = "http://localhost:4000/dist"

MAP_VIEW_URI = "ui://terra-map-demo/view.html"


@mcp.tool(app=AppConfig(resource_uri=MAP_VIEW_URI))
def render_map(request: str = "") -> str:
    """
    Demo a terra-map visualization.

    This is a hardcoded demo: it always renders the same terra-map config
    (NASA GIBS MODIS Terra true-color imagery over North America for
    2024-06-01), regardless of what `request` says. Mirrors the "Adding
    GIBS Imagery" example in docs/pages/components/map.md.
    """
    return json.dumps(
        {
            "layer": "MODIS_Terra_CorrectedReflectance_TrueColor",
            "date": "2024-06-01",
            "extent": [-130, 20, -60, 55],  # west, south, east, north
        }
    )


@mcp.resource(
    MAP_VIEW_URI,
    app=AppConfig(
        csp=ResourceCSP(
            resource_domains=[
                "http://localhost:4000",
                "https://unpkg.com",
                "https://gibs.earthdata.nasa.gov",
            ],
        )
    ),
)
def map_view() -> str:
    """terra-map viewer, driven by render_map's tool result."""
    return f"""\
<!DOCTYPE html>
<html>
<head>
  <meta name="color-scheme" content="light dark">
  <link
    rel="stylesheet"
    href="{TERRA_COMPONENTS_BASE_URL}/themes/horizon.css"
  />
  <script
    type="module"
    src="{TERRA_COMPONENTS_BASE_URL}/terra-ui-components-autoloader.js"
  ></script>
  <style>
    html, body {{ height: 100%; margin: 0; }}
    terra-map {{ display: block; height: 100%; }}
  </style>
</head>
<body class="terra-prefers-color-scheme">
  <terra-map id="map" has-navigation fill></terra-map>

  <script type="module">
    import {{ App }} from "https://unpkg.com/@modelcontextprotocol/ext-apps@0.4.0/app-with-deps";
    import {{ GibsLayer }} from "{TERRA_COMPONENTS_BASE_URL}/components/map/layers/gibs.layer.js";

    const app = new App({{ name: "Terra Map Demo", version: "1.0.0" }});
    const mapEl = document.getElementById("map");

    app.ontoolresult = ({{ content }}) => {{
      const text = content?.find((c) => c.type === "text");
      if (!text) return;

      const data = JSON.parse(text.text);

      customElements.whenDefined("terra-map").then(() => {{
        const gibsLayer = new GibsLayer({{
          layer: data.layer,
          date: data.date,
          extent: data.extent,
        }});

        mapEl.addLayer(gibsLayer, {{ name: "gibs-imagery" }});
        mapEl.fitToExtent(data.extent, {{
          projection: "EPSG:4326",
          padding: [50, 50, 50, 50],
        }});
      }});
    }};

    await app.connect();
  </script>
</body>
</html>"""


if __name__ == "__main__":
    mcp.run()

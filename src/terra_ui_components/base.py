import anywidget
from importlib.metadata import version

PACKAGE_VERSION = version("terra_ui_components")

class TerraBaseWidget(anywidget.AnyWidget):
    # if set to true, we'll load the components library from a local `dist` folder
    # at the top of your Jupyter Notebook, just include: `TerraBaseWidget.set_local_mode(True)`
    use_local = False

    @classmethod
    def set_local_mode(cls, local=True):
        """Class method to globally set local mode for all Terra widgets"""
        cls.use_local = local

    @classmethod
    def get_autoloader(cls):

        # Allows you to develop the Python widgets against a local JavaScript build.

        if cls.use_local:
            styles_url = "http://localhost:4000/dist/themes/horizon.css"
            autoloader_url = "http://localhost:4000/dist/terra-ui-components-autoloader.js"
        else:
            styles_url = (
                "https://cdn.jsdelivr.net/npm/"
                "@nasa-terra/components@0.0.198/cdn/themes/horizon.css"
            )
        autoloader_url = (
            f"https://cdn.jsdelivr.net/npm/"
            f"@nasa-terra/components@{PACKAGE_VERSION}/"
            f"cdn/terra-ui-components-autoloader.js"
        )

        return f"""
        const terraStyles = document.createElement('link')
        terraStyles.rel = 'stylesheet'
        terraStyles.href = '{styles_url}'
        document.head.appendChild(terraStyles)

        const terraAutoloader = document.createElement('script')
        terraAutoloader.src = '{autoloader_url}'
        terraAutoloader.type = 'module'
        document.head.appendChild(terraAutoloader)
        """

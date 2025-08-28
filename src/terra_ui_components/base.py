import anywidget


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
        return f"""
        const terraStyles = document.createElement('link')
        terraStyles.rel = 'stylesheet'
        terraStyles.href = 'https://cdn.jsdelivr.net/npm/@nasa-terra/components@0.0.71/cdn/themes/horizon.css'
        //terraStyles.href = "https://localhost:4000/dist/themes/horizon.css"
        document.head.appendChild(terraStyles)

        const terraAutoloader = document.createElement('script')
        terraAutoloader.src = "https://cdn.jsdelivr.net/npm/@nasa-terra/components@0.0.71/cdn/terra-ui-components-autoloader.js"
        //terraAutoloader.src = "https://localhost:4000/dist/terra-ui-components-autoloader.js"
        terraAutoloader.type = 'module'
        document.head.appendChild(terraAutoloader)
        """

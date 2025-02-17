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
        // Only add autoloader if it hasn't been added yet
        if (!document.querySelector('#terra-autoloader')) {{
            let terraAutoloader = document.createElement('script')
            terraAutoloader.id = 'terra-autoloader'

            terraAutoloader.src = "https://cdn.jsdelivr.net/npm/@nasa-terra/components@latest/cdn/terra-ui-components-autoloader.js"
                
            terraAutoloader.type = 'module'
            document.querySelector('head').appendChild(terraAutoloader)
        }}
        """

import importlib.metadata
import traitlets
from ..base import TerraBaseWidget
import os

# Optional imports - check availability before using
try:
    import earthaccess
    from earthaccess.auth import netrc_path
    from earthaccess.exceptions import LoginStrategyUnavailable
    EARTHACCESS_AVAILABLE = True
except ImportError:
    EARTHACCESS_AVAILABLE = False
    earthaccess = None
    netrc_path = None
    LoginStrategyUnavailable = Exception

try:
    from tinynetrc import Netrc, NetrcParseError
    TINYNETRC_AVAILABLE = True
except ImportError:
    TINYNETRC_AVAILABLE = False
    Netrc = None
    NetrcParseError = Exception

try:
    __version__ = importlib.metadata.version("terra_earthdata_login")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraEarthdataLogin(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        const cell = el.closest('.lm-Widget');
        if (cell && cell.classList.contains('jp-mod-outputsScrolled')) {
            cell.classList.remove('jp-mod-outputsScrolled');
        }

        // create an instance of the component
        let component = document.createElement('terra-earthdata-login')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.loggedInMessage = model.get('loggedInMessage')
        component.loggedOutMessage = model.get('loggedOutMessage')
        component.loadingMessage = model.get('loadingMessage')
        component.username = model.get('username')
        component.password = model.get('password')
        component.autoLogin = model.get('autoLogin')

        /**
         * add the component to the cell
         * it should now be visible in the notebook!
         */
        el.appendChild(component)


        /**
         * Set up property change handlers
         * This way if someone in the Jupyter Notebook changes the property externally, we reflect the change
         * back to the component.
         * 
         * If this isn't here, the component can't be changed after it's initial render
         */
        model.on('change:loggedInMessage', () => {
            component.loggedInMessage = model.get('loggedInMessage')
        })
        model.on('change:loggedOutMessage', () => {
            component.loggedOutMessage = model.get('loggedOutMessage')
        })
        model.on('change:loadingMessage', () => {
            component.loadingMessage = model.get('loadingMessage')
        })
        model.on('change:username', () => {
            component.username = model.get('username')
        })
        model.on('change:password', () => {
            component.password = model.get('password')
        })
        model.on('change:autoLogin', () => {
            component.autoLogin = model.get('autoLogin')
        })
        model.on('change:credentialsError', () => {
            console.log('credentialsError: ', model.get('credentialsError'))
        })

        // listen for terra-login event and update the bearer token in the model
        component.addEventListener('terra-login', (e) => {
            model.set('bearerToken', e.detail.token)
            model.save_changes()
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well.
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    loggedInMessage = traitlets.Unicode('').tag(sync=True)
    loggedOutMessage = traitlets.Unicode('').tag(sync=True)
    loadingMessage = traitlets.Unicode('').tag(sync=True)
    bearerToken = traitlets.Unicode('').tag(sync=True)
    username = traitlets.Unicode().tag(sync=True)
    password = traitlets.Unicode().tag(sync=True)
    credentialsError = traitlets.Unicode('').tag(sync=True)
    autoLogin = traitlets.Bool(True).tag(sync=True)

    def _check_dependencies(self):
        """
        Check if required dependencies are available and raise an error if not.
        """
        missing_deps = []
        if not EARTHACCESS_AVAILABLE:
            missing_deps.append("earthaccess")
        if not TINYNETRC_AVAILABLE:
            missing_deps.append("tinynetrc")
        
        if missing_deps:
            deps_str = " and ".join(missing_deps)
            raise ImportError(
                f"The following required dependencies are not installed: {deps_str}. "
                f"Please install them using: pip install {' '.join(missing_deps)}"
            )

    @traitlets.default('username')
    def _default_username(self):
        """
        Get the default username from the .netrc file or environment variable
        """
        username, password = self._get_default_credentials()
        if username is not None:
            return username
        return ''

    @traitlets.default('password')
    def _default_password(self):
        """
        Get the default password from the .netrc file or environment variable
        """
        username, password = self._get_default_credentials()
        if password is not None:
            return password
        return ''

    @traitlets.observe("bearerToken")
    def _observe_bearer_token(self, change):
        """
        Whenever the bearer token changes, we want to login to earthaccess with the new token
        """
        if change["new"]:
            if not EARTHACCESS_AVAILABLE:
                raise ImportError(
                    "earthaccess is not installed. Please install it using: pip install earthaccess"
                )
            os.environ["EARTHDATA_TOKEN"] = change["new"]
            earthaccess.login(strategy='environment')

    def _get_default_credentials(self):
        """
        Get the default credentials from the .netrc file
        """
        try:
            return self._get_default_credentials_from_netrc()
        except Exception as e:
            self.credentialsError = str(e)
            return self._get_default_credentials_from_environment()

    def _get_default_credentials_from_netrc(self):
        """
        Get the default credentials from the .netrc file
        """
        if not EARTHACCESS_AVAILABLE:
            raise ImportError(
                "earthaccess is not installed. Please install it using: pip install earthaccess"
            )
        if not TINYNETRC_AVAILABLE:
            raise ImportError(
                "tinynetrc is not installed. Please install it using: pip install tinynetrc"
            )
        netrc_loc = netrc_path()

        try:
            my_netrc = Netrc(str(netrc_loc))
        except FileNotFoundError as err:
            raise LoginStrategyUnavailable(
                f"No .netrc found at {netrc_loc}") from err
        except NetrcParseError as err:
            raise LoginStrategyUnavailable(
                f"Unable to parse .netrc file {netrc_loc}"
            ) from err

        creds = my_netrc['urs.earthdata.nasa.gov']
        if creds is None:
            raise LoginStrategyUnavailable(
                f"Earthdata Login hostname urs.earthdata.nasa.gov not found in .netrc file {netrc_loc}"
            )

        username = creds["login"]
        password = creds["password"]

        if username is None:
            raise LoginStrategyUnavailable(
                f"Username not found in .netrc file {netrc_loc}"
            )
        if password is None:
            raise LoginStrategyUnavailable(
                f"Password not found in .netrc file {netrc_loc}"
            )

        return username, password

    def _get_default_credentials_from_environment(self):
        """
        Get the default credentials from the environment variable
        """
        return os.environ.get('EARTHDATA_USERNAME', ''), os.environ.get('EARTHDATA_PASSWORD', '')

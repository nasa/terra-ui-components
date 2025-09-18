const JUPYTER_LITE_URL = 'https://gesdisc.github.io/jupyterlite/lab/index.html'

function openJupyterLiteWindow(
    readyCb: (event: MessageEvent, window: Window) => void
) {
    const jupyterWindow = window.open(JUPYTER_LITE_URL, '_blank')

    if (!jupyterWindow) {
        console.error('Failed to open JupyterLite!')
        return
    }

    window.addEventListener('message', event => readyCb(event, jupyterWindow), {
        once: true,
    })

    return jupyterWindow
}

export function sendDataToJupyterNotebook<D>(type: string, data: D) {
    openJupyterLiteWindow((event, jupyterWindow) => {
        if (event.data?.type !== 'jupyterlite-ready') {
            return
        }

        console.log('JupyterLite is ready!')

        jupyterWindow.postMessage({ type, ...data }, '*')
    })
}

export function isNotebookEnv(): boolean {
    const w = window as any;

    return (
        typeof w.Jupyter !== "undefined" ||
        typeof w.IPython !== "undefined" ||
        typeof w.google?.colab !== "undefined" ||
        typeof w.__jupyterlab !== "undefined" ||
        document.querySelector(".jp-Notebook") !== null ||
        document.querySelector(".jupyter-widgets") !== null
    );
}
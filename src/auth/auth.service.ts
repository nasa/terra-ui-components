import { Environment, getEnvironment } from '../utilities/environment.js'

const TOKEN_KEY = 'terra-token'

export type User = {
    uid: string
    first_name: string
    last_name: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
}

const AUTH_URL =
    'https://zed7uleqxl.execute-api.us-east-1.amazonaws.com/default/terra-earthdata-oauth'

class AuthService {
    private authState: AuthState = {
        user: null,
        token: null,
        isLoading: false,
        error: null,
    }
    private listeners: Set<(state: AuthState) => void> = new Set()
    private currentTask: Promise<User | null> | null = null

    constructor() {
        // if the url contains the query param "code", we're coming back from a login flow
        // so we need to exchange the code for a token
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')

        if (code) {
            this.setState({ isLoading: true })
            this.exchangeCodeForToken(code)
        } else {
            this.authenticate()
        }
    }

    async exchangeCodeForToken(code: string) {
        const urlParams = new URLSearchParams(window.location.search)

        // remove "code" and "state" from URL
        urlParams.delete('code')
        urlParams.delete('state')
        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}${urlParams.size > 0 ? '?' + urlParams.toString() : ''}`
        )

        const url = `${AUTH_URL}/callback?code=${code}${getEnvironment() === Environment.UAT ? '&environment=uat' : ''}`

        // fetch the token from the auth URL
        const response = await fetch(url)
        const data = await response.json()

        // store token in local storage and update state
        localStorage.setItem(TOKEN_KEY, data.token)

        this.authenticate()
    }

    subscribe(
        listener: (state: AuthState) => void,
        bearerToken?: string
    ): () => void {
        this.listeners.add(listener)

        if (bearerToken) {
            this.setState({ token: bearerToken })

            this.authenticate().then(() => {
                // wait to finish authenticating before calling the listener
                listener(this.authState)
            })
        } else {
            listener(this.authState) // Immediately call with current state
        }

        return () => {
            this.listeners.delete(listener)
        }
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.authState))
    }

    private setState(updates: Partial<AuthState>) {
        this.authState = { ...this.authState, ...updates }
        this.notifyListeners()
    }

    async authenticate() {
        if (this.currentTask) {
            // we're already authenticating, return the current task
            return this.currentTask
        }

        this.setState({ isLoading: true, error: null })

        // authenticating via a component is getting the user info from Earthdata Login, if we have a token
        // if we don't have a token or it's invalid, the user will have to go through a redirect flow to EDL to login
        this.currentTask = this.getUserInfo()

        try {
            await this.currentTask
        } finally {
            this.currentTask = null
        }

        return this.currentTask
    }

    private async getUserInfo() {
        if (this.authState.user) {
            // we already have a user in state, just return early
            return this.authState.user
        }

        const token = this.authState.token ?? localStorage.getItem(TOKEN_KEY)

        if (!token) {
            // no token, set the state to logged out
            this.setState(this.getLoggedOutState())
            return null
        }

        this.setState({
            token,
            isLoading: true,
            error: null,
        })

        try {
            // if the environment is UAT, we need to add the environment to the URL
            const environment = getEnvironment()
            const url = `${AUTH_URL}/user${environment === Environment.UAT ? '?environment=uat' : ''}`

            // get user info from the auth service
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(response.statusText ?? 'Failed to get user info')
            }

            const userResponse = await response.json()

            this.setState({
                user: userResponse.user,
                token,
                isLoading: false,
                error: null,
            })

            return this.authState.user
        } catch (error) {
            console.error('Failed to get user info', error)

            localStorage.removeItem(TOKEN_KEY)

            this.setState({
                user: null,
                token,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to get user info',
            })

            return null
        }
    }

    private getLoggedOutState() {
        return {
            user: null,
            token: null,
            isLoading: false,
            error: null,
        }
    }

    login(): void {
        window.location.href = `${AUTH_URL}/login?redirect_uri=${window.location.href}${getEnvironment() === Environment.UAT ? '&environment=uat' : ''}`
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY)
        this.setState({
            user: null,
            token: null,
            isLoading: false,
            error: null,
        })
    }

    getState(): AuthState {
        return this.authState
    }
}

export const authService = new AuthService()

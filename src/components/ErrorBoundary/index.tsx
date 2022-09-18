import { stringifyError } from 'lib/stringifyError'
import { ErrorPage } from 'pages/ErrorPage'
import React, { ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

interface State {
    error?: unknown
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {}
    }

    static getDerivedStateFromError(error: unknown) {
        return { error }
    }

    resetError = () => {
        this.setState({
            error: undefined
        })
    }

    render() {
        const { error } = this.state

        if (error === undefined) {
            return this.props.children
        }

        return (
            <ErrorPage
                message={stringifyError(error)}
                resetError={this.resetError}
            />
        )
    }
}

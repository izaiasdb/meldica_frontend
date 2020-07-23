import React from 'react'

export default class CloneElement extends React.Component {
    render() {
        const { children, isAuthenticated } = this.props
        return React.Children.map(children, child => React.cloneElement(child, { isAuthenticated }))
    }
}
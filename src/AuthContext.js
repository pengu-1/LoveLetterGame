import React from 'react'

export const AuthContext = React.createContext()

export const AuthProvider = AuthContext.AuthProvider
export const AuthConsumer = AuthContext.Consumer

export default AuthContext
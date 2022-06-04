import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

export default class Product extends Component {
  render() {
    return(
      <Outlet/>
    )
  }
}
